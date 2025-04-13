
import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveMap from '@/components/mapping/InteractiveMap';
import MapPlaceholder from './MapPlaceholder';
import MapToolbar from './MapToolbar';
import DeviceList from './DeviceList';
import AddDeviceDialog from './AddDeviceDialog';
import { DeviceMarker, Field, Zone } from './types';
import { toast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface DevicesTabProps {
  hasApiKey: boolean;
  activeMode: 'pan' | 'draw' | 'measure';
  devices: DeviceMarker[];
  fields: Field[];
  zones: Zone[];
  location: { lat: number, lng: number, fromMapClick?: boolean } | null;
  newDevice: { name: string; type: 'sensor' | 'valve' | 'weather-station'; fieldId?: string; zoneId?: string };
  showAddDeviceDialog: boolean;
  onLocationChange: (lat: number, lng: number, fromMapClick?: boolean) => void;
  onModeSelect: (mode: 'pan' | 'draw' | 'measure') => void;
  onGetUserLocation: () => void;
  onSaveMap: () => void;
  setShowAddDeviceDialog: (show: boolean) => void;
  setNewDevice: (device: { name: string; type: 'sensor' | 'valve' | 'weather-station'; fieldId?: string; zoneId?: string }) => void;
  handleEditDevice: (deviceId: string) => void;
  handleAddDevice: () => void;
  setDevices: React.Dispatch<React.SetStateAction<DeviceMarker[]>>;
}

const DevicesTab = forwardRef<any, DevicesTabProps>(({
  hasApiKey,
  activeMode,
  devices,
  fields,
  zones,
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
  const [selectedFieldId, setSelectedFieldId] = useState<string>("field_unassigned");
  const [selectedZoneId, setSelectedZoneId] = useState<string>("zone_unassigned");
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
  const [isAddingDevice, setIsAddingDevice] = useState<boolean>(false);
  const [showEditDeviceDialog, setShowEditDeviceDialog] = useState<boolean>(false);
  const [editingDevice, setEditingDevice] = useState<DeviceMarker | null>(null);
  const mapRef = useRef<any>(null);

  // Create a list of zones filtered by the selected field
  const filteredZones = selectedFieldId && selectedFieldId !== "field_unassigned" 
    ? zones.filter(zone => zone.fieldId === selectedFieldId)
    : zones;

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

  // Find selected field and zone objects when IDs change
  useEffect(() => {
    if (selectedFieldId && selectedFieldId !== "field_unassigned") {
      const field = fields.find(f => f.id === selectedFieldId);
      setSelectedField(field || null);
    } else {
      setSelectedField(null);
    }
  }, [selectedFieldId, fields]);

  useEffect(() => {
    if (selectedZoneId && selectedZoneId !== "zone_unassigned") {
      const zone = zones.find(z => z.id === selectedZoneId);
      setSelectedZone(zone || null);
    } else {
      setSelectedZone(null);
    }
  }, [selectedZoneId, zones]);

  // Reset zone selection when field changes
  useEffect(() => {
    if (selectedFieldId !== "field_unassigned") {
      setSelectedZoneId("zone_unassigned");
    }
  }, [selectedFieldId]);

  // Auto-open device dialog when location changes and isAddingDevice is true
  useEffect(() => {
    // Only open the dialog if location has been selected by a map click while in add device mode
    if (isAddingDevice && location && location.fromMapClick) {
      handleAddDeviceClick();
    }
  }, [location]);
  
  // When a device is selected for editing, find it and set its details
  useEffect(() => {
    if (editingDeviceId) {
      const device = devices.find(d => d.id === editingDeviceId);
      if (device) {
        setEditingDevice(device);
        
        // Set the field and zone selections to match the device
        if (device.fieldId) {
          setSelectedFieldId(device.fieldId);
        }
        
        if (device.zoneId) {
          setSelectedZoneId(device.zoneId);
        }
        
        setShowEditDeviceDialog(true);
      }
    }
  }, [editingDeviceId, devices]);

  const handleFieldSelect = (fieldId: string) => {
    setSelectedFieldId(fieldId || "field_unassigned");

    // When the field changes, reset the zone selection
    setSelectedZoneId("zone_unassigned");
    
    // If we have selected a valid field, center the map on it
    if (fieldId && fieldId !== "field_unassigned") {
      const field = fields.find(f => f.id === fieldId);
      if (field && field.center && mapRef.current) {
        mapRef.current.showField(field);
      }
    }
  };

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZoneId(zoneId || "zone_unassigned");
    
    // If we have selected a valid zone, center the map on it
    if (zoneId && zoneId !== "zone_unassigned") {
      const zone = zones.find(z => z.id === zoneId);
      if (zone && zone.center && mapRef.current) {
        mapRef.current.showZone(zone);
      }
    }
  };

  const handleDeviceNameChange = (name: string) => {
    setNewDevice({ ...newDevice, name });
  };

  const handleDeviceTypeChange = (type: 'sensor' | 'valve' | 'weather-station') => {
    setNewDevice({ ...newDevice, type });
  };

  const toggleAddDeviceMode = () => {
    setIsAddingDevice(!isAddingDevice);
    
    if (!isAddingDevice) {
      toast({
        title: "Add Device Mode Activated",
        description: "Click anywhere on the map to place a new device",
      });
    } else {
      toast({
        description: "Add Device Mode Deactivated",
      });
      
      // If we deactivate the mode, remove the temporary marker if it exists
      if (mapRef.current) {
        mapRef.current.clearTempMarkers();
      }
    }
  };

  const handleAddDeviceClick = () => {
    // Set the field and zone IDs based on the current selections
    setNewDevice({
      ...newDevice,
      fieldId: selectedFieldId !== "field_unassigned" ? selectedFieldId : undefined,
      zoneId: selectedZoneId !== "zone_unassigned" ? selectedZoneId : undefined
    });
    
    // Show the dialog
    setShowAddDeviceDialog(true);
    
    // Exit the adding device mode
    setIsAddingDevice(false);
    
    // Clear any temporary markers
    if (mapRef.current) {
      mapRef.current.clearTempMarkers();
    }
  };

  const handleViewDevice = (device: DeviceMarker) => {
    setActiveDeviceId(device.id);
    
    // Center the map on the device
    if (device.position && mapRef.current) {
      mapRef.current.centerOnLocation(device.position);
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

  const handleDeviceAddSubmit = () => {
    // Make sure we have the required data
    if (!newDevice.name || !location) {
      toast({
        title: "Missing Information",
        description: "Please enter a device name and select a location on the map.",
        variant: "destructive"
      });
      return;
    }
    
    // Create the new device with field and zone assignments if selected
    const deviceData = {
      id: `device-${Date.now()}`,
      name: newDevice.name,
      type: newDevice.type,
      position: { ...location },
      fieldId: selectedFieldId !== "field_unassigned" ? selectedFieldId : undefined,
      zoneId: selectedZoneId !== "zone_unassigned" ? selectedZoneId : undefined
    };
    
    // Add to devices list
    setDevices([...devices, deviceData]);
    
    // Reset form and close dialog
    setNewDevice({ 
      name: '', 
      type: 'sensor',
      fieldId: selectedFieldId,
      zoneId: selectedZoneId
    });
    setShowAddDeviceDialog(false);
    
    toast({
      title: "Device Added",
      description: `${deviceData.name} has been added to your map.`,
    });
  };

  const handleDeviceSelectForEdit = (deviceId: string) => {
    // Set the current device as being edited
    setEditingDeviceId(deviceId);
    
    // Update the map to make this device draggable
    if (mapRef.current) {
      const device = devices.find(d => d.id === deviceId);
      if (device) {
        onLocationChange(device.position.lat, device.position.lng);
      }
    }
    
    toast({
      title: "Edit Device",
      description: "You can now move the device or edit its details",
    });
  };

  const handleEditDeviceDialogClose = () => {
    setShowEditDeviceDialog(false);
    setEditingDeviceId(null);
    setEditingDevice(null);
  };

  const handleUpdateDevice = () => {
    if (!editingDevice) return;
    
    // Make sure we have the required data
    if (!editingDevice.name) {
      toast({
        title: "Missing Information",
        description: "Please enter a device name.",
        variant: "destructive"
      });
      return;
    }
    
    // Update the device in the devices list
    setDevices(devices.map(device => {
      if (device.id === editingDevice.id) {
        return {
          ...editingDevice,
          fieldId: selectedFieldId !== "field_unassigned" ? selectedFieldId : undefined,
          zoneId: selectedZoneId !== "zone_unassigned" ? selectedZoneId : undefined,
          position: location || device.position // If location has been updated, use it
        };
      }
      return device;
    }));
    
    // Reset state and close dialog
    setShowEditDeviceDialog(false);
    setEditingDeviceId(null);
    setEditingDevice(null);
    
    toast({
      title: "Device Updated",
      description: `${editingDevice.name} has been updated.`,
    });
  };

  const handleEditingDeviceNameChange = (name: string) => {
    if (editingDevice) {
      setEditingDevice({ ...editingDevice, name });
    }
  };

  const handleEditingDeviceTypeChange = (type: 'sensor' | 'valve' | 'weather-station') => {
    if (editingDevice) {
      setEditingDevice({ ...editingDevice, type });
    }
  };

  const handleRemoveDevice = (deviceId: string) => {
    setDevices(devices.filter(device => device.id !== deviceId));
    
    // If we were editing this device, close the dialog
    if (editingDeviceId === deviceId) {
      setShowEditDeviceDialog(false);
      setEditingDeviceId(null);
      setEditingDevice(null);
    }
    
    toast({
      title: "Device Removed",
      description: "The device has been removed from your map.",
    });
  };

  // Filter devices based on selections
  const filteredDevices = devices.filter(device => {
    // If no field is selected, show all devices
    if (selectedFieldId === "field_unassigned") return true;
    
    // If a field is selected but no zone, show devices in that field
    if (selectedZoneId === "zone_unassigned") return device.fieldId === selectedFieldId;
    
    // If both field and zone are selected, show devices in that zone
    return device.zoneId === selectedZoneId;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Device Placement</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={isAddingDevice ? "default" : "outline"}
                size="sm"
                onClick={toggleAddDeviceMode}
                className="flex items-center"
              >
                <MapPin className="mr-1 h-4 w-4" />
                {isAddingDevice ? "Cancel" : "Place on Map"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Filter by Field</label>
                <Select
                  value={selectedFieldId}
                  onValueChange={handleFieldSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="field_unassigned">All Fields</SelectItem>
                    {fields.map(field => (
                      <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Filter by Zone</label>
                <Select
                  value={selectedZoneId}
                  onValueChange={handleZoneSelect}
                  disabled={selectedFieldId === "field_unassigned" || filteredZones.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={filteredZones.length === 0 ? "No zones in selected field" : "Select a zone"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zone_unassigned">All Zones</SelectItem>
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
                devices={devices}
                fields={fields}
                zones={zones}
                editingDeviceId={editingDeviceId}
                activeFieldId={selectedFieldId !== "field_unassigned" ? selectedFieldId : null}
                activeZoneId={selectedZoneId !== "zone_unassigned" ? selectedZoneId : null}
                isAddingDevice={isAddingDevice}
                onDeviceSelect={handleDeviceSelectForEdit}
              />
            ) : (
              <MapPlaceholder>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 rounded">
                  <h3 className="text-lg font-medium">Map Not Available</h3>
                  <p className="text-muted-foreground mt-1">Please add a Google Maps API key in settings</p>
                </div>
              </MapPlaceholder>
            )}
            
            <div className="flex justify-between items-center mt-4">
              <MapToolbar
                activeMode={activeMode}
                onModeSelect={onModeSelect}
                onGetUserLocation={handleGetLocation}
                onSave={onSaveMap}
                showImportExport={false}
              />
              
              <AddDeviceDialog
                open={showAddDeviceDialog}
                onOpenChange={setShowAddDeviceDialog}
                deviceName={newDevice.name}
                deviceType={newDevice.type}
                location={location}
                onDeviceNameChange={handleDeviceNameChange}
                onDeviceTypeChange={handleDeviceTypeChange}
                onAddDevice={handleDeviceAddSubmit}
                fields={fields}
                selectedFieldId={selectedFieldId}
                onFieldSelect={handleFieldSelect}
                zones={zones}
                selectedZoneId={selectedZoneId}
                onZoneSelect={handleZoneSelect}
                filteredZones={filteredZones}
              />
              
              {/* Edit Device Dialog */}
              <Dialog open={showEditDeviceDialog} onOpenChange={setShowEditDeviceDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Device</DialogTitle>
                  </DialogHeader>
                  
                  {editingDevice && (
                    <div className="space-y-4 py-4">
                      {/* Device Name */}
                      <div className="space-y-2">
                        <label htmlFor="edit-device-name" className="text-sm font-medium">
                          Device Name
                        </label>
                        <input
                          id="edit-device-name"
                          value={editingDevice.name}
                          onChange={(e) => handleEditingDeviceNameChange(e.target.value)}
                          type="text"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          placeholder="Enter device name"
                        />
                      </div>
                      
                      {/* Device Type */}
                      <div className="space-y-2">
                        <label htmlFor="edit-device-type" className="text-sm font-medium">
                          Device Type
                        </label>
                        <Select
                          value={editingDevice.type}
                          onValueChange={(value: 'sensor' | 'valve' | 'weather-station') => handleEditingDeviceTypeChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select device type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sensor">Soil Moisture Sensor</SelectItem>
                            <SelectItem value="valve">Valve Controller</SelectItem>
                            <SelectItem value="weather-station">Weather Station</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Field assignment */}
                      <div className="space-y-2">
                        <label htmlFor="edit-device-field" className="text-sm font-medium">
                          Assign to Field
                        </label>
                        <Select
                          value={selectedFieldId}
                          onValueChange={handleFieldSelect}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="field_unassigned">Unassigned</SelectItem>
                            {fields.map(field => (
                              <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Zone assignment */}
                      <div className="space-y-2">
                        <label htmlFor="edit-device-zone" className="text-sm font-medium">
                          Assign to Zone
                        </label>
                        <Select
                          value={selectedZoneId}
                          onValueChange={handleZoneSelect}
                          disabled={selectedFieldId === "field_unassigned" || filteredZones.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={
                              selectedFieldId === "field_unassigned" 
                                ? "Select a field first" 
                                : filteredZones.length === 0 
                                  ? "No zones in selected field" 
                                  : "Select a zone"
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="zone_unassigned">Unassigned</SelectItem>
                            {filteredZones.map(zone => (
                              <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Location display */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Location
                        </label>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            {location ? (
                              <>
                                Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                              </>
                            ) : editingDevice.position ? (
                              <>
                                Lat: {editingDevice.position.lat.toFixed(6)}, Lng: {editingDevice.position.lng.toFixed(6)}
                              </>
                            ) : (
                              'No location selected'
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Drag the device on the map to change location
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <DialogFooter className="flex justify-between">
                    <Button variant="destructive" onClick={() => handleRemoveDevice(editingDevice?.id || '')}>
                      Delete Device
                    </Button>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={handleEditDeviceDialogClose}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateDevice}>
                        Save Changes
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <DeviceList
        devices={filteredDevices}
        handleViewDevice={handleViewDevice}
        handleEditDevice={handleDeviceSelectForEdit}
        handleRemoveDevice={handleRemoveDevice}
        setShowAddDeviceDialog={handleAddDeviceClick}
        fields={fields}
        zones={zones}
        editingDeviceId={editingDeviceId}
      />
    </div>
  );
});

DevicesTab.displayName = 'DevicesTab';

export default DevicesTab;
