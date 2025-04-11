
import React, { useEffect, useRef, useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Navigation, Pencil, Ruler } from 'lucide-react';

interface InteractiveMapProps {
  onLocationChange?: (lat: number, lng: number) => void;
  mode?: 'pan' | 'draw' | 'measure';
  editingDeviceId?: string | null;
  devices?: Array<{
    id: string;
    name: string;
    type: 'sensor' | 'valve' | 'weather-station';
    position: { lat: number; lng: number };
  }>;
}

// Add proper type declarations for Google Maps
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  onLocationChange, 
  mode = 'pan', 
  editingDeviceId = null,
  devices = [] 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const [userPosition, setUserPosition] = useState<{ lat: number, lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'pan' | 'draw' | 'measure'>(mode);
  const drawingManagerRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const deviceMarkersRef = useRef<Map<string, any>>(new Map());
  const polylineRef = useRef<any | null>(null);
  const measurePointsRef = useRef<any[]>([]);

  const loadGoogleMapsScript = () => {
    const apiKey = localStorage.getItem('googleMapsApiKey');
    
    if (!apiKey) {
      setError('No Google Maps API key found. Please set it in the map settings.');
      setIsLoading(false);
      return;
    }

    if (window.google) {
      initMap();
      return;
    }

    window.initMap = initMap;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing,geometry&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setError('Failed to load Google Maps. Please check your API key.');
      setIsLoading(false);
    };
    document.head.appendChild(script);
  };

  const initMap = () => {
    if (!mapRef.current) return;

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

    // Initialize the DrawingManager
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
        fillColor: '#FF0000',
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: '#FF0000',
        editable: true,
        draggable: true,
      },
      markerOptions: {
        draggable: true,
      },
    });
    drawingManager.setMap(mapInstance);
    drawingManagerRef.current = drawingManager;

    // Listen for polygon complete event
    window.google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon) => {
      toast({
        title: "Field Drawn",
        description: "Field boundary has been drawn. You can edit the points or save the field.",
      });
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

    // Render device markers
    renderDeviceMarkers(mapInstance);

    setMap(mapInstance);
    setIsLoading(false);
  };

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

      deviceMarkersRef.current.set(device.id, marker);
    });
  };

  const getDeviceIcon = (type: 'sensor' | 'valve' | 'weather-station') => {
    // Return appropriate SVG icon URL based on device type
    // These could be actual URLs to your SVG icons or data URLs
    switch (type) {
      case 'sensor':
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`);
      case 'valve':
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>`);
      case 'weather-station':
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFC107" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>`);
      default:
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPos = { lat: latitude, lng: longitude };
          setUserPosition(userPos);
          
          if (map) {
            map.setCenter(userPos);
            map.setZoom(15);
            
            // Clear existing markers
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];
            
            // Add a marker for the user's location
            const marker = new window.google.maps.Marker({
              position: userPos,
              map,
              title: 'Your Location',
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }
            });
            markersRef.current.push(marker);
          }
          
          if (onLocationChange) {
            onLocationChange(latitude, longitude);
          }

          toast({
            title: "Location Detected",
            description: `Your location has been detected at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
          
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError('Failed to get your location. Please check your browser permissions.');
          setIsLoading(false);
          
          toast({
            title: "Location Error",
            description: "Failed to detect your location. Please check your browser permissions.",
            variant: "destructive",
          });
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
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

  useEffect(() => {
    loadGoogleMapsScript();
    // Clean up function
    return () => {
      window.initMap = () => {}; // Reset global callback
      
      // Clean up polylines and markers
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      
      markersRef.current.forEach(marker => {
        marker.setMap(null);
      });
      
      deviceMarkersRef.current.forEach(marker => {
        marker.setMap(null);
      });
    };
  }, []);

  useEffect(() => {
    if (userPosition && map) {
      map.setCenter(userPosition);
    }
  }, [userPosition, map]);

  useEffect(() => {
    if (mode !== activeTool && map && drawingManagerRef.current) {
      setMapMode(mode);
    }
  }, [mode, map]);

  // Update device markers when devices change or when editing a device
  useEffect(() => {
    if (map && window.google) {
      renderDeviceMarkers(map);
    }
  }, [devices, editingDeviceId, map]);

  return (
    <Card className="w-full h-full">
      <CardContent className="p-0 relative overflow-hidden rounded-md">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted z-10 p-6">
            <div className="text-center">
              <p className="text-destructive font-medium mb-4">{error}</p>
              <Button onClick={loadGoogleMapsScript}>Retry Loading Map</Button>
            </div>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className="h-[500px] w-full rounded-md"
        ></div>
        
        <div className="absolute right-4 top-4 flex flex-col space-y-2">
          <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-sm hover:bg-white" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-sm hover:bg-white" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-sm hover:bg-white" onClick={getUserLocation}>
            <Navigation className="h-4 w-4" />
          </Button>
          <Button variant={activeTool === 'draw' ? "default" : "outline"} size="icon" className="bg-white/80 backdrop-blur-sm hover:bg-white" onClick={() => setMapMode('draw')}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant={activeTool === 'measure' ? "default" : "outline"} size="icon" className="bg-white/80 backdrop-blur-sm hover:bg-white" onClick={() => setMapMode('measure')}>
            <Ruler className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
