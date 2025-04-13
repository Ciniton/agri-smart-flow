
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Field, SoilZone } from './types';

interface AddSoilZoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: Field[];
  soilZone: {
    name: string;
    fieldId: string;
    soilType: string;
    color?: string;
  };
  onSoilZoneChange: (soilZone: {
    name: string;
    fieldId: string;
    soilType: string;
    color?: string;
  }) => void;
  onAddSoilZone: () => void;
  calculatedArea?: {
    squareMeters: number;
    hectares: number;
  };
}

const soilTypes = [
  { value: 'sandy', label: 'Sandy Soil' },
  { value: 'loamy', label: 'Loamy Soil' },
  { value: 'clay', label: 'Clay Soil' },
  { value: 'silty', label: 'Silty Soil' },
  { value: 'peaty', label: 'Peaty Soil' },
  { value: 'chalky', label: 'Chalky Soil' },
  { value: 'loamy-sand', label: 'Loamy Sand' },
  { value: 'sandy-clay', label: 'Sandy Clay' }
];

const soilColors = {
  'sandy': '#F2FCE2',      // Soft Green
  'loamy': '#FEF7CD',      // Soft Yellow
  'clay': '#FEC6A1',       // Soft Orange
  'silty': '#E5DEFF',      // Soft Purple
  'peaty': '#FFDEE2',      // Soft Pink
  'chalky': '#FDE1D3',     // Soft Peach
  'loamy-sand': '#D3E4FD', // Soft Blue
  'sandy-clay': '#F1F0FB'  // Soft Gray
};

const AddSoilZoneDialog: React.FC<AddSoilZoneDialogProps> = ({
  open,
  onOpenChange,
  fields,
  soilZone,
  onSoilZoneChange,
  onAddSoilZone,
  calculatedArea
}) => {
  // Update soil zone name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSoilZoneChange({ ...soilZone, name: e.target.value });
  };

  // Update soil zone field
  const handleFieldChange = (fieldId: string) => {
    onSoilZoneChange({ ...soilZone, fieldId });
  };

  // Update soil type
  const handleSoilTypeChange = (soilType: string) => {
    // Automatically set color based on soil type
    const color = soilColors[soilType as keyof typeof soilColors] || '#A1CCA5';
    onSoilZoneChange({ ...soilZone, soilType, color });
  };

  // Update color manually
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSoilZoneChange({ ...soilZone, color: e.target.value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Soil Zone</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={soilZone.name}
              onChange={handleNameChange}
              className="col-span-3"
              placeholder="Enter soil zone name"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="field" className="text-right text-sm font-medium">
              Field
            </label>
            <Select
              value={soilZone.fieldId}
              onValueChange={handleFieldChange}
            >
              <SelectTrigger className="col-span-3" id="field">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {fields.map(field => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="soilType" className="text-right text-sm font-medium">
              Soil Type
            </label>
            <Select
              value={soilZone.soilType}
              onValueChange={handleSoilTypeChange}
            >
              <SelectTrigger className="col-span-3" id="soilType">
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                {soilTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="color" className="text-right text-sm font-medium">
              Color
            </label>
            <div className="col-span-3 flex items-center space-x-2">
              <Input
                id="color"
                type="color"
                value={soilZone.color || '#A1CCA5'}
                onChange={handleColorChange}
                className="w-12 h-8 p-0 cursor-pointer"
              />
              <div className="text-sm text-muted-foreground">
                Color will be used to display the soil zone on the map
              </div>
            </div>
          </div>
          
          {calculatedArea && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right text-sm font-medium">
                Area
              </span>
              <div className="col-span-3 text-sm">
                <span className="font-medium">{calculatedArea.hectares.toFixed(2)}</span> hectares 
                (<span className="font-medium">{calculatedArea.squareMeters.toLocaleString()}</span> m²)
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddSoilZone}>
            {calculatedArea ? 'Save' : 'Draw on Map'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSoilZoneDialog;
