import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "@/hooks/use-toast";
import { Field, Zone, DeviceMarker, GoogleLatLngLiteral } from '@/components/mapping/types';
import FieldsTab from '@/components/mapping/FieldsTab';
import ZonesTab from '@/components/mapping/ZonesTab';
import DevicesTab from '@/components/mapping/DevicesTab';
import SoilTab from '@/components/mapping/SoilTab';

interface ZoneData {
  name: string;
  fieldId: string;
  irrigationType: 'low' | 'medium' | 'high';
  boundaries?: GoogleLatLngLiteral[];
  center?: { lat: number; lng: number };
  area?: { squareMeters: number; hectares: number };
}

interface DeviceData {
  name: string;
  type: 'sensor' | 'valve' | 'weather-station';
  fieldId?: string;
  zoneId?: string;
}

const Mapping: React.FC = () => {
  const [activeTab, setActiveTab] = useState('fields');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [activeMode, setActiveMode] = useState<'pan' | 'draw' | 'measure'>('pan');
  const [showAddFieldDialog, setShowAddFieldDialog] = useState(false);
  const [showAddZoneDialog, setShowAddZoneDialog] = useState(false);
  const [showAddDeviceDialog, setShowAddDeviceDialog] = useState(false);
  const [newField, setNewField] = useState({ name: '', area: '' });
  const [newZone, setNewZone] = useState<ZoneData>({ 
    name: '', 
    fieldId: '', 
    irrigationType: 'medium' as 'low' | 'medium' | 'high',
    boundaries: undefined,
    center: undefined,
    area: undefined
  });
  
  const [newDevice, setNewDevice] = useState<DeviceData>({ 
    name: '', 
    type: 'sensor' as 'sensor' | 'valve' | 'weather-station',
    fieldId: 'field_unassigned',
    zoneId: 'zone_unassigned'
  });
  
  const mapRefs = useRef<{ [key: string]: any }>({
    fields: null,
    zones: null,
    devices: null,
    soil: null
  });
  
  // Use localStorage to persist field, zone, and device data
  const [fields, setFields] = useState<Field[]>(() => {
    const savedFields = localStorage.getItem('fields');
    return savedFields ? JSON.parse(savedFields) : [
      { id: 'f1', name: 'North Field', area: { squareMeters: 12500, hectares: 1.25 }, lastModified: '2025-03-15' },
      { id: 'f2', name: 'East Field', area: { squareMeters: 8900, hectares: 0.89 }, lastModified: '2025-03-20' },
      { id: 'f3', name: 'South Field', area: { squareMeters: 15200, hectares: 1.52 }, lastModified: '2025-04-01' },
      { id: 'f4', name: 'West Field', area: { squareMeters: 7600, hectares: 0.76 }, lastModified: '2025-04-05' },
    ];
  });

  const [zones, setZones] = useState<Zone[]>(() => {
    const savedZones = localStorage.getItem('zones');
    return savedZones ? JSON.parse(savedZones) : [
      { id: 'z1', name: 'North Field - Zone 1', fieldId: 'f1', irrigationType: 'medium', lastModified: '2025-03-15' },
      { id: 'z2', name: 'East Field - Zone 2', fieldId: 'f2', irrigationType: 'high', lastModified: '2025-03-20' },
      { id: 'z3', name: 'South Field - Zone 3', fieldId: 'f3', irrigationType: 'low', lastModified: '2025-04-01' },
    ];
  });

  const [devices, setDevices] = useState<DeviceMarker[]>(() => {
    const savedDevices = localStorage.getItem('devices');
    return savedDevices ? JSON.parse(savedDevices) : [
      { id: '1', name: 'Soil Moisture Sensor 1', type: 'sensor', position: { lat: 40.7128, lng: -74.0060 }, fieldId: 'f1', zoneId: 'z1' },
      { id: '2', name: 'Valve Controller 1', type: 'valve', position: { lat: 40.7135, lng: -74.0050 }, fieldId: 'f1', zoneId: 'z1' },
      { id: '3', name: 'Weather Station 1', type: 'weather-station', position: { lat: 40.7140, lng: -74.0065 }, fieldId: 'f2', zoneId: 'z2' }
    ];
  });
  
  // Save fields, zones, and devices to localStorage when they change
  useEffect(() => {
    localStorage.setItem('fields', JSON.stringify(fields));
  }, [fields]);
  
  useEffect(() => {
    localStorage.setItem('zones', JSON.stringify(zones));
  }, [zones]);
  
  useEffect(() => {
    localStorage.setItem('devices', JSON.stringify(devices));
  }, [devices]);
  
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
    // Save current state to localStorage
    localStorage.setItem('fields', JSON.stringify(fields));
    localStorage.setItem('zones', JSON.stringify(zones));
    localStorage.setItem('devices', JSON.stringify(devices));
    
    toast({
      title: "Map Saved",
      description: "Your map configuration has been saved to local storage.",
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
    
    // Prepare the export data
    const exportData = {
      fields,
      zones,
      devices,
      exportDate: new Date().toISOString()
    };
    
    // Convert to JSON
    const jsonData = JSON.stringify(exportData, null, 2);
    
    // Create a file for download
    const element = document.createElement('a');
    const file = new Blob([jsonData], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = `field_map_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Export Complete",
      description: "Farm map data exported as JSON. Download starting...",
    });
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
      area: newField.area ? 
        { 
          squareMeters: Number(newField.area), 
          hectares: Number(newField.area) / 10000 
        } : undefined,
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
      boundaries: newZone.boundaries,
      center: newZone.center,
      area: newZone.area,
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    setZones([...zones, zone]);
    setNewZone({ 
      name: '', 
      fieldId: '', 
      irrigationType: 'medium',
      boundaries: undefined,
      center: undefined,
      area: undefined
    });
    setShowAddZoneDialog(false);
    
    toast({
      title: "Zone Added",
      description: `Zone "${zone.name}" has been added with ${zone.area ? `an area of ${zone.area.hectares.toFixed(2)} hectares` : 'no area information'}.`,
    });
    
    // Set mode to pan
    handleModeSelect('pan');
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
    
    // Add field and zone IDs if they are selected and valid
    if (newDevice.fieldId && newDevice.fieldId !== 'field_unassigned') {
      device.fieldId = newDevice.fieldId;
    }
    
    if (newDevice.zoneId && newDevice.zoneId !== 'zone_unassigned') {
      device.zoneId = newDevice.zoneId;
    }
    
    setDevices([...devices, device]);
    setNewDevice({ 
      name: '', 
      type: 'sensor',
      fieldId: 'field_unassigned',
      zoneId: 'zone_unassigned'
    });
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
            setFields={setFields}
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
            fields={fields}
            zones={zones}
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
            setDevices={setDevices}
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
