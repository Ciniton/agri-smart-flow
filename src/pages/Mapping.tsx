
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "@/hooks/use-toast";
import { 
  Map, 
  Layers, 
  PenTool, 
  MoveHorizontal, 
  Ruler, 
  Save, 
  FileUp, 
  Download, 
  Leaf, 
  Droplets, 
  Plus, 
  MapPin, 
  Navigation,
  Smartphone,
  Edit
} from 'lucide-react';
import InteractiveMap from '@/components/mapping/InteractiveMap';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MapPlaceholder = ({ children }: { children?: React.ReactNode }) => (
  <div className="bg-muted rounded-md h-[500px] flex items-center justify-center relative">
    <div className="text-center">
      <Map className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Interactive Field Map</h3>
      <p className="text-muted-foreground">
        {localStorage.getItem('googleMapsApiKey') 
          ? "Loading map..." 
          : "Please set a Google Maps API key in Admin settings to enable mapping features."}
      </p>
    </div>
    {children}
  </div>
);

interface DeviceMarker {
  id: string;
  name: string;
  type: 'sensor' | 'valve' | 'weather-station';
  position: { lat: number; lng: number };
}

interface Field {
  id: string;
  name: string;
  boundaries?: any; // In a real app, this would store polygon coordinates
  area?: number; // In square meters or acres
  lastModified: string;
}

