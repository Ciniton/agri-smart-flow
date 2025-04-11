
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
  Smartphone
} from 'lucide-react';
import InteractiveMap from '@/components/mapping/InteractiveMap';

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

const Mapping: React.FC = () => {
  const [activeTab, setActiveTab] = useState('fields');
  const [fieldNames, setFieldNames] = useState<string[]>(['North Field', 'East Field', 'South Field', 'West Field']);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [activeMode, setActiveMode] = useState<'pan' | 'draw' | 'measure' | null>(null);
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
    setActiveMode(prevMode => prevMode === mode ? null : mode);
    
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
    const newFieldName = `New Field ${fieldNames.length + 1}`;
    setFieldNames([...fieldNames, newFieldName]);
    
    toast({
      title: "Field Added",
      description: `Field "${newFieldName}" has been added. You can now draw its boundaries on the map.`,
    });
    
    // Set mode to draw automatically
    handleModeSelect('draw');
  };
  
  const handleEditField = (fieldName: string) => {
    toast({
      title: "Edit Field",
      description: `Editing field "${fieldName}". You can now modify its properties or boundaries.`,
    });
  };
  
  const handleAddDevice = () => {
    if (!location) {
      toast({
        title: "Location Needed",
        description: "Please click on the map or use the location button to set a device position.",
        variant: "destructive"
      });
      return;
    }
    
    const newDevice: DeviceMarker = {
      id: `device-${Date.now()}`,
      name: `New Device ${devices.length + 1}`,
      type: 'sensor',
      position: { ...location }
    };
    
    setDevices([...devices, newDevice]);
    
    toast({
      title: "Device Added",
      description: `New device placed at ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
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
                    <InteractiveMap onLocationChange={handleLocationChange} />
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
                  {fieldNames.map((fieldName) => (
                    <div key={fieldName} className="flex items-center justify-between p-3 bg-muted rounded hover:bg-accent cursor-pointer">
                      <div className="flex items-center">
                        <Leaf className="mr-2 h-4 w-4 text-green-500" />
                        <span>{fieldName}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleEditField(fieldName)}>Edit</Button>
                    </div>
                  ))}
                  <Button className="w-full" onClick={handleAddField}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
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
                    <InteractiveMap onLocationChange={handleLocationChange} />
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
                  <div className="flex items-center justify-between p-3 bg-muted rounded hover:bg-accent cursor-pointer">
                    <div className="flex items-center">
                      <Droplets className="mr-2 h-4 w-4 text-blue-500" />
                      <span>North Field - Zone 1</span>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded hover:bg-accent cursor-pointer">
                    <div className="flex items-center">
                      <Droplets className="mr-2 h-4 w-4 text-blue-700" />
                      <span>East Field - Zone 2</span>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded hover:bg-accent cursor-pointer">
                    <div className="flex items-center">
                      <Droplets className="mr-2 h-4 w-4 text-blue-300" />
                      <span>South Field - Zone 3</span>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Zone
                  </Button>
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
                    <InteractiveMap onLocationChange={handleLocationChange} />
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
                      <Button variant="outline" onClick={handleAddDevice}>
                        <MapPin className="mr-2 h-4 w-4" />
                        Place Device
                      </Button>
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
                        <span>{device.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {device.position.lat.toFixed(4)}, {device.position.lng.toFixed(4)}
                      </div>
                    </div>
                  ))}
                  <Button className="w-full" onClick={handleAddDevice}>
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
                    <InteractiveMap onLocationChange={handleLocationChange} />
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
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded bg-amber-500 mr-2"></div>
                      <span className="text-xs">Loam Soil</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded bg-gray-400 mr-2"></div>
                      <span className="text-xs">Rocky Soil</span>
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
