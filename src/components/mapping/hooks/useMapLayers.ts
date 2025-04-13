
import { useRef, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { Field, Zone } from '../types';

export const useMapLayers = () => {
  const fieldsLayerRef = useRef<Map<string, any>>(new Map());
  const zonesLayerRef = useRef<Map<string, any>>(new Map());
  
  const renderFieldsLayer = useCallback((
    google: any,
    mapInstance: any, 
    fields: Field[], 
    activeFieldId: string | null = null,
    isAddingDevice: boolean = false
  ) => {
    // Clear existing field layers
    fieldsLayerRef.current.forEach((field) => {
      field.setMap(null);
    });
    fieldsLayerRef.current.clear();

    // Add polygons for each field that has boundaries
    fields.forEach(field => {
      if (field.boundaries && field.boundaries.length > 0) {
        const isActive = field.id === activeFieldId;
        
        const fieldPolygon = new google.maps.Polygon({
          paths: field.boundaries,
          strokeColor: isActive ? '#22C55E' : '#4285F4',
          strokeOpacity: 0.8,
          strokeWeight: isActive ? 3 : 2,
          fillColor: isActive ? '#22C55E' : '#4285F4',
          fillOpacity: isActive ? 0.35 : 0.25,
          map: mapInstance,
          editable: false,
          clickable: !isAddingDevice // Disable clicking when adding a device
        });
        
        // Add click listener to select the field only if not in device placement mode
        if (!isAddingDevice) {
          google.maps.event.addListener(fieldPolygon, 'click', () => {
            // Highlight this field
            fieldPolygon.setOptions({
              strokeColor: '#22C55E',
              strokeWeight: 3,
              fillColor: '#22C55E',
              fillOpacity: 0.35
            });
            
            // Center on the field
            const bounds = new google.maps.LatLngBounds();
            field.boundaries?.forEach(coord => {
              bounds.extend(coord);
            });
            mapInstance.fitBounds(bounds);
            
            toast({
              title: "Field Selected",
              description: `Selected ${field.name}`,
            });
          });
        }
        
        // Add label for the field
        if (field.center) {
          const label = new google.maps.Marker({
            position: field.center,
            map: mapInstance,
            label: {
              text: field.name,
              color: "#FFFFFF",
              fontWeight: "bold"
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 0, // Makes the marker invisible
            },
            clickable: false // Never clickable
          });
          
          fieldsLayerRef.current.set(`${field.id}-label`, label);
        }
        
        fieldsLayerRef.current.set(field.id, fieldPolygon);
      }
    });
  }, []);

  const renderZonesLayer = useCallback((
    google: any,
    mapInstance: any, 
    zones: Zone[], 
    activeZoneId: string | null = null,
    isAddingDevice: boolean = false
  ) => {
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
        
        const zonePolygon = new google.maps.Polygon({
          paths: zone.boundaries,
          strokeColor: isActive ? '#22C55E' : zoneColor,
          strokeOpacity: 0.8,
          strokeWeight: isActive ? 3 : 2,
          fillColor: isActive ? '#22C55E' : zoneColor,
          fillOpacity: isActive ? 0.35 : 0.25,
          map: mapInstance,
          editable: false,
          clickable: !isAddingDevice // Disable clicking when adding a device
        });
        
        // Add click listener to select the zone only if not in device placement mode
        if (!isAddingDevice) {
          google.maps.event.addListener(zonePolygon, 'click', () => {
            // Highlight this zone
            zonePolygon.setOptions({
              strokeColor: '#22C55E',
              strokeWeight: 3,
              fillColor: '#22C55E',
              fillOpacity: 0.35
            });
            
            // Center on the zone
            const bounds = new google.maps.LatLngBounds();
            zone.boundaries?.forEach(coord => {
              bounds.extend(coord);
            });
            mapInstance.fitBounds(bounds);
            
            toast({
              title: "Irrigation Zone Selected",
              description: `Selected ${zone.name}`,
            });
          });
        }
        
        // Add label for the zone
        if (zone.center) {
          const label = new google.maps.Marker({
            position: zone.center,
            map: mapInstance,
            label: {
              text: zone.name,
              color: "#FFFFFF",
              fontWeight: "bold"
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 0, // Makes the marker invisible
            },
            clickable: false // Never clickable
          });
          
          zonesLayerRef.current.set(`${zone.id}-label`, label);
        }
        
        zonesLayerRef.current.set(zone.id, zonePolygon);
      }
    });
  }, []);

  const toggleFieldsLayer = useCallback((map: any) => {
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
  }, []);

  const toggleZonesLayer = useCallback((map: any) => {
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
  }, []);

  const showField = useCallback((google: any, map: any, field: Field) => {
    if (!map || !field.boundaries) return;

    // First create new bounds
    const bounds = new google.maps.LatLngBounds();
    field.boundaries.forEach((coord: any) => {
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
  }, []);

  const showZone = useCallback((google: any, map: any, zone: Zone) => {
    if (!map || !zone.boundaries) return;

    // First create new bounds
    const bounds = new google.maps.LatLngBounds();
    zone.boundaries.forEach((coord: any) => {
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
  }, []);

  return {
    fieldsLayerRef,
    zonesLayerRef,
    renderFieldsLayer,
    renderZonesLayer,
    toggleFieldsLayer,
    toggleZonesLayer,
    showField,
    showZone
  };
};
