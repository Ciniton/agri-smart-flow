
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Smartphone, Edit, CheckCircle } from 'lucide-react';
import { DeviceMarker } from './types';

interface DeviceListProps {
  devices: DeviceMarker[];
  handleEditDevice: (deviceId: string) => void;
  setShowAddDeviceDialog: (show: boolean) => void;
  editingDeviceId?: string | null;
}

const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  handleEditDevice,
  setShowAddDeviceDialog,
  editingDeviceId = null
}) => {
  const getDeviceTypeIcon = (type: string) => {
    const commonClasses = "mr-2 h-4 w-4";
    switch (type) {
      case 'sensor':
        return <Smartphone className={`${commonClasses} text-blue-500`} />;
      case 'valve':
        return <Smartphone className={`${commonClasses} text-green-500`} />;
      case 'weather-station':
        return <Smartphone className={`${commonClasses} text-yellow-500`} />;
      default:
        return <Smartphone className={`${commonClasses} text-gray-500`} />;
    }
  }; 

  return (
    <Card className="h-full shadow-md border-primary/10 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Devices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.map((device) => (
            <div 
              key={device.id} 
              className={`flex items-center justify-between p-3 rounded cursor-pointer transition-all ${
                device.id === editingDeviceId 
                  ? "bg-primary/10 border border-primary/30" 
                  : "bg-muted hover:bg-accent"
              }`}
            >
              <div className="flex items-center">
                {getDeviceTypeIcon(device.type)}
                <div>
                  <span className="font-medium">{device.name}</span>
                  <p className="text-xs text-muted-foreground">
                    {device.position.lat.toFixed(4)}, {device.position.lng.toFixed(4)}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleEditDevice(device.id)}
                className={device.id === editingDeviceId ? "text-primary" : ""}
              >
                {device.id === editingDeviceId 
                  ? <CheckCircle className="h-4 w-4" /> 
                  : <Edit className="h-4 w-4" />}
              </Button>
            </div>
          ))}
          
          <Button 
            className="w-full group shadow-sm hover:shadow transition-all" 
            onClick={() => setShowAddDeviceDialog(true)}
            disabled={!!editingDeviceId}
          >
            <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            Add Device
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceList;
