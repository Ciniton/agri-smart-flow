
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
import { Layers, MoreVertical, Plus, Settings, RefreshCw, AlertCircle, Battery, Signal, ChevronDown, Wifi, Thermometer, Droplets, Wind } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data for devices
  const [devices, setDevices] = useState<Device[]>([
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
  ]);

  const [newDevice, setNewDevice] = useState({
    name: '',
    type: '',
    zone: '',
    serialNumber: ''
  });

  const getFilteredDevices = (category?: string) => {
    let filtered = devices.filter(device => 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.zone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (category && category !== 'all') {
      switch (category) {
        case 'sensors':
          filtered = filtered.filter(device => device.type.includes('Sensor') || device.type.includes('Meter'));
          break;
        case 'controllers':
          filtered = filtered.filter(device => device.type.includes('Controller'));
          break;
        case 'stations':
          filtered = filtered.filter(device => device.type.includes('Station'));
          break;
      }
    }

    return filtered;
  };

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

  const getDeviceIcon = (type: string) => {
    if (type.includes('Moisture') || type.includes('Soil')) return <Droplets className="h-4 w-4 mr-2 text-blue-500" />;
    if (type.includes('Weather')) return <Wind className="h-4 w-4 mr-2 text-gray-500" />;
    if (type.includes('Temperature')) return <Thermometer className="h-4 w-4 mr-2 text-red-500" />;
    if (type.includes('Valve') || type.includes('Pump')) return <Settings className="h-4 w-4 mr-2 text-green-500" />;
    if (type.includes('Flow') || type.includes('Meter')) return <Wifi className="h-4 w-4 mr-2 text-purple-500" />;
    return <Layers className="h-4 w-4 mr-2 text-blue-500" />;
  };

  const handleRefreshDevices = () => {
    toast({
      title: "Refreshing devices",
      description: "Retrieving latest status from all devices...",
    });
    
    // Simulate device status changes
    setTimeout(() => {
      const updatedDevices = devices.map(device => {
        if (device.status === 'offline') {
          return {
            ...device, 
            status: 'warning',
            batteryLevel: 15,
            signalStrength: 25,
            lastReading: 'Just now'
          };
        }
        return device;
      });
      
      setDevices(updatedDevices);
      
      toast({
        title: "Devices Refreshed",
        description: "All device statuses have been updated.",
      });
    }, 1500);
  };

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.type || !newDevice.zone || !newDevice.serialNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const device: Device = {
      id: `d${Date.now()}`,
      name: newDevice.name,
      type: newDevice.type,
      zone: newDevice.zone,
      status: 'healthy',
      lastReading: 'Just now',
      batteryLevel: 100,
      signalStrength: 80,
      serialNumber: newDevice.serialNumber,
      firmwareVersion: '1.0.0',
    };
    
    setDevices([device, ...devices]);
    setNewDevice({
      name: '',
      type: '',
      zone: '',
      serialNumber: ''
    });
    setShowAddDeviceDialog(false);
    
    toast({
      title: "Device Added",
      description: "New device has been added successfully.",
    });
  };

  const handleDiagnoseDevice = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;
    
    toast({
      title: "Diagnosing Device",
      description: `Running diagnostics on ${device.name}...`,
    });
    
    setTimeout(() => {
      if (device.status === 'error' || device.status === 'warning') {
        toast({
          title: "Diagnostic Results",
          description: `Issues found with ${device.name}. Please check connectivity and power supply.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Diagnostic Results",
          description: `${device.name} is operating normally. All systems functional.`,
        });
      }
    }, 2000);
  };

  const renderDeviceCards = (filteredDevices: Device[]) => {
    if (filteredDevices.length === 0) {
      return (
        <div className="col-span-full py-10 text-center">
          <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No devices found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or add a new device</p>
        </div>
      );
    }
    
    return filteredDevices.map((device) => (
      <Card key={device.id}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                {getDeviceIcon(device.type)}
                <CardTitle className="text-lg">{device.name}</CardTitle>
              </div>
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDiagnoseDevice(device.id)}
                >
                  <AlertCircle className="mr-2 h-3 w-3" />
                  Diagnose
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    ));
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
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
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
                    value={newDevice.type}
                    onChange={(e) => setNewDevice({...newDevice, type: e.target.value})}
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
                    value={newDevice.zone}
                    onChange={(e) => setNewDevice({...newDevice, zone: e.target.value})}
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
                    value={newDevice.serialNumber}
                    onChange={(e) => setNewDevice({...newDevice, serialNumber: e.target.value})}
                  />
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
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Devices</TabsTrigger>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
          <TabsTrigger value="controllers">Controllers</TabsTrigger>
          <TabsTrigger value="stations">Stations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {renderDeviceCards(getFilteredDevices())}
          </div>
        </TabsContent>
        
        <TabsContent value="sensors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {renderDeviceCards(getFilteredDevices('sensors'))}
          </div>
        </TabsContent>
        
        <TabsContent value="controllers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {renderDeviceCards(getFilteredDevices('controllers'))}
          </div>
        </TabsContent>
        
        <TabsContent value="stations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {renderDeviceCards(getFilteredDevices('stations'))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Devices;
