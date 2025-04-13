
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, Sun, Edit, Eye } from 'lucide-react';
import { DeviceMarker, Field, Zone } from './types';

interface DeviceListProps {
  devices: DeviceMarker[];
  fields: Field[];
  zones?: Zone[];
  handleEditDevice: (deviceId: string) => void;
  handleViewDevice: (device: DeviceMarker) => void;
  setShowAddDeviceDialog: (show: boolean) => void;
  editingDeviceId?: string | null;
}

const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  fields,
  zones = [],
  handleEditDevice,
  handleViewDevice,
  setShowAddDeviceDialog,
  editingDeviceId = null
}) => {
  // Get device icon based on type
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'sensor':
        return <Thermometer className="h-4 w-4 text-blue-500" />;
      case 'valve':
        return <Droplets className="h-4 w-4 text-green-500" />;
      case 'weather-station':
        return <Sun className="h-4 w-4 text-amber-500" />;
      default:
        return <Thermometer className="h-4 w-4" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Devices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.map((device) => (
            <div 
              key={device.id} 
              className={`flex items-center justify-between p-3 rounded hover:bg-accent cursor-pointer ${
                editingDeviceId === device.id ? 'bg-primary/10 border border-primary' : 'bg-muted'
              }`}
            >
              <div className="flex items-center flex-grow" onClick={() => handleViewDevice(device)}>
                {getDeviceIcon(device.type)}
                <div className="ml-2 flex flex-col">
                  <span className="font-medium">
                    {device.name}
                    {editingDeviceId === device.id && ' (Editing)'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {device.fieldId && fields.find(f => f.id === device.fieldId)?.name}
                    {device.zoneId && zones.find(z => z.id === device.zoneId) && 
                      ` → ${zones.find(z => z.id === device.zoneId)?.name}`
                    }
                  </span>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={() => handleViewDevice(device)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEditDevice(device.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <Button className="w-full" onClick={() => setShowAddDeviceDialog(true)}>
            Add Device
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceList;