interface Zone {
  id: string;
  name: string;
  fieldId: string;
  irrigationType: 'low' | 'medium' | 'high';
  boundaries?: any; // In a real app, this would store polygon coordinates
  lastModified: string;
}

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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Field Overview</CardTitle>
                  {location && (
                    <CardDescription>
                      Current Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {hasApiKey ? (
                    <InteractiveMap onLocationChange={handleLocationChange} mode={activeMode} />
                  ) : (
                    <MapPlaceholder />
                  )}
                  
                  <div className="flex justify-between mt-4">
                    <div className="flex space-x-2">
                      <Button 
                        variant={activeMode === 'pan' ? "default" : "outline"} 
                        onClick={() => handleModeSelect('pan')}
                      >
                        <MoveHorizontal className="mr-2 h-4 w-4" />
                        Pan
                      </Button>
                      <Button 
                        variant={activeMode === 'draw' ? "default" : "outline"}
                        onClick={() => handleModeSelect('draw')}
                      >
                        <PenTool className="mr-2 h-4 w-4" />
                        Draw
                      </Button>
                      <Button 
                        variant={activeMode === 'measure' ? "default" : "outline"}
                        onClick={() => handleModeSelect('measure')}
                      >
                        <Ruler className="mr-2 h-4 w-4" />
                        Measure
                      </Button>
                      <Button variant="outline" onClick={() => handleLocationChange(0, 0)}>
                        <Navigation className="mr-2 h-4 w-4" />
                        Locate
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleImportMap}>
                        <FileUp className="mr-2 h-4 w-4" />
                        Import
                      </Button>
                      <Button variant="outline" onClick={handleExportMap}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      <Button onClick={handleSaveMap}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-3 bg-muted rounded hover:bg-accent cursor-pointer">
                      <div className="flex items-center">
                        <Leaf className="mr-2 h-4 w-4 text-green-500" />
                        <div>
                          <span className="font-medium">{field.name}</span>
                          {field.area && <p className="text-xs text-muted-foreground">{field.area.toLocaleString()} m²</p>}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleEditField(field.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Dialog open={showAddFieldDialog} onOpenChange={setShowAddFieldDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Field
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Field</DialogTitle>
                        <DialogDescription>
                          Enter field details and then draw its boundaries on the map.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="fieldName" className="text-right">
                            Field Name
                          </Label>
                          <Input
                            id="fieldName"
                            placeholder="Enter field name"
                            className="col-span-3"
                            value={newField.name}
                            onChange={(e) => setNewField({...newField, name: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="fieldArea" className="text-right">
                            Area (m²)
                          </Label>
                          <Input
                            id="fieldArea"
                            type="number"
                            placeholder="Optional"
                            className="col-span-3"
                            value={newField.area}
                            onChange={(e) => setNewField({...newField, area: e.target.value})}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddFieldDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddField}>
                          Add Field
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="zones" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Irrigation Zones</CardTitle>
                </CardHeader>
                <CardContent>
                  {hasApiKey ? (
                    <InteractiveMap onLocationChange={handleLocationChange} mode={activeMode} />
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
                  
                  <div className="flex justify-between mt-4">
                    <div className="flex space-x-2">
                      <Button 
                        variant={activeMode === 'pan' ? "default" : "outline"} 
                        onClick={() => handleModeSelect('pan')}
                      >
                        <MoveHorizontal className="mr-2 h-4 w-4" />
                        Pan
                      </Button>
                      <Button 
                        variant={activeMode === 'draw' ? "default" : "outline"}
                        onClick={() => handleModeSelect('draw')}
                      >
                        <PenTool className="mr-2 h-4 w-4" />
                        Draw Zone
                      </Button>
                      <Button variant="outline" onClick={() => handleLocationChange(0, 0)}>
                        <Navigation className="mr-2 h-4 w-4" />
                        Locate
                      </Button>
                    </div>
                    <Button onClick={handleSaveMap}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Zones
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Irrigation Zones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {zones.map((zone) => (
                    <div key={zone.id} className="flex items-center justify-between p-3 bg-muted rounded hover:bg-accent cursor-pointer">
                      <div className="flex items-center">
                        <Droplets className={`mr-2 h-4 w-4 ${
                          zone.irrigationType === 'low' ? "text-blue-300" :
                          zone.irrigationType === 'medium' ? "text-blue-500" : "text-blue-700"
                        }`} />
                        <span>{zone.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleEditZone(zone.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Dialog open={showAddZoneDialog} onOpenChange={setShowAddZoneDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Zone
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Zone</DialogTitle>
                        <DialogDescription>
                          Enter zone details and then draw its boundaries on the map.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="zoneName" className="text-right">
                            Zone Name
                          </Label>
                          <Input
                            id="zoneName"
                            placeholder="Enter zone name"
                            className="col-span-3"
                            value={newZone.name}
                            onChange={(e) => setNewZone({...newZone, name: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="zoneField" className="text-right">
                            Field
                          </Label>
                          <select
                            id="zoneField"
                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={newZone.fieldId}
                            onChange={(e) => setNewZone({...newZone, fieldId: e.target.value})}
                          >
                            <option value="" disabled>Select a field</option>
                            {fields.map(field => (
                              <option key={field.id} value={field.id}>{field.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="zoneType" className="text-right">
                            Irrigation Type
                          </Label>
                          <select
                            id="zoneType"
                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={newZone.irrigationType}
                            onChange={(e) => setNewZone({...newZone, irrigationType: e.target.value as 'low' | 'medium' | 'high'})}
                          >
                            <option value="low">Low Irrigation</option>
                            <option value="medium">Medium Irrigation</option>
                            <option value="high">High Irrigation</option>
                          </select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddZoneDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddZone}>
                          Add Zone
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Device Placement</CardTitle>
                </CardHeader>
                <CardContent>
                  {hasApiKey ? (
                    <InteractiveMap onLocationChange={handleLocationChange} mode={activeMode} />
                  ) : (
                    <MapPlaceholder />
                  )}
                  
                  <div className="flex justify-between mt-4">
                    <div className="flex space-x-2">
                      <Button 
                        variant={activeMode === 'pan' ? "default" : "outline"} 
                        onClick={() => handleModeSelect('pan')}
                      >
                        <MoveHorizontal className="mr-2 h-4 w-4" />
                        Pan
                      </Button>
                      <Button variant="outline" onClick={() => handleLocationChange(0, 0)}>
                        <Navigation className="mr-2 h-4 w-4" />
                        Locate
                      </Button>
                      <Dialog open={showAddDeviceDialog} onOpenChange={setShowAddDeviceDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <MapPin className="mr-2 h-4 w-4" />
                            Place Device
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Device</DialogTitle>
                            <DialogDescription>
                              Enter device details to place it at the selected location.
                              {location ? ` (${location.lat.toFixed(6)}, ${location.lng.toFixed(6)})` : ' Please select a location on the map first.'}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="deviceName" className="text-right">
                                Device Name
                              </Label>
                              <Input
                                id="deviceName"
                                placeholder="Enter device name"
                                className="col-span-3"
                                value={newDevice.name}
                                onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="deviceType" className="text-right">
                                Device Type
                              </Label>
                              <select
                                id="deviceType"
                                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={newDevice.type}
                                onChange={(e) => setNewDevice({...newDevice, type: e.target.value as 'sensor' | 'valve' | 'weather-station'})}
                              >
                                <option value="sensor">Soil Moisture Sensor</option>
                                <option value="valve">Valve Controller</option>
                                <option value="weather-station">Weather Station</option>
                              </select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowAddDeviceDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAddDevice}>
                              Add Device
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Button onClick={handleSaveMap}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Devices
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {devices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 bg-muted rounded hover:bg-accent cursor-pointer">
                      <div className="flex items-center">
                        <Smartphone className="mr-2 h-4 w-4 text-blue-500" />
                        <div>
                          <span className="font-medium">{device.name}</span>
                          <p className="text-xs text-muted-foreground">
                            {device.position.lat.toFixed(4)}, {device.position.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleEditDevice(device.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button className="w-full" onClick={() => setShowAddDeviceDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Device
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="soil" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Soil Type Mapping</CardTitle>
                </CardHeader>
                <CardContent>
                  {hasApiKey ? (
                    <InteractiveMap onLocationChange={handleLocationChange} mode={activeMode} />
                  ) : (
                    <MapPlaceholder />
                  )}
                  
                  <div className="flex justify-between mt-4">
                    <div className="flex space-x-2">
                      <Button 
                        variant={activeMode === 'pan' ? "default" : "outline"} 
                        onClick={() => handleModeSelect('pan')}
                      >
                        <MoveHorizontal className="mr-2 h-4 w-4" />
                        Pan
                      </Button>
                      <Button 
                        variant={activeMode === 'draw' ? "default" : "outline"}
                        onClick={() => handleModeSelect('draw')}
                      >
                        <PenTool className="mr-2 h-4 w-4" />
                        Draw Soil Zone
                      </Button>
                      <Button variant="outline" onClick={() => handleLocationChange(0, 0)}>
                        <Navigation className="mr-2 h-4 w-4" />
                        Locate
                      </Button>
                    </div>
                    <Button onClick={handleSaveMap}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Soil Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Soil Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-8 text-center rounded-md">
                  <h3 className="text-sm font-medium">Soil Type Legend</h3>
                  <div className="mt-4 space-y-2 text-left">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded bg-amber-200 mr-2"></div>
                      <span className="text-xs">Sandy Soil</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded bg-amber-800 mr-2"></div>
                      <span className="text-xs">Clay Soil</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Mapping;
