
import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveMap from '@/components/mapping/InteractiveMap';
import MapPlaceholder from './MapPlaceholder';
import MapToolbar from './MapToolbar';
import DeviceList from './DeviceList';
import AddDeviceDialog from './AddDeviceDialog';
import { DeviceMarker, Field, Zone } from './types';
import { toast } from "@/hooks/use-toast";
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DevicesTabProps {
  hasApiKey: boolean;
  activeMode: 'pan' | 'draw' | 'measure';
  devices: DeviceMarker[];
  fields: Field[];
  zones: Zone[];
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
  zones = [], // Add zones prop with default empty array
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
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
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
      
      // If the device is associated with a zone, show the zone
      if (device.zoneId) {
        const zone = zones.find(z => z.id === device.zoneId);
        if (zone && zone.boundaries) {
          mapRef.current.showZone(zone);
        }
      }
      // If the device is associated with a field, show the field
      else if (device.fieldId) {
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

  const handleAddDeviceWithAssociations = () => {
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
      zoneId: selectedZoneId || undefined,
      lastReading: {
        timestamp: new Date().toISOString(),
        value: Math.random() * 100 // Mock data for demo
      }
    };
    
    setDevices(prev => [...prev, device]);
    setNewDevice({ name: '', type: 'sensor' });
    setSelectedFieldId('');
    setSelectedZoneId('');
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
        
        // Filter zones to only show those for this field
        setSelectedZoneId('');
        
        toast({
          title: "Field Selected",
          description: `Centered on ${field.name}. Select a zone or click on the map to place your device.`,
        });
      }
    }
  }, [selectedFieldId, fields]);

  // When a zone is selected in the dropdown, center the map on that zone
  useEffect(() => {
    if (selectedZoneId && mapRef.current) {
      const zone = zones.find(z => z.id === selectedZoneId);
      if (zone) {
        setSelectedZone(zone);
        
        // Show the zone boundaries
        if (zone.boundaries) {
          mapRef.current.showZone(zone);
        }
        
        toast({
          title: "Zone Selected",
          description: `Centered on ${zone.name}. Click on the map to place your device.`,
        });
      }
    }
  }, [selectedZoneId, zones]);

  // Filter zones based on selected field
  const filteredZones = selectedFieldId 
    ? zones.filter(zone => zone.fieldId === selectedFieldId)
    : zones;

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
              {selectedZone && !editingDeviceId && (
                <span className="ml-2 text-sm text-primary opacity-80">
                  (Zone: {selectedZone.name})
                </span>
              )}
              {selectedField && !selectedZone && !editingDeviceId && (
                <span className="ml-2 text-sm text-primary opacity-80">
                  (Field: {selectedField.name})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="fieldSelect">Select Field:</Label>
                <Select value={selectedFieldId} onValueChange={setSelectedFieldId}>
                  <SelectTrigger id="fieldSelect">
                    <SelectValue placeholder="Select a field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Fields</SelectItem>
                    {fields.map(field => (
                      <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="zoneSelect">Select Zone:</Label>
                <Select 
                  value={selectedZoneId} 
                  onValueChange={setSelectedZoneId}
                  disabled={filteredZones.length === 0}
                >
                  <SelectTrigger id="zoneSelect">
                    <SelectValue placeholder={filteredZones.length === 0 ? "No zones in selected field" : "Select a zone"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Zones</SelectItem>
                    {filteredZones.map(zone => (
                      <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          
            {hasApiKey ? (
              <InteractiveMap 
                ref={mapRef}
                onLocationChange={onLocationChange} 
                mode={activeMode} 
                editingDeviceId={editingDeviceId} 
                devices={devices}
                fields={fields}
                zones={zones}
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
                  onAddDevice={handleAddDeviceWithAssociations}
                  fields={fields}
                  selectedFieldId={selectedFieldId}
                  onFieldSelect={setSelectedFieldId}
                  zones={zones}
                  selectedZoneId={selectedZoneId}
                  onZoneSelect={setSelectedZoneId}
                  filteredZones={filteredZones}
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
                  <div>
                    <p className="text-sm text-muted-foreground">Zone</p>
                    <p className="font-medium">
                      {deviceDetails.zoneId 
                        ? zones.find(z => z.id === deviceDetails.zoneId)?.name || "Unknown Zone"
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
                
                <div className="mt-4 flex justify-end space-x-2">
                  {deviceDetails.type === 'valve' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        toast({
                          title: "Valve Toggled",
                          description: `Valve ${deviceDetails.name} has been ${deviceDetails.lastReading?.value > 50 ? 'closed' : 'opened'}.`,
                        });
                        
                        // Update the valve's status
                        setDevices(prev => 
                          prev.map(d => 
                            d.id === deviceDetails.id 
                              ? { 
                                  ...d, 
                                  lastReading: { 
                                    ...d.lastReading, 
                                    value: d.lastReading?.value && d.lastReading.value > 50 ? 0 : 100,
                                    timestamp: new Date().toISOString()
                                  } 
                                } 
                              : d
                          )
                        );
                        
                        // Update the deviceDetails to reflect the change
                        setDeviceDetails(prev => 
                          prev ? {
                            ...prev,
                            lastReading: {
                              ...prev.lastReading,
                              value: prev.lastReading?.value && prev.lastReading.value > 50 ? 0 : 100,
                              timestamp: new Date().toISOString()
                            }
                          } : null
                        );
                      }}
                    >
                      {deviceDetails.lastReading?.value > 50 ? 'Close Valve' : 'Open Valve'}
                    </Button>
                  )}
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
        zones={zones}
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
