
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
import { Plus } from 'lucide-react';
import { Field } from './types';

interface AddZoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zoneName: string;
  fieldId: string;
  irrigationType: 'low' | 'medium' | 'high';
  onZoneNameChange: (name: string) => void;
  onFieldIdChange: (id: string) => void;
  onIrrigationTypeChange: (type: 'low' | 'medium' | 'high') => void;
  onAddZone: () => void;
  fields: Field[];
}

const AddZoneDialog: React.FC<AddZoneDialogProps> = ({
  open,
  onOpenChange,
  zoneName,
  fieldId,
  irrigationType,
  onZoneNameChange,
  onFieldIdChange,
  onIrrigationTypeChange,
  onAddZone,
  fields,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Zone
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Zone</DialogTitle>
          <DialogDescription>
            Enter zone details and then draw its boundaries on the map.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="zoneName" className="text-right">
              Zone Name
            </Label>
            <Input
              id="zoneName"
              placeholder="Enter zone name"
              className="col-span-3"
              value={zoneName}
              onChange={(e) => onZoneNameChange(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="zoneField" className="text-right">
              Field
            </Label>
            <select
              id="zoneField"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={fieldId}
              onChange={(e) => onFieldIdChange(e.target.value)}
            >
              <option value="" disabled>Select a field</option>
              {fields.map(field => (
                <option key={field.id} value={field.id}>{field.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="zoneType" className="text-right">
              Irrigation Type
            </Label>
            <select
              id="zoneType"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={irrigationType}
              onChange={(e) => onIrrigationTypeChange(e.target.value as 'low' | 'medium' | 'high')}
            >
              <option value="low">Low Irrigation</option>
              <option value="medium">Medium Irrigation</option>
              <option value="high">High Irrigation</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddZone}>
            Add Zone
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddZoneDialog;
