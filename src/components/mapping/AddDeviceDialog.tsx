
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Field, Zone } from './types';
import { Hash } from 'lucide-react';

interface DeviceData {
  name: string;
  type: 'sensor' | 'valve' | 'weather-station';
  fieldId?: string;
  zoneId?: string;
  serialNumber?: string;
}

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: DeviceData;
  onDeviceChange: (device: DeviceData) => void;
  onAddDevice: () => void;
  fields: Field[];
  zones: Zone[];
  isEditing?: boolean;
}

const AddDeviceDialog: React.FC<AddDeviceDialogProps> = ({
  open,
  onOpenChange,
  device,
  onDeviceChange,
  onAddDevice,
  fields,
  zones,
  isEditing = false
}) => {
  // Filter zones based on selected field
  const filteredZones = device.fieldId 
    ? zones.filter(zone => zone.fieldId === device.fieldId)
    : zones;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Device' : 'Add New Device'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Device Name</Label>
            <Input
              id="name"
              value={device.name}
              onChange={(e) => onDeviceChange({ ...device, name: e.target.value })}
              placeholder="Enter device name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Device Type</Label>
            <Select
              value={device.type}
              onValueChange={(value: 'sensor' | 'valve' | 'weather-station') => 
                onDeviceChange({ ...device, type: value })
              }
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sensor">Soil Moisture Sensor</SelectItem>
                <SelectItem value="valve">Irrigation Valve</SelectItem>
                <SelectItem value="weather-station">Weather Station</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <div className="relative">
              <Hash className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="serialNumber"
                value={device.serialNumber || ''}
                onChange={(e) => onDeviceChange({ ...device, serialNumber: e.target.value })}
                placeholder="Enter device serial number"
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="field">Assign to Field</Label>
            <Select
              value={device.fieldId || 'field_unassigned'}
              onValueChange={(value) => {
                // When field changes, clear zone selection if it doesn't belong to the new field
                const fieldId = value === 'field_unassigned' ? undefined : value;
                const newZoneId = device.zoneId && 
                  zones.find(z => z.id === device.zoneId && z.fieldId === fieldId) 
                  ? device.zoneId 
                  : undefined;
                
                onDeviceChange({ 
                  ...device, 
                  fieldId: fieldId, 
                  zoneId: newZoneId 
                });
              }}
            >
              <SelectTrigger id="field">
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="field_unassigned">Unassigned</SelectItem>
                {fields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="zone">Assign to Irrigation Zone</Label>
            <Select
              value={device.zoneId || 'zone_unassigned'}
              onValueChange={(value) => 
                onDeviceChange({ 
                  ...device, 
                  zoneId: value === 'zone_unassigned' ? undefined : value 
                })
              }
              disabled={!device.fieldId || device.fieldId === 'field_unassigned'}
            >
              <SelectTrigger id="zone">
                <SelectValue placeholder="Select a zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zone_unassigned">Unassigned</SelectItem>
                {filteredZones.map((zone) => (
                  <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onAddDevice}>{isEditing ? 'Save Changes' : 'Add Device'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceDialog;
