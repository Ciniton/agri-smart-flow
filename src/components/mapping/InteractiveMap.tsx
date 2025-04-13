import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { toast } from "@/hooks/use-toast";
import { DeviceMarker, Field, Zone, GoogleLatLngLiteral } from './types';
import MapLoading from './components/MapLoading';
import { ZoomControls, DrawingControls, LayerControls } from './components/MapControls';
import { loadGoogleMapsScript, getDefaultMapOptions, getDrawingManagerOptions } from './utils/mapUtils';
import { getUserLocation, createUserLocationMarker } from './utils/locationUtils';
import { useMapLayers } from './hooks/useMapLayers';
import { useDeviceMarkers } from './hooks/useDeviceMarkers';
import { useDrawingTools } from './hooks/useDrawingTools';

// Declare google maps types to prevent TS errors
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface InteractiveMapProps {
  onLocationChange?: (lat: number, lng: number, fromMapClick?: boolean) => void;
  mode?: 'pan' | 'draw' | 'measure';
  editingDeviceId?: string | null;
  devices?: DeviceMarker[];
  fields?: Field[];
  zones?: Zone[];
  onFieldDrawn?: (path: GoogleLatLngLiteral[], area: { squareMeters: number; hectares: number }) => void;
  onZoneDrawn?: (path: GoogleLatLngLiteral[], area: { squareMeters: number; hectares: number }) => void;
  activeFieldId?: string | null;
  activeZoneId?: string | null;
  isAddingDevice?: boolean;
  isEditingLocation?: boolean;
  onDeviceSelect?: (deviceId: string) => void;
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
  activeZoneId = null,
  isAddingDevice = false,
  isEditingLocation = false,
  onDeviceSelect
}, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any | null>(null);
  const [userPosition, setUserPosition] = useState<{ lat: number, lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'pan' | 'draw' | 'measure'>(mode);
  
  const userMarkerRef = useRef<any | null>(null);
  const mapInitializedRef = useRef<boolean>(false);

  // Import custom hooks
  const { 
    fieldsLayerRef, 
    zonesLayerRef,
    renderFieldsLayer, 
    renderZonesLayer,
    toggleFieldsLayer,
    toggleZonesLayer,
    showField,
    showZone
  } = useMapLayers();

  const {
    deviceMarkersRef,
    renderDeviceMarkers,
    clearTempMarkers
  } = useDeviceMarkers();

  const {
    drawingManagerRef,
    setupDrawingManager,
    setMapMode
  } = useDrawingTools();

  const initMapScript = () => {
    const apiKey = localStorage.getItem('googleMapsApiKey');
    
    loadGoogleMapsScript(
      apiKey,
      (progress) => setLoadingProgress(progress),
      (errorMessage) => {
        setError(errorMessage);
        setIsLoading(false);
      },
      () => initMap()
    );
  };

  const initMap = () => {
    if (!mapRef.current) return;

    try {
      // Create map instance with default options
      const mapOptions = getDefaultMapOptions(userPosition);
      const mapInstance = new window.google.maps.Map(mapRef.current, mapOptions);

      // Initialize the DrawingManager
      const drawingManagerOptions = getDrawingManagerOptions();
      setupDrawingManager(
        window.google, 
        mapInstance, 
        drawingManagerOptions,
        onZoneDrawn,
        onFieldDrawn,
        activeFieldId,
        onLocationChange
      );

      // Notify when map is idle (fully loaded)
      window.google.maps.event.addListenerOnce(mapInstance, 'idle', () => {
        console.log('Map is fully loaded and ready');
        setIsLoading(false);
        mapInitializedRef.current = true;
        
        // Render fields, zones and devices after map is fully loaded
        renderFieldsLayer(window.google, mapInstance, fields, activeFieldId, isAddingDevice);
        renderZonesLayer(window.google, mapInstance, zones, activeZoneId, isAddingDevice);
        renderDeviceMarkers(window.google, mapInstance, devices, fields, zones, editingDeviceId, onLocationChange, isAddingDevice, onDeviceSelect, isEditingLocation);
      });

      setMap(mapInstance);

      // If we already have user position, center on it immediately
      if (userPosition) {
        mapInstance.setCenter(userPosition);
        mapInstance.setZoom(15);
        const marker = createUserLocationMarker(window.google, mapInstance, userPosition);
        userMarkerRef.current = marker;
      }
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize Google Maps. Please reload the page and try again.');
      setIsLoading(false);
    }
  };

  const handleGetUserLocation = () => {
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
      
      getUserLocation(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        },
        (position) => {
          setUserPosition(position);
          
          if (map) {
            map.setCenter(position);
            map.setZoom(15);
            
            // Add a marker for the user's location
            if (userMarkerRef.current) {
              userMarkerRef.current.setMap(null);
            }
            const marker = createUserLocationMarker(window.google, map, position);
            userMarkerRef.current = marker;
          }
          
          if (onLocationChange) {
            onLocationChange(position.lat, position.lng);
          }
        },
        (errorMessage) => {
          setError(errorMessage);
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

  const handleSelectMode = (newMode: 'pan' | 'draw' | 'measure') => {
    setActiveTool(newMode);
    if (window.google && map) {
      setMapMode(window.google, map, newMode);
    }
  };

  // Initialize map when component mounts
  useEffect(() => {
    initMapScript();
    
    // Clean up function
    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
    };
  }, []);

  // Update mode when prop changes
  useEffect(() => {
    if (mode !== activeTool) {
      setActiveTool(mode);
      if (window.google && map && drawingManagerRef.current) {
        setMapMode(window.google, map, mode);
      }
    }
  }, [mode]);

  // Update device markers when devices prop changes or isAddingDevice changes
  useEffect(() => {
    if (map && mapInitializedRef.current && window.google) {
      renderDeviceMarkers(
        window.google, 
        map, 
        devices, 
        fields, 
        zones, 
        editingDeviceId, 
        onLocationChange,
        isAddingDevice,
        onDeviceSelect,
        isEditingLocation
      );
    }
  }, [devices, editingDeviceId, isAddingDevice, isEditingLocation]);

  // Update fields layer when fields prop changes
  useEffect(() => {
    if (map && mapInitializedRef.current && window.google) {
      renderFieldsLayer(window.google, map, fields, activeFieldId, isAddingDevice);
    }
  }, [fields, activeFieldId, isAddingDevice]);

  // Update zones layer when zones prop changes
  useEffect(() => {
    if (map && mapInitializedRef.current && window.google) {
      renderZonesLayer(window.google, map, zones, activeZoneId, isAddingDevice);
    }
  }, [zones, activeZoneId, isAddingDevice]);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    getUserLocation: handleGetUserLocation,
    centerOnLocation,
    showField: (field: Field) => showField(window.google, map, field),
    showZone: (zone: Zone) => showZone(window.google, map, zone),
    clearTempMarkers: () => clearTempMarkers()
  }));

  return (
    <div className="relative w-full">
      <MapLoading 
        isLoading={isLoading} 
        loadingProgress={loadingProgress} 
        error={error} 
        onRetry={initMapScript} 
      />
      
      <div 
        ref={mapRef} 
        className="w-full h-[calc(100vh-20rem)] min-h-[400px] rounded-md overflow-hidden"
      />
      
      {isAddingDevice && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-background/90 z-10 p-2 rounded-md border border-primary">
          <p className="text-sm text-center font-medium">Click anywhere on the map to place a device</p>
        </div>
      )}
      
      {editingDeviceId && isEditingLocation && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-background/90 z-10 p-2 rounded-md border border-primary">
          <p className="text-sm text-center font-medium">You can drag the device to a new location</p>
        </div>
      )}
      
      <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      <DrawingControls activeTool={activeTool} onSelectMode={handleSelectMode} />
      <LayerControls 
        onToggleFields={() => toggleFieldsLayer(map)} 
        onToggleZones={() => toggleZonesLayer(map)} 
      />
    </div>
  );
});

InteractiveMap.displayName = 'InteractiveMap';

export default InteractiveMap;
