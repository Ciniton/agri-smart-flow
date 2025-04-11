
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveMap from '@/components/mapping/InteractiveMap';
import MapPlaceholder from './MapPlaceholder';
import MapToolbar from './MapToolbar';
import DeviceList from './DeviceList';
import AddDeviceDialog from './AddDeviceDialog';
import { DeviceMarker } from './types';

interface DevicesTabProps {
  hasApiKey: boolean;
  activeMode: 'pan' | 'draw' | 'measure';
  devices: DeviceMarker[];
  location: { lat: number, lng: number } | null;
  newDevice: { name: string; type: 'sensor' | 'valve' | 'weather-station' };
  showAddDeviceDialog: boolean;
  onLocationChange: (lat: number, lng: number) => void;
  onModeSelect: (mode: 'pan' | 'draw' | 'measure') => void;
  onGetUserLocation: () => void;
  onSaveMap: () => void;
  setShowAddDeviceDialog: (show: boolean) => void;
  setNewDevice: (device: { name: string; type: 'sensor' | 'valve' | 'weather-station' }) => void;
  handleEditDevice: (deviceId: string) => void;
  handleAddDevice: () => void;
}

const DevicesTab: React.FC<DevicesTabProps> = ({
  hasApiKey,
  activeMode,
  devices,
  location,
  newDevice,
  showAddDeviceDialog,
  onLocationChange,
  onModeSelect,
  onGetUserLocation,
  onSaveMap,
  setShowAddDeviceDialog,
  setNewDevice,
  handleEditDevice,
  handleAddDevice,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Device Placement</CardTitle>
          </CardHeader>
          <CardContent>
            {hasApiKey ? (
              <InteractiveMap onLocationChange={onLocationChange} mode={activeMode} />
            ) : (
              <MapPlaceholder />
            )}
            
            <div className="flex justify-between mt-4">
              <div className="flex space-x-2">
                <MapToolbar
                  activeMode={activeMode}
                  onModeSelect={onModeSelect}
                  onGetUserLocation={onGetUserLocation}
                  onSave={onSaveMap}
                  showImportExport={false}
                />
                <AddDeviceDialog
                  open={showAddDeviceDialog}
                  onOpenChange={setShowAddDeviceDialog}
                  deviceName={newDevice.name}
                  deviceType={newDevice.type}
                  location={location}
                  onDeviceNameChange={(name) => setNewDevice({...newDevice, name})}
                  onDeviceTypeChange={(type) => setNewDevice({...newDevice, type})}
                  onAddDevice={handleAddDevice}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <DeviceList
        devices={devices}
        handleEditDevice={handleEditDevice}
        setShowAddDeviceDialog={setShowAddDeviceDialog}
      />
    </div>
  );
};

export default DevicesTab;
