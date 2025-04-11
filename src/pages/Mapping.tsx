
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "@/hooks/use-toast";
import { Map, Layers, PenTool, MoveHorizontal, Ruler, ZoomIn, ZoomOut, Save, FileUp, Download, Leaf, Droplets, Plus } from 'lucide-react';

const MapPlaceholder = ({ children }: { children?: React.ReactNode }) => (
  <div className="bg-muted rounded-md h-[500px] flex items-center justify-center relative">
    <div className="text-center">
      <Map className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Interactive Field Map</h3>
      <p className="text-muted-foreground">Google Maps integration will be displayed here.</p>
    </div>
    {children}
  </div>
);

const Mapping: React.FC = () => {
  const [activeTab, setActiveTab] = useState('fields');
  const [zoomLevel, setZoomLevel] = useState(14);
  const [fieldNames] = useState<string[]>(['North Field', 'East Field', 'South Field', 'West Field']);
  
  const handleZoomIn = () => {
    if (zoomLevel < 20) {
      setZoomLevel(prev => prev + 1);
      toast({
        title: "Map Control",
        description: `Zoomed in to level ${zoomLevel + 1}`,
      });
    }
  };
  
  const handleZoomOut = () => {
    if (zoomLevel > 1) {
      setZoomLevel(prev => prev - 1);
      toast({
        title: "Map Control",
        description: `Zoomed out to level ${zoomLevel - 1}`,
      });
    }
  };
  
  const handleSaveMap = () => {
    toast({
      title: "Map Saved",
      description: "Your map and zone configurations have been saved.",
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
                </CardHeader>
                <CardContent>
                  <MapPlaceholder>
                    <div className="absolute right-4 top-4 flex flex-col space-y-2">
                      <Button variant="outline" size="icon" className="bg-white" onClick={handleZoomIn}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="bg-white" onClick={handleZoomOut}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute left-4 top-4 p-2 bg-white rounded shadow">
                      <p className="text-xs font-medium">Zoom Level: {zoomLevel}</p>
                    </div>
                  </MapPlaceholder>
                  
                  <div className="flex justify-between mt-4">
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <MoveHorizontal className="mr-2 h-4 w-4" />
                        Pan
                      </Button>
                      <Button variant="outline">
                        <PenTool className="mr-2 h-4 w-4" />
                        Draw
                      </Button>
                      <Button variant="outline">
                        <Ruler className="mr-2 h-4 w-4" />
                        Measure
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <FileUp className="mr-2 h-4 w-4" />
                        Import
                      </Button>
                      <Button variant="outline">
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
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  ))}
                  <Button className="w-full">
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
                  <MapPlaceholder />
                </CardContent>
              </Card>
            </div>
            
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-8 text-center rounded-md">
                  <h3 className="text-sm font-medium">Device List</h3>
                  <p className="text-xs text-muted-foreground mt-2">Device list will appear here.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="soil" className="space-y-4">
          <div className="bg-muted p-8 text-center rounded-md">
            <h3 className="text-lg font-medium">Soil Type Mapping</h3>
            <p className="text-muted-foreground mt-2">
              Map different soil types across your fields to optimize irrigation strategies.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Mapping;
