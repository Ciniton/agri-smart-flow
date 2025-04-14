
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DeviceMarker, Field, Zone } from '@/components/mapping/types';
import { Settings, Thermometer, Droplets, Sun, Hash, MapPin, ExternalLink, CircleDot, Power } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Devices: React.FC = () => {
  const [devices, setDevices] = useState<DeviceMarker[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState<DeviceMarker | null>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  useEffect(() => {
    // Load devices, fields, and zones from localStorage
    const savedDevices = localStorage.getItem('devices');
    const savedFields = localStorage.getItem('fields');
    const savedZones = localStorage.getItem('zones');
    
    if (savedDevices) setDevices(JSON.parse(savedDevices));
    if (savedFields) setFields(JSON.parse(savedFields));
    if (savedZones) setZones(JSON.parse(savedZones));
  }, []);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'sensor':
        return <Thermometer className="h-5 w-5 text-blue-500" />;
      case 'valve':
        return <Droplets className="h-5 w-5 text-green-500" />;
      case 'weather-station':
        return <Sun className="h-5 w-5 text-amber-500" />;
      default:
        return <Thermometer className="h-5 w-5" />;
    }
  };

  const getDeviceTypeLabel = (type: string) => {
    switch (type) {
      case 'sensor':
        return 'Soil Moisture Sensor';
      case 'valve':
        return 'Irrigation Valve';
      case 'weather-station':
        return 'Weather Station';
      default:
        return 'Unknown Device';
    }
  };

  const getDeviceStatus = (device: DeviceMarker) => {
    // This is a mock status - in a real app, you'd get this from your backend
    const statuses = ['active', 'inactive'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    return randomStatus;
  };

  const filteredDevices = selectedTab === 'all' 
    ? devices 
    : devices.filter(device => device.type === selectedTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Devices</h1>
        <p className="text-muted-foreground mt-1">Manage your field monitoring and irrigation devices</p>
      </div>

      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Devices</TabsTrigger>
            <TabsTrigger value="sensor">Soil Sensors</TabsTrigger>
            <TabsTrigger value="valve">Irrigation Valves</TabsTrigger>
            <TabsTrigger value="weather-station">Weather Stations</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Link to="/mapping" className="ml-4">
          <Button size="sm" variant="outline" className="gap-1.5">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Add Devices</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">No devices found in this category.</p>
                <Link to="/mapping">
                  <Button>Add Device on Map</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredDevices.map(device => {
            const field = device.fieldId ? fields.find(f => f.id === device.fieldId) : null;
            const zone = device.zoneId ? zones.find(z => z.id === device.zoneId) : null;
            const deviceStatus = getDeviceStatus(device);
            
            return (
              <Card key={device.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.type)}
                      <div>
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        <CardDescription>{getDeviceTypeLabel(device.type)}</CardDescription>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setSelectedDevice(device);
                        setShowConfigDialog(true);
                      }}
                    >
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={deviceStatus === 'active' ? "default" : "secondary"}>
                        <Power className="h-3 w-3 mr-1" />
                        {deviceStatus === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    {device.serialNumber && (
                      <div className="flex items-center text-sm">
                        <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>SN: {device.serialNumber}</span>
                      </div>
                    )}
                    
                    <div className="text-sm">
                      <div className="font-medium mb-1">Location</div>
                      <div className="text-muted-foreground space-y-1">
                        {field ? (
                          <div>Field: {field.name}</div>
                        ) : (
                          <div className="text-amber-600">Not assigned to a field</div>
                        )}
                        
                        {zone && <div>Zone: {zone.name}</div>}
                        
                        <div className="flex items-start gap-2">
                          <CircleDot className="h-4 w-4 mt-0.5" />
                          <span className="text-xs">
                            {device.position.lat.toFixed(6)}, {device.position.lng.toFixed(6)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Link to={`/mapping?devices=${device.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <MapPin className="h-4 w-4 mr-2" />
                          View on Map
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedDevice && (
                <>
                  {getDeviceIcon(selectedDevice.type)}
                  <span>{selectedDevice.name} Settings</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Configure device settings and controls
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Tabs defaultValue="settings">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="settings">General Settings</TabsTrigger>
                <TabsTrigger value="controls">Device Controls</TabsTrigger>
              </TabsList>
              
              <TabsContent value="settings" className="space-y-4 mt-4">
                <div className="text-sm text-muted-foreground">
                  Device settings will be implemented based on specific device type requirements.
                </div>
              </TabsContent>
              
              <TabsContent value="controls" className="space-y-4 mt-4">
                <div className="text-sm text-muted-foreground">
                  Device controls will be implemented based on specific device type capabilities.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Devices;
