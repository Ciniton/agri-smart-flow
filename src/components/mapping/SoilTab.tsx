
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveMap from '@/components/mapping/InteractiveMap';
import MapPlaceholder from './MapPlaceholder';
import MapToolbar from './MapToolbar';
import SoilLegend from './SoilLegend';

interface SoilTabProps {
  hasApiKey: boolean;
  activeMode: 'pan' | 'draw' | 'measure';
  onLocationChange: (lat: number, lng: number) => void;
  onModeSelect: (mode: 'pan' | 'draw' | 'measure') => void;
  onGetUserLocation: () => void;
  onSaveMap: () => void;
}

const SoilTab: React.FC<SoilTabProps> = ({
  hasApiKey,
  activeMode,
  onLocationChange,
  onModeSelect,
  onGetUserLocation,
  onSaveMap,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Soil Type Mapping</CardTitle>
          </CardHeader>
          <CardContent>
            {hasApiKey ? (
              <InteractiveMap onLocationChange={onLocationChange} mode={activeMode} />
            ) : (
              <MapPlaceholder />
            )}
            
            <MapToolbar
              activeMode={activeMode}
              onModeSelect={onModeSelect}
              onGetUserLocation={onGetUserLocation}
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
};

export default SoilTab;
