
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  calculatedArea?: { squareMeters: number; hectares: number } | null;
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
  calculatedArea = null,
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
          <DialogTitle>Add New Irrigation Zone</DialogTitle>
          <DialogDescription>
            {calculatedArea 
              ? `Enter zone details for the drawn zone (${calculatedArea.squareMeters.toLocaleString()} m² / ${calculatedArea.hectares.toFixed(2)} ha).`
              : "Enter zone details and then draw its boundaries on the map."}
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
            <Select
              value={fieldId}
              onValueChange={onFieldIdChange}
              disabled={calculatedArea !== null}
            >
              <SelectTrigger id="zoneField" className="col-span-3">
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                {fields.map(field => (
                  <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="zoneType" className="text-right">
              Irrigation Type
            </Label>
            <Select
              value={irrigationType}
              onValueChange={(value) => onIrrigationTypeChange(value as 'low' | 'medium' | 'high')}
            >
              <SelectTrigger id="zoneType" className="col-span-3">
                <SelectValue placeholder="Select irrigation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Irrigation</SelectItem>
                <SelectItem value="medium">Medium Irrigation</SelectItem>
                <SelectItem value="high">High Irrigation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {calculatedArea && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Zone Area
              </Label>
              <div className="col-span-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{calculatedArea.squareMeters.toLocaleString()} m²</span>
                  <span className="text-xs text-muted-foreground">{calculatedArea.hectares.toFixed(2)} hectares</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddZone}>
            {calculatedArea ? "Save Zone" : "Add Zone"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddZoneDialog;
