
import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveMap from '@/components/mapping/InteractiveMap';
import MapPlaceholder from './MapPlaceholder';
import MapToolbar from './MapToolbar';
import SoilLegend from './SoilLegend';
import { toast } from "@/hooks/use-toast";

interface SoilTabProps {
  hasApiKey: boolean;
  activeMode: 'pan' | 'draw' | 'measure';
  onLocationChange: (lat: number, lng: number) => void;
  onModeSelect: (mode: 'pan' | 'draw' | 'measure') => void;
  onGetUserLocation: () => void;
  onSaveMap: () => void;
}

const SoilTab = forwardRef<any, SoilTabProps>(({
  hasApiKey,
  activeMode,
  onLocationChange,
  onModeSelect,
  onGetUserLocation,
  onSaveMap,
}, ref) => {
  const mapRef = useRef<any>(null);
  
  useImperativeHandle(ref, () => ({
    getUserLocation: () => {
      if (mapRef.current && mapRef.current.getUserLocation) {
        mapRef.current.getUserLocation();
      } else {
        toast({
          title: "Map Not Ready",
          description: "The map is still loading. Please try again in a moment.",
          variant: "destructive",
        });
      }
    }
  }));
  
  const handleGetLocation = () => {
    if (mapRef.current && typeof mapRef.current.getUserLocation === 'function') {
      mapRef.current.getUserLocation();
    } else {
      toast({
        title: "Map Not Ready",
        description: "The map is still loading. Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Soil Type Mapping</CardTitle>
          </CardHeader>
          <CardContent>
            {hasApiKey ? (
              <InteractiveMap 
                ref={mapRef}
                onLocationChange={onLocationChange} 
                mode={activeMode} 
              />
            ) : (
              <MapPlaceholder />
            )}
            
            <MapToolbar
              activeMode={activeMode}
              onModeSelect={onModeSelect}
              onGetUserLocation={handleGetLocation}
              onSave={onSaveMap}
              showImportExport={false}
              drawButtonText="Draw Soil Zone"
            />
          </CardContent>
        </Card>
      </div>
      
      <SoilLegend />
    </div>
  );
});

SoilTab.displayName = 'SoilTab';

export default SoilTab;
