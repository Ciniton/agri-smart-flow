import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Navigation, Pencil, Ruler, Layers } from 'lucide-react';
import { DeviceMarker, Field, Zone, GoogleLatLngLiteral } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface InteractiveMapProps {
  onLocationChange?: (lat: number, lng: number) => void;
  mode?: 'pan' | 'draw' | 'measure';
  editingDeviceId?: string | null;
  devices?: DeviceMarker[];
  fields?: Field[];
  zones?: Zone[];
  onFieldDrawn?: (path: GoogleLatLngLiteral[], area: { squareMeters: number; hectares: number }) => void;
  onZoneDrawn?: (path: GoogleLatLngLiteral[], area: { squareMeters: number; hectares: number }) => void;
  activeFieldId?: string | null;
  activeZoneId?: string | null;
}

const InteractiveMap = forwardRef<any, InteractiveMapProps>(({ 
  onLocationChange, 
  mode = 'pan', 
  editingDeviceId = null,
  devices = [],
  fields = [],
  zones = [],
  onFieldDrawn,
  onZoneDrawn,
  activeFieldId = null,
  activeZoneId = null
}, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const [userPosition, setUserPosition] = useState<{ lat: number, lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'pan' | 'draw' | 'measure'>(mode);
  
  const drawingManagerRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const deviceMarkersRef = useRef<Map<string, any>>(new Map());
  const polylineRef = useRef<any | null>(null);
  const measurePointsRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any | null>(null);
  const mapInitializedRef = useRef<boolean>(false);
  const scriptLoadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fieldsLayerRef = useRef<Map<string, any>>(new Map());
  const zonesLayerRef = useRef<Map<string, any>>(new Map());
  const activePolygonRef = useRef<any | null>(null);

  const loadGoogleMapsScript = () => {
    const apiKey = localStorage.getItem('googleMapsApiKey');
    
    if (!apiKey) {
      setError('No Google Maps API key found. Please set it in the map settings.');
      setIsLoading(false);
      return;
    }

    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    // Set up a progress simulation for better UX
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      if (progress > 95) {
        clearInterval(progressInterval);
      } else {
        setLoadingProgress(progress);
      }
    }, 500);

    // Timeout for script loading
    scriptLoadingTimeoutRef.current = setTimeout(() => {
      clearInterval(progressInterval);
      setError('Google Maps is taking too long to load. Check your internet connection or API key.');
      setIsLoading(false);
    }, 15000); // 15 second timeout

    window.initMap = () => {
      clearInterval(progressInterval);
      if (scriptLoadingTimeoutRef.current) {
        clearTimeout(scriptLoadingTimeoutRef.current);
      }
      setLoadingProgress(100);
      initMap();
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing,geometry&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      clearInterval(progressInterval);
      if (scriptLoadingTimeoutRef.current) {
        clearTimeout(scriptLoadingTimeoutRef.current);
      }
      setError('Failed to load Google Maps. Please check your API key and internet connection.');
      setIsLoading(false);
    };
    document.head.appendChild(script);
  };

  const initMap = () => {
    if (!mapRef.current) return;

    try {
      // Default location (centered on North America)
      const defaultLocation = { lat: 39.8283, lng: -98.5795 };
      
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: userPosition || defaultLocation,
        zoom: 5,
        mapTypeId: 'satellite',
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: false, // We'll use our custom zoom controls
      });

      // Initialize the DrawingManager with updated options
      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            window.google.maps.drawing.OverlayType.POLYGON,
            window.google.maps.drawing.OverlayType.MARKER,
          ],
        },
        polygonOptions: {
          fillColor: '#4285F4',
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: '#4285F4',
          editable: true,
          draggable: true,
        },
        markerOptions: {
          draggable: true,
        },
      });
      drawingManager.setMap(mapInstance);
      drawingManagerRef.current = drawingManager;

      // Listen for polygon complete event - updated to handle both field and zone drawing
      window.google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon) => {
        // Calculate the area of the polygon
        const path = polygon.getPath().getArray();
        const pathCoordinates = path.map(point => ({
          lat: point.lat(),
          lng: point.lng()
        }));
        
        // Calculate area in square meters
        const areaInSquareMeters = window.google.maps.geometry.spherical.computeArea(path);
        const areaInHectares = areaInSquareMeters / 10000; // Convert to hectares
        
        // Set this as the active polygon
        if (activePolygonRef.current) {
          activePolygonRef.current.setMap(null);
        }
        activePolygonRef.current = polygon;
        
        // Notify parent component about the drawn polygon - could be field or zone
        if (activeFieldId && onZoneDrawn) {
          // If a field is active, we're drawing a zone
          onZoneDrawn(pathCoordinates, {
            squareMeters: areaInSquareMeters,
            hectares: areaInHectares
          });
          
          toast({
            title: "Irrigation Zone Drawn",
            description: `Zone area: ${areaInSquareMeters.toLocaleString()} m² (${areaInHectares.toFixed(2)} hectares)`,
          });
        } else if (onFieldDrawn) {
          // Otherwise, we're drawing a field
          onFieldDrawn(pathCoordinates, {
            squareMeters: areaInSquareMeters,
            hectares: areaInHectares
          });
          
          toast({
            title: "Field Drawn",
            description: `Field area: ${areaInSquareMeters.toLocaleString()} m² (${areaInHectares.toFixed(2)} hectares)`,
          });
        }
        
        // Switch back to pan mode
        setMapMode('pan');
      });

      // Listen for marker complete event
      window.google.maps.event.addListener(drawingManager, 'markercomplete', (marker) => {
        const position = marker.getPosition();
        if (position && onLocationChange) {
          onLocationChange(position.lat(), position.lng());
        }
        markersRef.current.push(marker);
        toast({
          title: "Device Placed",
          description: `Device marker placed at ${position?.lat().toFixed(6)}, ${position?.lng().toFixed(6)}`,
        });
      });

      // Set up click handler for measuring and map interaction
      window.google.maps.event.addListener(mapInstance, 'click', (event) => {
        const clickedLocation = event.latLng;
        
        // If in measure mode, add measurement points
        if (activeTool === 'measure') {
          measurePointsRef.current.push(clickedLocation);
          
          // Add a marker at the clicked point
          const marker = new window.google.maps.Marker({
            position: clickedLocation,
            map: mapInstance,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }
          });
          markersRef.current.push(marker);
          
          // If there are at least 2 points, draw or update the measuring line
          if (measurePointsRef.current.length >= 2) {
            if (polylineRef.current) {
              polylineRef.current.setPath(measurePointsRef.current);
            } else {
              polylineRef.current = new window.google.maps.Polyline({
                path: measurePointsRef.current,
                geodesic: true,
                strokeColor: '#4285F4',
                strokeOpacity: 1.0,
                strokeWeight: 3
              });
              polylineRef.current.setMap(mapInstance);
            }
            
            // Calculate and display distance
            const lastPoint = measurePointsRef.current[measurePointsRef.current.length - 1];
            const prevPoint = measurePointsRef.current[measurePointsRef.current.length - 2];
            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(prevPoint, lastPoint);
            
            toast({
              title: "Distance Measurement",
              description: `Last segment: ${(distance / 1000).toFixed(2)} km`,
            });
          }
        } 
        // In other modes, simply update the location
        else if (onLocationChange) {
          onLocationChange(clickedLocation.lat(), clickedLocation.lng());
        }
      });

      // Notify when map is idle (fully loaded)
      window.google.maps.event.addListenerOnce(mapInstance, 'idle', () => {
        console.log('Map is fully loaded and ready');
        setIsLoading(false);
        mapInitializedRef.current = true;
        
        // Render fields, zones and devices after map is fully loaded
        renderFieldsLayer(mapInstance);
        renderZonesLayer(mapInstance);
        renderDeviceMarkers(mapInstance);
      });

      setMap(mapInstance);

      // If we already have user position (from a previous getUserLocation call),
      // center on it immediately
      if (userPosition) {
        mapInstance.setCenter(userPosition);
        mapInstance.setZoom(15);
        addUserLocationMarker(mapInstance, userPosition);
      }
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize Google Maps. Please reload the page and try again.');
      setIsLoading(false);
    }
  };

  const renderFieldsLayer = (mapInstance: any) => {
    // Clear existing field layers
    fieldsLayerRef.current.forEach((field) => {
      field.setMap(null);
    });
    fieldsLayerRef.current.clear();

    // Add polygons for each field that has boundaries
    fields.forEach(field => {
      if (field.boundaries && field.boundaries.length > 0) {
        const isActive = field.id === activeFieldId;
        
        const fieldPolygon = new window.google.maps.Polygon({
          paths: field.boundaries,
          strokeColor: isActive ? '#22C55E' : '#4285F4',
          strokeOpacity: 0.8,
          strokeWeight: isActive ? 3 : 2,
          fillColor: isActive ? '#22C55E' : '#4285F4',
          fillOpacity: isActive ? 0.35 : 0.25,
          map: mapInstance,
          editable: false
        });
        
        // Add click listener to select the field
        window.google.maps.event.addListener(fieldPolygon, 'click', () => {
          // Highlight this field
          fieldPolygon.setOptions({
            strokeColor: '#22C55E',
            strokeWeight: 3,
            fillColor: '#22C55E',
            fillOpacity: 0.35
          });
          
          // Center on the field
          const bounds = new window.google.maps.LatLngBounds();
          field.boundaries?.forEach(coord => {
            bounds.extend(coord);
          });
          mapInstance.fitBounds(bounds);
          
          toast({
            title: "Field Selected",
            description: `Selected ${field.name}`,
          });
        });
        
        // Add label for the field
        if (field.center) {
          const label = new window.google.maps.Marker({
            position: field.center,
            map: mapInstance,
            label: {
              text: field.name,
              color: "#FFFFFF",
              fontWeight: "bold"
            },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 0, // Makes the marker invisible
            }
          });
          
          fieldsLayerRef.current.set(`${field.id}-label`, label);
        }
        
        fieldsLayerRef.current.set(field.id, fieldPolygon);
      }
    });
  };

  // Add a new function to render irrigation zones
  const renderZonesLayer = (mapInstance: any) => {
    // Clear existing zone layers
    zonesLayerRef.current.forEach((zone) => {
      zone.setMap(null);
    });
    zonesLayerRef.current.clear();

    // Add polygons for each zone that has boundaries
    zones.forEach(zone => {
      if (zone.boundaries && zone.boundaries.length > 0) {
        const isActive = zone.id === activeZoneId;
        
        // Use different colors based on irrigation type
        let zoneColor = '#3B82F6'; // Default blue
        if (zone.irrigationType === 'low') {
          zoneColor = '#93C5FD'; // Light blue
        } else if (zone.irrigationType === 'high') {
          zoneColor = '#1D4ED8'; // Dark blue
        }
        
        const zonePolygon = new window.google.maps.Polygon({
          paths: zone.boundaries,
          strokeColor: isActive ? '#22C55E' : zoneColor,
          strokeOpacity: 0.8,
          strokeWeight: isActive ? 3 : 2,
          fillColor: isActive ? '#22C55E' : zoneColor,
          fillOpacity: isActive ? 0.35 : 0.25,
          map: mapInstance,
          editable: false
        });
        
        // Add click listener to select the zone
        window.google.maps.event.addListener(zonePolygon, 'click', () => {
          // Highlight this zone
          zonePolygon.setOptions({
            strokeColor: '#22C55E',
            strokeWeight: 3,
            fillColor: '#22C55E',
            fillOpacity: 0.35
          });
          
          // Center on the zone
          const bounds = new window.google.maps.LatLngBounds();
          zone.boundaries?.forEach(coord => {
            bounds.extend(coord);
          });
          mapInstance.fitBounds(bounds);
          
          toast({
            title: "Irrigation Zone Selected",
            description: `Selected ${zone.name}`,
          });
        });
        
        // Add label for the zone
        if (zone.center) {
          const label = new window.google.maps.Marker({
            position: zone.center,
            map: mapInstance,
            label: {
              text: zone.name,
              color: "#FFFFFF",
              fontWeight: "bold"
            },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 0, // Makes the marker invisible
            }
          });
          
          zonesLayerRef.current.set(`${zone.id}-label`, label);
        }
        
        zonesLayerRef.current.set(zone.id, zonePolygon);
      }
    });
  };

  // Update renderDeviceMarkers to show zone association
  const renderDeviceMarkers = (mapInstance: any) => {
    // Clear existing device markers
    deviceMarkersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    deviceMarkersRef.current.clear();

    // Add markers for each device
    devices.forEach(device => {
      const markerIcon = {
        url: getDeviceIcon(device.type),
        scaledSize: new window.google.maps.Size(32, 32),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(16, 32)
      };

      const marker = new window.google.maps.Marker({
        position: device.position,
        map: mapInstance,
        title: device.name,
        icon: markerIcon,
        draggable: device.id === editingDeviceId, // Only make it draggable if it's being edited
        animation: device.id === editingDeviceId ? window.google.maps.Animation.BOUNCE : null
      });

      // If this marker is the one being edited, add a drag end listener
      if (device.id === editingDeviceId) {
        window.google.maps.event.addListener(marker, 'dragend', (event: any) => {
          if (onLocationChange) {
            onLocationChange(event.latLng.lat(), event.latLng.lng());
          }
          toast({
            title: "Device Moved",
            description: `Device "${device.name}" moved to new location`,
          });
        });

        // Center on the editing device
        mapInstance.setCenter(device.position);
        mapInstance.setZoom(18);
      }

      // Add click listener to select the device
      window.google.maps.event.addListener(marker, 'click', () => {
        if (onLocationChange) {
          onLocationChange(device.position.lat, device.position.lng);
        }
        
        if (device.id !== editingDeviceId) {
          toast({
            title: "Device Selected",
            description: `Selected ${device.name}`,
          });
        }
      });

      // Add info window with enhanced device details including zone information
      const infoWindowContent = `
        <div style="padding: 8px; max-width: 200px;">
          <h3 style="margin: 0 0 8px; font-weight: 500;">${device.name}</h3>
          <p style="margin: 0; font-size: 12px; color: #666;">
            <strong>Type:</strong> ${device.type.replace('-', ' ')}
          </p>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">
            <strong>Position:</strong> ${device.position.lat.toFixed(6)}, ${device.position.lng.toFixed(6)}
          </p>
          ${device.fieldId ? 
            `<p style="margin: 4px 0; font-size: 12px; color: #666;">
              <strong>Field:</strong> ${fields.find(f => f.id === device.fieldId)?.name || 'Unknown'}
            </p>` : ''
          }
          ${device.zoneId ? 
            `<p style="margin: 4px 0; font-size: 12px; color: #666;">
              <strong>Zone:</strong> ${zones.find(z => z.id === device.zoneId)?.name || 'Unknown'}
            </p>` : ''
          }
        </div>
      `;
      
      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent
      });
      
      window.google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(mapInstance, marker);
      });

      deviceMarkersRef.current.set(device.id, marker);
    });
  };

  const getDeviceIcon = (type: 'sensor' | 'valve' | 'weather-station') => {
    // Return appropriate SVG icon URL based on device type
    switch (type) {
      case 'sensor':
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a8 8 0 0 1-8-8c0-5 8-13 8-13s8 8 8 13a8 8 0 0 1-8 8z"/></svg>`);
      case 'valve':
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`);
      case 'weather-station':
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFC107" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>`);
      default:
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`);
    }
  };

  // Add a nice pulsing marker for the user's location
  const addUserLocationMarker = (mapInstance: any, position: {lat: number, lng: number}) => {
    // Remove existing user marker if there is one
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    // Create a pulse effect with concentric circles
    const pulseSymbol = {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: '#4285F4',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 12
    };

    // Create the marker
    const marker = new window.google.maps.Marker({
      position,
      map: mapInstance,
      icon: pulseSymbol,
      title: 'Your Location',
      animation: window.google.maps.Animation.BOUNCE,
      optimized: false // Needed for smooth CSS animations
    });

    // Apply a CSS animation to make it pulse
    const markerElement = marker.getIcon() as any;
    if (markerElement) {
      markerElement.fillOpacity = 0.7;
      markerElement.strokeOpacity = 0.7;
    }

    // Add an info window to show exact coordinates
    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div class="p-2 text-sm">
                  <strong>Your Location</strong><br>
                  Lat: ${position.lat.toFixed(6)}<br>
                  Lng: ${position.lng.toFixed(6)}
                </div>`
    });

    // Add a click listener to open the info window
    window.google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(mapInstance, marker);
    });

    // Open the info window initially
    infoWindow.open(mapInstance, marker);
    setTimeout(() => infoWindow.close(), 5000); // Close after 5 seconds

    // Save the marker reference
    userMarkerRef.current = marker;
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      // Check if map is initialized first
      if (!mapInitializedRef.current) {
        toast({
          title: "Map Not Ready",
          description: "The map is still initializing. Please try again in a moment.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Getting Location",
        description: "Detecting your current location...",
      });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPos = { lat: latitude, lng: longitude };
          setUserPosition(userPos);
          
          if (map) {
            map.setCenter(userPos);
            map.setZoom(15);
            
            // Add a marker for the user's location
            addUserLocationMarker(map, userPos);
          }
          
          if (onLocationChange) {
            onLocationChange(latitude, longitude);
          }

          toast({
            title: "Location Detected",
            description: `Your location has been detected at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Failed to get your location.";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please allow location access in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
            default:
              errorMessage = "An unknown error occurred while trying to access your location.";
              break;
          }
          
          setError(errorMessage);
          
          toast({
            title: "Location Error",
            description: errorMessage,
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,  // Try to get the most accurate position
          timeout: 10000,           // Time to wait for a position
          maximumAge: 0             // Don't use a cached position
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

  // Center the map on a specific location
  const centerOnLocation = (location: { lat: number, lng: number }, zoom = 15) => {
    if (map) {
      map.setCenter(location);
      map.setZoom(zoom);
    }
  };

  // Show field on the map (highlight it)
  const showField = (field: Field) => {
    if (!map || !field.boundaries) return;

    // First create new bounds
    const bounds = new window.google.maps.LatLngBounds();
    field.boundaries.forEach(coord => {
      bounds.extend(coord);
    });
    
    // Fit to these bounds
    map.fitBounds(bounds);
    
    // Highlight this field on the map
    const fieldPolygon = fieldsLayerRef.current.get(field.id);
    if (fieldPolygon) {
      fieldPolygon.setOptions({
        strokeColor: '#22C55E',
        strokeWeight: 3,
        fillColor: '#22C55E',
        fillOpacity: 0.35
      });
    }
  };

  // Show zone on the map (highlight it)
  const showZone = (zone: Zone) => {
    if (!map || !zone.boundaries) return;

    // First create new bounds
    const bounds = new window.google.maps.LatLngBounds();
    zone.boundaries.forEach(coord => {
      bounds.extend(coord);
    });
    
    // Fit to these bounds
    map.fitBounds(bounds);
    
    // Highlight this zone on the map
    const zonePolygon = zonesLayerRef.current.get(zone.id);
    if (zonePolygon) {
      zonePolygon.setOptions({
        strokeColor: '#22C55E',
        strokeWeight: 3,
        fillColor: '#22C55E',
        fillOpacity: 0.35
      });
    }
  };

  const handleZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom() || 5;
      map.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom() || 5;
      if (currentZoom > 1) {
        map.setZoom(currentZoom - 1);
      }
    }
  };

  const setMapMode = (newMode: 'pan' | 'draw' | 'measure') => {
    setActiveTool(newMode);
    
    if (!drawingManagerRef.current || !map) return;
    
    // Clear any ongoing measurements
    if (newMode !== 'measure' && measurePointsRef.current.length > 0) {
      measurePointsRef.current = [];
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      // Remove measurement markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }
    
    // Set appropriate drawing mode
    switch (newMode) {
      case 'pan':
        drawingManagerRef.current.setDrawingMode(null);
        map.setOptions({ draggableCursor: 'grab' });
        break;
      case 'draw':
        drawingManagerRef.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
        map.setOptions({ draggableCursor: 'crosshair' });
        break;
      case 'measure':
        drawingManagerRef.current.setDrawingMode(null);
        map.setOptions({ draggableCursor: 'crosshair' });
        break;
    }
  };

  // Toggle visibility of all fields
  const toggleFieldsLayer = () => {
    if (!map) return;
    
    const isLayerVisible = fieldsLayerRef.current.size > 0 && 
      Array.from(fieldsLayerRef.current.values())[0].getMap() !== null;
    
    fieldsLayerRef.current.forEach((layer) => {
      layer.setMap(isLayerVisible ? null : map);
    });
    
    toast({
      title: `Fields Layer ${isLayerVisible ? 'Hidden' : 'Shown'}`,
      description: `All field boundaries are now ${isLayerVisible ? 'hidden' : 'visible'} on the map`,
    });
  };

  // Add new function to toggle zones layer
  const toggleZonesLayer = () => {
    if (!map) return;
    
    const isLayerVisible = zonesLayerRef.current.size > 0 && 
      Array.from(zonesLayerRef.current.values())[0].getMap() !== null;
    
    zonesLayerRef.current.forEach((layer) => {
      layer.setMap(isLayerVisible ? null : map);
    });
    
    toast({
      title: `Irrigation Zones ${isLayerVisible ? 'Hidden' : 'Shown'}`,
      description: `All irrigation zone boundaries are now ${isLayerVisible ? 'hidden' : 'visible'} on the map`,
    });
  };

  // Clean up function for timeouts and intervals
