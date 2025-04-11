
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveMap from '@/components/mapping/InteractiveMap';
import MapPlaceholder from './MapPlaceholder';
import MapToolbar from './MapToolbar';
import DeviceList from './DeviceList';
import AddDeviceDialog from './AddDeviceDialog';
import { DeviceMarker } from './types';
import { toast } from "@/hooks/use-toast";

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
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  
  const handleStartEditDevice = (deviceId: string) => {
    setEditingDeviceId(deviceId);
    handleEditDevice(deviceId);
  };
  
  const handleFinishEdit = () => {
    setEditingDeviceId(null);
    onSaveMap();
  };

  const handleGetLocation = () => {
    if (mapRef.current && mapRef.current.getUserLocation) {
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
        <Card className="shadow-md border-primary/10 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              Device Placement
              {editingDeviceId && (
                <span className="ml-2 text-sm text-primary opacity-80">
                  (Editing device - drag to reposition)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasApiKey ? (
              <InteractiveMap 
                ref={mapRef}
                onLocationChange={onLocationChange} 
                mode={activeMode} 
                editingDeviceId={editingDeviceId} 
                devices={devices}
              />
            ) : (
              <MapPlaceholder />
            )}
            
            <div className="flex justify-between mt-4">
              <div className="flex space-x-2">
                <MapToolbar
                  activeMode={activeMode}
                  onModeSelect={onModeSelect}
                  onGetUserLocation={handleGetLocation}
                  onSave={editingDeviceId ? handleFinishEdit : onSaveMap}
                  showImportExport={false}
                  saveButtonText={editingDeviceId ? "Save Device Position" : "Save Devices"}
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
        handleEditDevice={handleStartEditDevice}
        setShowAddDeviceDialog={setShowAddDeviceDialog}
        editingDeviceId={editingDeviceId}
      />
    </div>
  );
};

export default DevicesTab;
