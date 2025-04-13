import { useRef, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { GoogleLatLngLiteral } from '../types';

export const useDrawingTools = () => {
  const drawingManagerRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any | null>(null);
  const measurePointsRef = useRef<any[]>([]);
  const activePolygonRef = useRef<any | null>(null);

  const setupDrawingManager = useCallback((
    google: any, 
    mapInstance: any, 
    options: any,
    onZoneDrawn?: (path: GoogleLatLngLiteral[], area: { squareMeters: number; hectares: number }) => void,
    onFieldDrawn?: (path: GoogleLatLngLiteral[], area: { squareMeters: number; hectares: number }) => void,
    activeFieldId: string | null = null,
    onLocationChange?: (lat: number, lng: number) => void
  ) => {
    const drawingManager = new google.maps.drawing.DrawingManager(options);
    drawingManager.setMap(mapInstance);
    drawingManagerRef.current = drawingManager;

    // Listen for polygon complete event - handle both field and zone drawing
    google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon: any) => {
      // Calculate the area of the polygon
      const path = polygon.getPath().getArray();
      const pathCoordinates = path.map((point: any) => ({
        lat: point.lat(),
        lng: point.lng()
      }));
      
      // Calculate area in square meters
      const areaInSquareMeters = google.maps.geometry.spherical.computeArea(path);
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
    });

    // Listen for marker complete event
    google.maps.event.addListener(drawingManager, 'markercomplete', (marker: any) => {
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
    google.maps.event.addListener(mapInstance, 'click', (event: any) => {
      const clickedLocation = event.latLng;
      
      // If in measure mode, handle measurement
      if (drawingManagerRef.current && drawingManagerRef.current._activeTool === 'measure') {
        measurePointsRef.current.push(clickedLocation);
        
        // Add a marker at the clicked point
        const marker = new google.maps.Marker({
          position: clickedLocation,
          map: mapInstance,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
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
            polylineRef.current = new google.maps.Polyline({
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
          const distance = google.maps.geometry.spherical.computeDistanceBetween(prevPoint, lastPoint);
          
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

    return drawingManager;
  }, []);

  const setMapMode = useCallback((
    google: any,
    map: any, 
    newMode: 'pan' | 'draw' | 'measure'
  ) => {
    if (!drawingManagerRef.current || !map) return;
    
    // Store the active tool for reference in click handler
    drawingManagerRef.current._activeTool = newMode;
    
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
        drawingManagerRef.current.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        map.setOptions({ draggableCursor: 'crosshair' });
        break;
      case 'measure':
        drawingManagerRef.current.setDrawingMode(null);
        map.setOptions({ draggableCursor: 'crosshair' });
        break;
    }
  }, []);

  return {
    drawingManagerRef,
    markersRef,
    polylineRef,
    measurePointsRef,
    activePolygonRef,
    setupDrawingManager,
    setMapMode
  };
};
