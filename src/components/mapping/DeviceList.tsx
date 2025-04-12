
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Smartphone, Edit, CheckCircle, Thermometer, Droplet, Wind } from 'lucide-react';
import { DeviceMarker, Field } from './types';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DeviceListProps {
  devices: DeviceMarker[];
  fields: Field[];
  handleEditDevice: (deviceId: string) => void;
  setShowAddDeviceDialog: (show: boolean) => void;
  editingDeviceId?: string | null;
  handleViewDevice?: (device: DeviceMarker) => void;
}

const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  fields,
  handleEditDevice,
  setShowAddDeviceDialog,
  editingDeviceId = null,
  handleViewDevice
}) => {
  const getDeviceTypeIcon = (type: string) => {
    const commonClasses = "mr-2 h-4 w-4";
    switch (type) {
      case 'sensor':
        return <Droplet className={`${commonClasses} text-blue-500`} />;
      case 'valve':
        return <Smartphone className={`${commonClasses} text-green-500`} />;
      case 'weather-station':
        return <Wind className={`${commonClasses} text-yellow-500`} />;
      default:
        return <Smartphone className={`${commonClasses} text-gray-500`} />;
    }
  };

  // Find field name from fieldId
  const getFieldName = (fieldId?: string) => {
    if (!fieldId) return "Unassigned";
    const field = fields.find(f => f.id === fieldId);
    return field ? field.name : "Unknown Field";
  };

  return (
    <Card className="h-full shadow-md border-primary/10 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Devices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.length === 0 ? (
            <div className="text-center p-4 border-2 border-dashed border-muted-foreground/20 rounded-md">
              <p className="text-muted-foreground">No devices yet. Use the button below to add your first device.</p>
            </div>
          ) : (
            devices.map((device) => (
              <div 
                key={device.id} 
                className={`flex items-center justify-between p-3 rounded cursor-pointer transition-all ${
                  device.id === editingDeviceId 
                    ? "bg-primary/10 border border-primary/30" 
                    : "bg-muted hover:bg-accent"
                }`}
                onClick={() => handleViewDevice && handleViewDevice(device)}
              >
                <div className="flex items-center">
                  {getDeviceTypeIcon(device.type)}
                  <div>
                    <span className="font-medium">{device.name}</span>
                    <div className="flex flex-col space-y-1 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {device.position.lat.toFixed(4)}, {device.position.lng.toFixed(4)}
                      </p>
                      <Badge variant="outline" className="text-xs w-fit">
                        {getFieldName(device.fieldId)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDevice(device.id);
                        }}
                        className={device.id === editingDeviceId ? "text-primary" : ""}
                      >
                        {device.id === editingDeviceId 
                          ? <CheckCircle className="h-4 w-4" /> 
                          : <Edit className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{device.id === editingDeviceId ? "Save position" : "Edit device"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))
          )}
          
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
