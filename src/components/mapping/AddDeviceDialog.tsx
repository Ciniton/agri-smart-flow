
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Field, Zone } from './types';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceName: string;
  deviceType: 'sensor' | 'valve' | 'weather-station';
  location: { lat: number, lng: number } | null;
  onDeviceNameChange: (name: string) => void;
  onDeviceTypeChange: (type: 'sensor' | 'valve' | 'weather-station') => void;
  onAddDevice: () => void;
  fields?: Field[];
  selectedFieldId?: string;
  onFieldSelect?: (fieldId: string) => void;
  zones?: Zone[];
  selectedZoneId?: string;
  onZoneSelect?: (zoneId: string) => void;
  filteredZones?: Zone[];
}

const AddDeviceDialog: React.FC<AddDeviceDialogProps> = ({
  open,
  onOpenChange,
  deviceName,
  deviceType,
  location,
  onDeviceNameChange,
  onDeviceTypeChange,
  onAddDevice,
  fields = [],
  selectedFieldId = '',
  onFieldSelect = () => {},
  zones = [],
  selectedZoneId = '',
  onZoneSelect = () => {},
  filteredZones = zones
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MapPin className="mr-2 h-4 w-4" />
          Place Device
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription>
            Enter device details to place it at the selected location.
            {location ? ` (${location.lat.toFixed(6)}, ${location.lng.toFixed(6)})` : ' Please select a location on the map first.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deviceName" className="text-right">
              Device Name
            </Label>
            <Input
              id="deviceName"
              placeholder="Enter device name"
              className="col-span-3"
              value={deviceName}
              onChange={(e) => onDeviceNameChange(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deviceType" className="text-right">
              Device Type
            </Label>
            <Select
              value={deviceType}
              onValueChange={(value) => onDeviceTypeChange(value as 'sensor' | 'valve' | 'weather-station')}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sensor">Soil Moisture Sensor</SelectItem>
                <SelectItem value="valve">Valve Controller</SelectItem>
                <SelectItem value="weather-station">Weather Station</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fieldSelect" className="text-right">
              Assign to Field
            </Label>
            <Select
              value={selectedFieldId}
              onValueChange={onFieldSelect}
            >
              <SelectTrigger className="col-span-3" id="fieldSelect">
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {fields.map(field => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="zoneSelect" className="text-right">
              Assign to Zone
            </Label>
            <Select
              value={selectedZoneId}
              onValueChange={onZoneSelect}
              disabled={filteredZones.length === 0}
            >
              <SelectTrigger className="col-span-3" id="zoneSelect">
                <SelectValue placeholder={filteredZones.length === 0 ? "No zones in selected field" : "Select a zone"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {filteredZones.map(zone => (
                  <SelectItem key={zone.id} value={zone.id}>
                    {zone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onAddDevice}
            disabled={!deviceName.trim() || !location}
          >
            Add Device
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceDialog;
