
import { useRef, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { SoilZone } from '../types';

export const useSoilLayers = () => {
  const soilZonesLayerRef = useRef<Map<string, any>>(new Map());
  
  const renderSoilZonesLayer = useCallback((
    google: any,
    mapInstance: any, 
    soilZones: SoilZone[], 
    activeSoilZoneId: string | null = null,
    isAddingZone: boolean = false
  ) => {
    // Clear existing soil zone layers
    soilZonesLayerRef.current.forEach((zone) => {
      zone.setMap(null);
    });
    soilZonesLayerRef.current.clear();

    // Add polygons for each soil zone that has boundaries
    soilZones.forEach(zone => {
      if (zone.boundaries && zone.boundaries.length > 0) {
        const isActive = zone.id === activeSoilZoneId;
        
        // Use the soil type's color or default to a color based on soil type
        let zoneColor = zone.color || getSoilTypeColor(zone.soilType);
        
        const zonePolygon = new google.maps.Polygon({
          paths: zone.boundaries,
          strokeColor: isActive ? '#22C55E' : zoneColor,
          strokeOpacity: 0.8,
          strokeWeight: isActive ? 3 : 2,
          fillColor: isActive ? '#22C55E' : zoneColor,
          fillOpacity: isActive ? 0.4 : 0.3,
          map: mapInstance,
          editable: false,
          clickable: !isAddingZone
        });
        
        // Add click listener to select the zone
        if (!isAddingZone) {
          google.maps.event.addListener(zonePolygon, 'click', () => {
            // Highlight this zone
            zonePolygon.setOptions({
              strokeColor: '#22C55E',
              strokeWeight: 3,
              fillColor: '#22C55E',
              fillOpacity: 0.4
            });
            
            // Center on the zone
            const bounds = new google.maps.LatLngBounds();
            zone.boundaries?.forEach(coord => {
              bounds.extend(coord);
            });
            mapInstance.fitBounds(bounds);
            
            toast({
              title: "Soil Zone Selected",
              description: `Selected ${zone.name} (${zone.soilType})`,
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
            clickable: false
          });
          
          soilZonesLayerRef.current.set(`${zone.id}-label`, label);
        }
        
        soilZonesLayerRef.current.set(zone.id, zonePolygon);
      }
    });
  }, []);

  const toggleSoilZonesLayer = useCallback((map: any) => {
    if (!map) return;
    
    const isLayerVisible = soilZonesLayerRef.current.size > 0 && 
      Array.from(soilZonesLayerRef.current.values())[0].getMap() !== null;
    
    soilZonesLayerRef.current.forEach((layer) => {
      layer.setMap(isLayerVisible ? null : map);
    });
    
    toast({
      title: `Soil Zones ${isLayerVisible ? 'Hidden' : 'Shown'}`,
      description: `All soil zone boundaries are now ${isLayerVisible ? 'hidden' : 'visible'} on the map`,
    });
  }, []);

  const showSoilZone = useCallback((google: any, map: any, zone: SoilZone) => {
    if (!map || !zone.boundaries) return;

    // First create new bounds
    const bounds = new google.maps.LatLngBounds();
    zone.boundaries.forEach((coord: any) => {
      bounds.extend(coord);
    });
    
    // Fit to these bounds
    map.fitBounds(bounds);
    
    // Highlight this zone on the map
    const zonePolygon = soilZonesLayerRef.current.get(zone.id);
    if (zonePolygon) {
      zonePolygon.setOptions({
        strokeColor: '#22C55E',
        strokeWeight: 3,
        fillColor: '#22C55E',
        fillOpacity: 0.4
      });
    }
  }, []);

  // Helper function to get color based on soil type
  const getSoilTypeColor = (soilType: string): string => {
    const soilTypeColors: {[key: string]: string} = {
      'sandy': '#F2FCE2',     // Soft Green
      'loamy': '#FEF7CD',     // Soft Yellow
      'clay': '#FEC6A1',      // Soft Orange
      'silty': '#E5DEFF',     // Soft Purple
      'peaty': '#FFDEE2',     // Soft Pink
      'chalky': '#FDE1D3',    // Soft Peach
      'loamy-sand': '#D3E4FD', // Soft Blue
      'sandy-clay': '#F1F0FB', // Soft Gray
      // Additional soil types can be added here
    };
    
    return soilTypeColors[soilType.toLowerCase()] || '#A1CCA5'; // Default color
  };

  return {
    soilZonesLayerRef,
    renderSoilZonesLayer,
    toggleSoilZonesLayer,
    showSoilZone,
    getSoilTypeColor
  };
};
