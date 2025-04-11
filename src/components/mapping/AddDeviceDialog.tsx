
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

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceName: string;
  deviceType: 'sensor' | 'valve' | 'weather-station';
  location: { lat: number, lng: number } | null;
  onDeviceNameChange: (name: string) => void;
  onDeviceTypeChange: (type: 'sensor' | 'valve' | 'weather-station') => void;
  onAddDevice: () => void;
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
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deviceType" className="text-right">
              Device Type
            </Label>
            <select
              id="deviceType"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={deviceType}
              onChange={(e) => onDeviceTypeChange(e.target.value as 'sensor' | 'valve' | 'weather-station')}
            >
              <option value="sensor">Soil Moisture Sensor</option>
              <option value="valve">Valve Controller</option>
              <option value="weather-station">Weather Station</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddDevice}>
            Add Device
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceDialog;
