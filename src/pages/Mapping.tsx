import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "@/hooks/use-toast";
import { Field, Zone, DeviceMarker } from '@/components/mapping/types';
import FieldsTab from '@/components/mapping/FieldsTab';
import ZonesTab from '@/components/mapping/ZonesTab';
import DevicesTab from '@/components/mapping/DevicesTab';
import SoilTab from '@/components/mapping/SoilTab';

const Mapping: React.FC = () => {
  const [activeTab, setActiveTab] = useState('fields');
  const [fieldNames, setFieldNames] = useState<string[]>(['North Field', 'East Field', 'South Field', 'West Field']);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [activeMode, setActiveMode] = useState<'pan' | 'draw' | 'measure'>('pan');
  const [showAddFieldDialog, setShowAddFieldDialog] = useState(false);
  const [showAddZoneDialog, setShowAddZoneDialog] = useState(false);
  const [showAddDeviceDialog, setShowAddDeviceDialog] = useState(false);
  const [newField, setNewField] = useState({ name: '', area: '' });
  const [newZone, setNewZone] = useState({ name: '', fieldId: '', irrigationType: 'medium' as 'low' | 'medium' | 'high' });
  const [newDevice, setNewDevice] = useState({ name: '', type: 'sensor' as 'sensor' | 'valve' | 'weather-station' });
  const mapRefs = useRef<{ [key: string]: any }>({
    fields: null,
    zones: null,
    devices: null,
    soil: null
  });
  
  const [fields, setFields] = useState<Field[]>([
    { id: 'f1', name: 'North Field', area: 12500, lastModified: '2025-03-15' },
    { id: 'f2', name: 'East Field', area: 8900, lastModified: '2025-03-20' },
    { id: 'f3', name: 'South Field', area: 15200, lastModified: '2025-04-01' },
    { id: 'f4', name: 'West Field', area: 7600, lastModified: '2025-04-05' },
  ]);
  const [zones, setZones] = useState<Zone[]>([
    { id: 'z1', name: 'North Field - Zone 1', fieldId: 'f1', irrigationType: 'medium', lastModified: '2025-03-15' },
    { id: 'z2', name: 'East Field - Zone 2', fieldId: 'f2', irrigationType: 'high', lastModified: '2025-03-20' },
    { id: 'z3', name: 'South Field - Zone 3', fieldId: 'f3', irrigationType: 'low', lastModified: '2025-04-01' },
  ]);
  const [devices, setDevices] = useState<DeviceMarker[]>([
    { id: '1', name: 'Soil Moisture Sensor 1', type: 'sensor', position: { lat: 40.7128, lng: -74.0060 } },
    { id: '2', name: 'Valve Controller 1', type: 'valve', position: { lat: 40.7135, lng: -74.0050 } },
    { id: '3', name: 'Weather Station 1', type: 'weather-station', position: { lat: 40.7140, lng: -74.0065 } }
  ]);
  
  useEffect(() => {
    // Check if API key exists in localStorage
    const apiKey = localStorage.getItem('googleMapsApiKey');
    setHasApiKey(!!apiKey);
  }, []);
  
  const handleLocationChange = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    console.log(`Location updated: ${lat}, ${lng}`);
  };
  
  const handleModeSelect = (mode: 'pan' | 'draw' | 'measure') => {
    setActiveMode(mode);
    
    const modeMessages = {
      pan: 'Pan mode activated. Click and drag to move around the map.',
      draw: 'Draw mode activated. Click on the map to start drawing a field boundary.',
      measure: 'Measure mode activated. Click to place points and measure distance between them.'
    };
    
    toast({
      title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`,
      description: modeMessages[mode]
    });
  };
  
  const handleSaveMap = () => {
    toast({
      title: "Map Saved",
      description: "Your map and zone configurations have been saved.",
    });
  };
  
  const handleImportMap = () => {
    toast({
      title: "Import Started",
      description: "Please select a KML or GeoJSON file to import.",
    });
    
    // This would typically trigger a file selection dialog
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.kml,.geojson,.json';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        toast({
          title: "File Selected",
          description: `File "${file.name}" selected. Processing...`,
        });
        
        // Here you would typically parse the file and add it to the map
        // For demonstration, we'll just show a success message
        setTimeout(() => {
          toast({
            title: "Import Complete",
            description: `Successfully imported "${file.name}"`,
          });
        }, 1500);
      }
    };
    input.click();
  };
  
  const handleExportMap = () => {
    toast({
      title: "Export Started",
      description: "Preparing map data for export...",
    });
    
    // This would typically generate a file for download
    // For demonstration, we'll just show a success message
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Map data exported as GeoJSON. Download starting...",
      });
      
      // Mock file download
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('{"type":"FeatureCollection","features":[]}'));
      element.setAttribute('download', 'field_map.geojson');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };
  
  const handleAddField = () => {
    if (!newField.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a field name.",
        variant: "destructive"
      });
      return;
    }
    
    const field: Field = {
      id: `f${Date.now()}`,
      name: newField.name,
      area: newField.area ? Number(newField.area) : undefined,
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    setFields([...fields, field]);
    setNewField({ name: '', area: '' });
    setShowAddFieldDialog(false);
    
    toast({
      title: "Field Added",
      description: `Field "${field.name}" has been added. You can now draw its boundaries on the map.`,
    });
    
    // Set mode to draw automatically
    handleModeSelect('draw');
  };
  
  const handleEditField = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;
    
    toast({
      title: "Edit Field",
      description: `Editing field "${field.name}". You can now modify its properties or boundaries.`,
    });
    
    // Set mode to draw automatically
    handleModeSelect('draw');
  };
  
  const handleAddZone = () => {
    if (!newZone.name || !newZone.fieldId) {
      toast({
        title: "Validation Error",
        description: "Please enter a zone name and select a field.",
        variant: "destructive"
      });
      return;
    }
    
    const zone: Zone = {
      id: `z${Date.now()}`,
      name: newZone.name,
      fieldId: newZone.fieldId,
      irrigationType: newZone.irrigationType,
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    setZones([...zones, zone]);
    setNewZone({ name: '', fieldId: '', irrigationType: 'medium' });
    setShowAddZoneDialog(false);
    
    toast({
      title: "Zone Added",
      description: `Zone "${zone.name}" has been added. You can now draw its boundaries on the map.`,
    });
    
    // Set mode to draw automatically
    handleModeSelect('draw');
  };
  
  const handleEditZone = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;
    
    toast({
      title: "Edit Zone",
      description: `Editing zone "${zone.name}". You can now modify its properties or boundaries.`,
    });
    
    // Set mode to draw automatically
    handleModeSelect('draw');
  };
  
  const handleAddDevice = () => {
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
      position: { ...location }
    };
    
    setDevices([...devices, device]);
    setNewDevice({ name: '', type: 'sensor' });
    setShowAddDeviceDialog(false);
    
    toast({
      title: "Device Added",
      description: `Device "${device.name}" placed at ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
    });
  };
  
  const handleEditDevice = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;
    
    toast({
      title: "Edit Device",
      description: `Editing device "${device.name}". You can modify its properties or move it on the map.`,
    });
  };
  
  const handleGetUserLocation = () => {
    const activeTabKey = activeTab as keyof typeof mapRefs.current;
    const activeMapRef = mapRefs.current[activeTabKey];
    
    if (activeMapRef && typeof activeMapRef.getUserLocation === 'function') {
      activeMapRef.getUserLocation();
    } else {
      toast({
        title: "Map Not Ready",
        description: "The map is still loading or not available. Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Field Mapping</h1>
        <p className="text-muted-foreground mt-1">View and manage your field layouts</p>
      </div>
      
      <Tabs defaultValue="fields" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="zones">Irrigation Zones</TabsTrigger>
          <TabsTrigger value="devices">Device Placement</TabsTrigger>
          <TabsTrigger value="soil">Soil Types</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fields" className="space-y-4">
          <FieldsTab
            location={location}
            hasApiKey={hasApiKey}
            activeMode={activeMode}
            fields={fields}
            newField={newField}
            showAddFieldDialog={showAddFieldDialog}
            onLocationChange={handleLocationChange}
            onModeSelect={handleModeSelect}
            onGetUserLocation={handleGetUserLocation}
            onSaveMap={handleSaveMap}
            onImportMap={handleImportMap}
            onExportMap={handleExportMap}
            setShowAddFieldDialog={setShowAddFieldDialog}
            setNewField={setNewField}
            handleEditField={handleEditField}
            handleAddField={handleAddField}
            ref={(ref) => mapRefs.current.fields = ref}
          />
        </TabsContent>
        
        <TabsContent value="zones" className="space-y-4">
          <ZonesTab
            hasApiKey={hasApiKey}
            activeMode={activeMode}
            zones={zones}
            fields={fields}
            newZone={newZone}
            showAddZoneDialog={showAddZoneDialog}
            onLocationChange={handleLocationChange}
            onModeSelect={handleModeSelect}
            onGetUserLocation={handleGetUserLocation}
            onSaveMap={handleSaveMap}
            setShowAddZoneDialog={setShowAddZoneDialog}
            setNewZone={setNewZone}
            handleEditZone={handleEditZone}
            handleAddZone={handleAddZone}
            ref={(ref) => mapRefs.current.zones = ref}
          />
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4">
          <DevicesTab
            hasApiKey={hasApiKey}
            activeMode={activeMode}
            devices={devices}
            location={location}
            newDevice={newDevice}
            showAddDeviceDialog={showAddDeviceDialog}
            onLocationChange={handleLocationChange}
            onModeSelect={handleModeSelect}
            onGetUserLocation={handleGetUserLocation}
            onSaveMap={handleSaveMap}
            setShowAddDeviceDialog={setShowAddDeviceDialog}
            setNewDevice={setNewDevice}
            handleEditDevice={handleEditDevice}
            handleAddDevice={handleAddDevice}
            ref={(ref) => mapRefs.current.devices = ref}
          />
        </TabsContent>
        
        <TabsContent value="soil" className="space-y-4">
          <SoilTab
            hasApiKey={hasApiKey}
            activeMode={activeMode}
            onLocationChange={handleLocationChange}
            onModeSelect={handleModeSelect}
            onGetUserLocation={handleGetUserLocation}
            onSaveMap={handleSaveMap}
            ref={(ref) => mapRefs.current.soil = ref}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Mapping;
