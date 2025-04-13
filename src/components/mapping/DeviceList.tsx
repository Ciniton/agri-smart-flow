
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, Sun, Edit, Eye, Trash2, Plus } from 'lucide-react';
import { DeviceMarker, Field, Zone } from './types';

interface DeviceListProps {
  devices: DeviceMarker[];
  fields: Field[];
  zones?: Zone[];
  handleEditDevice: (deviceId: string) => void;
  handleViewDevice: (device: DeviceMarker) => void;
  handleRemoveDevice: (deviceId: string) => void;
  setShowAddDeviceDialog: () => void;
  editingDeviceId?: string | null;
}

const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  fields,
  zones = [],
  handleEditDevice,
  handleViewDevice,
  handleRemoveDevice,
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
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <CardTitle>Devices</CardTitle>
        <Button size="sm" onClick={setShowAddDeviceDialog} className="flex items-center h-8">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="flex-grow p-3 overflow-auto">
        {devices.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">
            No devices found. Add a device using the button above.
          </div>
        ) : (
          <div className="space-y-2">
            {devices.map((device) => (
              <div 
                key={device.id} 
                className={`flex items-center justify-between p-2 rounded hover:bg-accent/40 transition-colors ${
                  editingDeviceId === device.id ? 'bg-primary/10 border border-primary' : 'bg-card'
                }`}
              >
                <div className="flex items-center flex-grow pr-2" onClick={() => handleViewDevice(device)}>
                  {getDeviceIcon(device.type)}
                  <div className="ml-2 flex flex-col">
                    <span className="font-medium text-sm">
                      {device.name}
                      {editingDeviceId === device.id && ' (Editing)'}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {device.fieldId && fields.find(f => f.id === device.fieldId)?.name}
                      {device.zoneId && zones.find(z => z.id === device.zoneId) && 
                        ` → ${zones.find(z => z.id === device.zoneId)?.name}`
                      }
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDevice(device)}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditDevice(device.id)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveDevice(device.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceList;
