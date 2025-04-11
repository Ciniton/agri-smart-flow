
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveMap from '@/components/mapping/InteractiveMap';
import MapPlaceholder from './MapPlaceholder';
import MapToolbar from './MapToolbar';
import ZoneList from './ZoneList';
import { Field, Zone } from './types';

interface ZonesTabProps {
  hasApiKey: boolean;
  activeMode: 'pan' | 'draw' | 'measure';
  zones: Zone[];
  fields: Field[];
  newZone: { name: string; fieldId: string; irrigationType: 'low' | 'medium' | 'high' };
  showAddZoneDialog: boolean;
  onLocationChange: (lat: number, lng: number) => void;
  onModeSelect: (mode: 'pan' | 'draw' | 'measure') => void;
  onGetUserLocation: () => void;
  onSaveMap: () => void;
  setShowAddZoneDialog: (show: boolean) => void;
  setNewZone: (zone: { name: string; fieldId: string; irrigationType: 'low' | 'medium' | 'high' }) => void;
  handleEditZone: (zoneId: string) => void;
  handleAddZone: () => void;
}

const ZonesTab: React.FC<ZonesTabProps> = ({
  hasApiKey,
  activeMode,
  zones,
  fields,
  newZone,
  showAddZoneDialog,
  onLocationChange,
  onModeSelect,
  onGetUserLocation,
  onSaveMap,
  setShowAddZoneDialog,
  setNewZone,
  handleEditZone,
  handleAddZone,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Irrigation Zones</CardTitle>
          </CardHeader>
          <CardContent>
            {hasApiKey ? (
              <InteractiveMap onLocationChange={onLocationChange} mode={activeMode} />
            ) : (
              <MapPlaceholder>
                <div className="absolute left-4 bottom-4 p-2 bg-white rounded shadow">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded bg-blue-300 mr-2"></div>
                      <span className="text-xs">Low Irrigation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded bg-blue-500 mr-2"></div>
                      <span className="text-xs">Medium Irrigation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded bg-blue-700 mr-2"></div>
                      <span className="text-xs">High Irrigation</span>
                    </div>
                  </div>
                </div>
              </MapPlaceholder>
            )}
            
            <MapToolbar
              activeMode={activeMode}
              onModeSelect={onModeSelect}
              onGetUserLocation={onGetUserLocation}
              onSave={onSaveMap}
              showImportExport={false}
              drawButtonText="Draw Zone"
            />
          </CardContent>
        </Card>
      </div>
      
      <ZoneList
        zones={zones}
        fields={fields}
        newZone={newZone}
        showAddZoneDialog={showAddZoneDialog}
        setShowAddZoneDialog={setShowAddZoneDialog}
        setNewZone={setNewZone}
        handleEditZone={handleEditZone}
        handleAddZone={handleAddZone}
      />
    </div>
  );
};

export default ZonesTab;
