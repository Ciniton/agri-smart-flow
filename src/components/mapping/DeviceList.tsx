
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Edit, Plus } from 'lucide-react';
import { DeviceMarker } from './types';

interface DeviceListProps {
  devices: DeviceMarker[];
  handleEditDevice: (deviceId: string) => void;
  setShowAddDeviceDialog: (show: boolean) => void;
}

const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  handleEditDevice,
  setShowAddDeviceDialog,
}) => {
  return (
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
  );
};

export default DeviceList;
