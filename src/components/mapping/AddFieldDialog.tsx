
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

interface AddFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldName: string;
  fieldArea: string;
  onFieldNameChange: (name: string) => void;
  onFieldAreaChange: (area: string) => void;
  onAddField: () => void;
}

const AddFieldDialog: React.FC<AddFieldDialogProps> = ({
  open,
  onOpenChange,
  fieldName,
  fieldArea,
  onFieldNameChange,
  onFieldAreaChange,
  onAddField,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Field</DialogTitle>
          <DialogDescription>
            Enter field details and then draw its boundaries on the map.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fieldName" className="text-right">
              Field Name
            </Label>
            <Input
              id="fieldName"
              placeholder="Enter field name"
              className="col-span-3"
              value={fieldName}
              onChange={(e) => onFieldNameChange(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fieldArea" className="text-right">
              Area (m²)
            </Label>
            <Input
              id="fieldArea"
              type="number"
              placeholder="Optional"
              className="col-span-3"
              value={fieldArea}
              onChange={(e) => onFieldAreaChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddField}>
            Add Field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFieldDialog;
