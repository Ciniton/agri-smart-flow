
import React, { useEffect, useRef, useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Navigation } from 'lucide-react';

interface InteractiveMapProps {
  onLocationChange?: (lat: number, lng: number) => void;
}

// Add proper type declarations for Google Maps
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ onLocationChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userPosition, setUserPosition] = useState<{ lat: number, lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
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
              draggable: true,
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

  useEffect(() => {
    loadGoogleMapsScript();
    // Clean up function
    return () => {
      window.initMap = () => {}; // Reset global callback
    };
  }, []);

  useEffect(() => {
    if (userPosition && map) {
      map.setCenter(userPosition);
    }
  }, [userPosition, map]);

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
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
