
import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveMap from '@/components/mapping/InteractiveMap';
import MapPlaceholder from './MapPlaceholder';
import MapToolbar from './MapToolbar';
import DeviceList from './DeviceList';
import AddDeviceDialog from './AddDeviceDialog';
import { DeviceMarker, Field } from './types';
import { toast } from "@/hooks/use-toast";
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DevicesTabProps {
  hasApiKey: boolean;
  activeMode: 'pan' | 'draw' | 'measure';
  devices: DeviceMarker[];
  fields: Field[];
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
  setDevices: React.Dispatch<React.SetStateAction<DeviceMarker[]>>;
}

const DevicesTab = forwardRef<any, DevicesTabProps>(({
  hasApiKey,
  activeMode,
  devices,
  fields,
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
  setDevices
}, ref) => {
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
  const [deviceDetails, setDeviceDetails] = useState<DeviceMarker | null>(null);
  
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
  
  const handleStartEditDevice = (deviceId: string) => {
    setEditingDeviceId(deviceId);
    handleEditDevice(deviceId);
  };
  
  const handleFinishEdit = () => {
    if (!editingDeviceId) return;
    
    const editedDevice = devices.find(d => d.id === editingDeviceId);
    if (editedDevice && location) {
      // Update the device's position
      setDevices(prevDevices => 
        prevDevices.map(d => 
          d.id === editingDeviceId 
            ? { ...d, position: { ...location } } 
            : d
        )
      );
      
      toast({
        title: "Device Updated",
        description: `Position updated for ${editedDevice.name}`,
      });
    }
    
    setEditingDeviceId(null);
    onSaveMap();
  };

  const handleViewDevice = (device: DeviceMarker) => {
    setActiveDeviceId(device.id);
    setDeviceDetails(device);
    
    // Center the map on the device
    if (mapRef.current) {
      mapRef.current.centerOnLocation(device.position, 18);
      
      // If the device is associated with a field, show the field
      if (device.fieldId) {
        const field = fields.find(f => f.id === device.fieldId);
        if (field && field.boundaries) {
          mapRef.current.showField(field);
        }
      }
    }
  };

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

  const handleAddDeviceWithField = () => {
    if (!newDevice.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a device name.",
        variant: "destructive"
      });
      return;
    }
    
    if (!location) {
      toast({
        title: "Location Needed",
        description: "Please click on the map or use the location button to set a device position.",
        variant: "destructive"
      });
      return;
    }
    
    const device: DeviceMarker = {
      id: `device-${Date.now()}`,
      name: newDevice.name,
      type: newDevice.type,
      position: { ...location },
      fieldId: selectedFieldId || undefined,
      lastReading: {
        timestamp: new Date().toISOString(),
        value: Math.random() * 100 // Mock data for demo
      }
    };
    
    setDevices(prev => [...prev, device]);
    setNewDevice({ name: '', type: 'sensor' });
    setSelectedFieldId('');
    setShowAddDeviceDialog(false);
    
    toast({
      title: "Device Added",
      description: `Device "${device.name}" placed at ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
    });
  };

  // When a field is selected in the dropdown, center the map on that field
  useEffect(() => {
    if (selectedFieldId && mapRef.current) {
      const field = fields.find(f => f.id === selectedFieldId);
      if (field && field.center) {
        mapRef.current.centerOnLocation(field.center, 16);
        setSelectedField(field);
        
        // Show the field boundaries
        if (field.boundaries) {
          mapRef.current.showField(field);
        }
        
        toast({
          title: "Field Selected",
          description: `Centered on ${field.name}. Click on the map to place your device.`,
        });
      }
    }
  }, [selectedFieldId, fields]);

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
              {selectedField && !editingDeviceId && (
                <span className="ml-2 text-sm text-primary opacity-80">
                  (Field: {selectedField.name})
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
                fields={fields}
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
                  onAddDevice={handleAddDeviceWithField}
                  fields={fields}
                  selectedFieldId={selectedFieldId}
                  onFieldSelect={setSelectedFieldId}
                />
              </div>
            </div>

            {deviceDetails && (
              <div className="mt-4 p-4 border rounded-md bg-muted/50">
                <h3 className="font-medium text-lg mb-2 flex items-center">
                  <Info className="mr-2 h-5 w-5 text-primary" />
                  Device Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{deviceDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{deviceDetails.type.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">
                      {deviceDetails.position.lat.toFixed(6)}, {deviceDetails.position.lng.toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Field</p>
                    <p className="font-medium">
                      {deviceDetails.fieldId 
                        ? fields.find(f => f.id === deviceDetails.fieldId)?.name || "Unknown Field"
                        : "Unassigned"}
                    </p>
                  </div>
                  
                  {deviceDetails.lastReading && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Reading</p>
                        <p className="font-medium">
                          {deviceDetails.type === 'sensor' 
                            ? `${(deviceDetails.lastReading.value).toFixed(1)}% moisture`
                            : deviceDetails.type === 'weather-station'
                              ? `${(deviceDetails.lastReading.value / 3).toFixed(1)}°C, ${(deviceDetails.lastReading.value).toFixed(0)}% humidity`
                              : `Status: ${deviceDetails.lastReading.value > 50 ? 'Active' : 'Inactive'}`
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Update</p>
                        <p className="font-medium">
                          {new Date(deviceDetails.lastReading.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => setDeviceDetails(null)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <DeviceList
        devices={devices}
        fields={fields}
        handleEditDevice={handleStartEditDevice}
        setShowAddDeviceDialog={setShowAddDeviceDialog}
        editingDeviceId={editingDeviceId}
        handleViewDevice={handleViewDevice}
      />
    </div>
  );
});

DevicesTab.displayName = 'DevicesTab';

export default DevicesTab;
