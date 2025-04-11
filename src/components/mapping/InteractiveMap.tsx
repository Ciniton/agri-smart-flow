
import React, { useEffect, useRef, useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Navigation, Pencil, Ruler } from 'lucide-react';

interface InteractiveMapProps {
  onLocationChange?: (lat: number, lng: number) => void;
  mode?: 'pan' | 'draw' | 'measure';
}

// Add proper type declarations for Google Maps
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ onLocationChange, mode = 'pan' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userPosition, setUserPosition] = useState<{ lat: number, lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'pan' | 'draw' | 'measure'>(mode);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const measurePointsRef = useRef<google.maps.LatLng[]>([]);

  const loadGoogleMapsScript = () => {
    const apiKey = localStorage.getItem('googleMapsApiKey');
    
    if (!apiKey) {
      setError('No Google Maps API key found. Please set it in the Admin configuration.');
      setIsLoading(false);
      return;
    }

    if (window.google) {
      initMap();
      return;
    }

    window.initMap = initMap;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing&callback=initMap`;
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

    // Add a marker if we have user position
    if (userPosition) {
      new window.google.maps.Marker({
        position: userPosition,
        map: mapInstance,
        title: 'Your Location',
        draggable: true,
      });
    }

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

    // Set up click handler for measuring
    window.google.maps.event.addListener(mapInstance, 'click', (event) => {
      if (activeTool === 'measure') {
        const clickedLocation = event.latLng;
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
    });

    setMap(mapInstance);
    setIsLoading(false);
  };

  const getUserLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPos = { lat: latitude, lng: longitude };
          setUserPosition(userPos);
          
          if (map) {
            map.setCenter(userPos);
            map.setZoom(15);
            
            // Add a marker for the user's location
            new window.google.maps.Marker({
              position: userPos,
              map: map,
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
          }
          
          if (onLocationChange) {
            onLocationChange(latitude, longitude);
          }

          toast({
            title: "Location Detected",
            description: `Your location has been detected at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
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
    };
  }, []);

  useEffect(() => {
    if (userPosition && map) {
      map.setCenter(userPosition);
    }
  }, [userPosition, map]);

  useEffect(() => {
    if (map && drawingManagerRef.current) {
      setMapMode(mode);
    }
  }, [mode, map]);

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
          <Button variant="outline" size="icon" className="bg-white" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white" onClick={getUserLocation}>
            <Navigation className="h-4 w-4" />
          </Button>
          <Button variant={activeTool === 'draw' ? "default" : "outline"} size="icon" className="bg-white" onClick={() => setMapMode('draw')}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant={activeTool === 'measure' ? "default" : "outline"} size="icon" className="bg-white" onClick={() => setMapMode('measure')}>
            <Ruler className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
