
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, Sun, Edit, MapPin, Trash2, Plus, Hash } from 'lucide-react';
import { DeviceMarker, Field, Zone } from './types';

interface DeviceListProps {
  devices: DeviceMarker[];
  fields: Field[];
  zones?: Zone[];
  handleEditDevice: (deviceId: string, editMode: 'details' | 'location') => void;
  handleRemoveDevice: (deviceId: string) => void;
  setShowAddDeviceDialog: () => void;
  editingDeviceId?: string | null;
}

const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  fields,
  zones = [],
  handleEditDevice,
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
                className={`p-3 rounded hover:bg-accent/40 transition-colors ${
                  editingDeviceId === device.id ? 'bg-primary/10 border border-primary' : 'bg-card'
                }`}
              >
                <div className="flex items-center mb-2">
                  {getDeviceIcon(device.type)}
                  <div className="ml-2 flex flex-col">
                    <span className="font-medium text-sm">
                      {device.name}
                      {editingDeviceId === device.id && ' (Editing)'}
                    </span>
                    <div className="flex flex-col text-xs text-muted-foreground">
                      <span className="truncate max-w-[200px]">
                        {device.fieldId && fields.find(f => f.id === device.fieldId)?.name}
                        {device.zoneId && zones.find(z => z.id === device.zoneId) && 
                          ` → ${zones.find(z => z.id === device.zoneId)?.name}`
                        }
                      </span>
                      {device.serialNumber && (
                        <span className="flex items-center">
                          <Hash className="h-3 w-3 mr-1" />
                          {device.serialNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 flex-1 flex items-center justify-center" 
                    onClick={() => handleEditDevice(device.id, 'details')}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit Details
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 flex-1 flex items-center justify-center" 
                    onClick={() => handleEditDevice(device.id, 'location')}
                  >
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    Move on Map
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 flex items-center justify-center" 
                    onClick={() => handleRemoveDevice(device.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
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
