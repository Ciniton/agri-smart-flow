
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Layers, MoreVertical, Plus, Settings, RefreshCw, AlertCircle, Battery, Signal, ChevronDown, Wifi } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Device {
  id: string;
  name: string;
  type: string;
  zone: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  lastReading: string;
  batteryLevel?: number;
  signalStrength?: number;
  lastMaintenance?: string;
  serialNumber: string;
  firmwareVersion?: string;
}

const Devices: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDeviceDialog, setShowAddDeviceDialog] = useState(false);
  
  // Mock data for devices
  const devices: Device[] = [
    { 
      id: 'd1', 
      name: 'Valve Controller A1', 
      type: 'Valve Controller', 
      zone: 'North Field', 
      status: 'healthy', 
      lastReading: '2 min ago',
      batteryLevel: 85,
      signalStrength: 90,
      lastMaintenance: '2023-10-15',
      serialNumber: 'VC-2023-1001',
      firmwareVersion: '2.3.1',
    },
    { 
      id: 'd2', 
      name: 'Moisture Sensor B3', 
      type: 'Soil Moisture Sensor', 
      zone: 'East Field', 
      status: 'warning', 
      lastReading: '5 min ago',
      batteryLevel: 32,
      signalStrength: 65,
      lastMaintenance: '2023-09-20',
      serialNumber: 'MS-2023-2045',
      firmwareVersion: '1.7.5',
    },
    { 
      id: 'd3', 
      name: 'Weather Station', 
      type: 'Weather Station', 
      zone: 'Central', 
      status: 'healthy', 
      lastReading: '1 min ago',
      batteryLevel: 92,
      signalStrength: 95,
      lastMaintenance: '2023-11-05',
      serialNumber: 'WS-2023-3078',
      firmwareVersion: '3.1.2',
    },
    { 
      id: 'd4', 
      name: 'Valve Controller C2', 
      type: 'Valve Controller', 
      zone: 'South Field', 
      status: 'error', 
      lastReading: '15 min ago',
      batteryLevel: 75,
      signalStrength: 20,
      lastMaintenance: '2023-08-10',
      serialNumber: 'VC-2023-1078',
      firmwareVersion: '2.3.1',
    },
    { 
      id: 'd5', 
      name: 'Flow Meter M1', 
      type: 'Flow Meter', 
      zone: 'Irrigation System', 
      status: 'healthy', 
      lastReading: '3 min ago',
      batteryLevel: 90,
      signalStrength: 88,
      lastMaintenance: '2023-10-25',
      serialNumber: 'FM-2023-4023',
      firmwareVersion: '1.5.0',
    },
    { 
      id: 'd6', 
      name: 'Pump Control Unit', 
      type: 'Pump Controller', 
      zone: 'Pump House', 
      status: 'offline', 
      lastReading: '1 hr ago',
      batteryLevel: 0,
      signalStrength: 0,
      lastMaintenance: '2023-07-15',
      serialNumber: 'PC-2023-5012',
      firmwareVersion: '2.0.5',
    },
  ];

  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Device['status']) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-500">Error</Badge>;
      case 'offline':
        return <Badge variant="outline">Offline</Badge>;
    }
  };

  const getBatteryIndicator = (level?: number) => {
    if (level === undefined) return null;
    
    let color = 'text-gray-400';
    if (level > 70) color = 'text-green-500';
    else if (level > 30) color = 'text-amber-500';
    else color = 'text-red-500';
    
    return (
      <div className="flex items-center">
        <Battery className={`h-4 w-4 mr-1 ${color}`} />
        <span className="text-xs">{level}%</span>
      </div>
    );
  };

  const getSignalIndicator = (strength?: number) => {
    if (strength === undefined) return null;
    
    let color = 'text-gray-400';
    if (strength > 70) color = 'text-green-500';
    else if (strength > 30) color = 'text-amber-500';
    else color = 'text-red-500';
    
    return (
      <div className="flex items-center">
        <Signal className={`h-4 w-4 mr-1 ${color}`} />
        <span className="text-xs">{strength}%</span>
      </div>
    );
  };

  const handleRefreshDevices = () => {
    toast({
      title: "Refreshing devices",
      description: "Retrieving latest status from all devices...",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sensors & Devices</h1>
        <p className="text-muted-foreground mt-1">Manage your connected devices</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Input
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Layers className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefreshDevices}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Dialog open={showAddDeviceDialog} onOpenChange={setShowAddDeviceDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
                <DialogDescription>
                  Enter the details of the new device or sensor you want to add to your system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="deviceName" className="text-right text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="deviceName"
                    placeholder="Enter device name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="deviceType" className="text-right text-sm font-medium">
                    Type
                  </label>
                  <Input
                    id="deviceType"
                    placeholder="Enter device type"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="deviceZone" className="text-right text-sm font-medium">
                    Zone
                  </label>
                  <Input
                    id="deviceZone"
                    placeholder="Enter zone location"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="deviceSerial" className="text-right text-sm font-medium">
                    Serial Number
                  </label>
                  <Input
                    id="deviceSerial"
                    placeholder="Enter serial number"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDeviceDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Device Added",
                    description: "New device has been added successfully.",
                  });
                  setShowAddDeviceDialog(false);
                }}>
                  Add Device
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Devices</TabsTrigger>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
          <TabsTrigger value="controllers">Controllers</TabsTrigger>
          <TabsTrigger value="stations">Stations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDevices.map((device) => (
              <Card key={device.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                      <CardDescription>{device.type} - {device.zone}</CardDescription>
                    </div>
                    {getStatusBadge(device.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <Collapsible className="space-y-2">
                    <div className="flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        Last Reading: {device.lastReading}
                      </div>
                      <div className="flex space-x-2">
                        {getBatteryIndicator(device.batteryLevel)}
                        {getSignalIndicator(device.signalStrength)}
                      </div>
                    </div>
                    
                    <CollapsibleTrigger className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors">
                      <span>Show Details</span>
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="space-y-2 pt-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Serial Number</p>
                          <p className="text-xs font-medium">{device.serialNumber}</p>
                        </div>
                        {device.firmwareVersion && (
                          <div>
                            <p className="text-xs text-muted-foreground">Firmware</p>
                            <p className="text-xs font-medium">{device.firmwareVersion}</p>
                          </div>
                        )}
                        {device.lastMaintenance && (
                          <div>
                            <p className="text-xs text-muted-foreground">Last Maintenance</p>
                            <p className="text-xs font-medium">{device.lastMaintenance}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="outline" size="sm">
                          <Settings className="mr-2 h-3 w-3" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <AlertCircle className="mr-2 h-3 w-3" />
                          Diagnose
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sensors">
          {/* Similar content to "all" but filtered for sensors */}
          <div className="bg-muted p-8 text-center rounded-md">
            <h3 className="text-lg font-medium">Sensor Management</h3>
            <p className="text-muted-foreground mt-2">View and manage your sensor devices here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="controllers">
          {/* Similar content to "all" but filtered for controllers */}
          <div className="bg-muted p-8 text-center rounded-md">
            <h3 className="text-lg font-medium">Controller Management</h3>
            <p className="text-muted-foreground mt-2">View and manage your controller devices here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="stations">
          {/* Similar content to "all" but filtered for stations */}
          <div className="bg-muted p-8 text-center rounded-md">
            <h3 className="text-lg font-medium">Station Management</h3>
            <p className="text-muted-foreground mt-2">View and manage your weather and monitoring stations here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Devices;
