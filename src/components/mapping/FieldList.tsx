
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Edit, MapPin, Eye } from 'lucide-react';
import { Field } from './types';
import AddFieldDialog from './AddFieldDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FieldListProps {
  fields: Field[];
  newField: { name: string; area: string };
  showAddFieldDialog: boolean;
  setShowAddFieldDialog: (show: boolean) => void;
  setNewField: (field: { name: string; area: string }) => void;
  handleEditField: (fieldId: string) => void;
  handleAddField: () => void;
  handleViewField?: (field: Field) => void; // New prop to handle viewing a field
  activeFieldId?: string; // New prop to highlight active field
}

const FieldList: React.FC<FieldListProps> = ({
  fields,
  newField,
  showAddFieldDialog,
  setShowAddFieldDialog,
  setNewField,
  handleEditField,
  handleAddField,
  handleViewField,
  activeFieldId
}) => {
  // Format area to be more readable
  const formatArea = (area: { squareMeters: number; hectares: number } | undefined) => {
    if (!area) return '';
    if (area.hectares < 1) {
      return `${area.squareMeters.toLocaleString()} m²`;
    }
    return `${area.hectares.toFixed(2)} ha`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Fields</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.length === 0 ? (
            <div className="text-center p-4 border-2 border-dashed border-muted-foreground/20 rounded-md">
              <p className="text-muted-foreground">No fields yet. Use the button below to add your first field.</p>
            </div>
          ) : (
            fields.map((field) => (
              <div 
                key={field.id} 
                className={`flex items-center justify-between p-3 ${
                  activeFieldId === field.id 
                    ? 'bg-primary/10 border border-primary' 
                    : 'bg-muted hover:bg-accent'
                } rounded cursor-pointer transition-all duration-200`}
                onClick={() => handleViewField && handleViewField(field)}
              >
                <div className="flex items-center">
                  <Leaf className="mr-2 h-4 w-4 text-green-500" />
                  <div>
                    <span className="font-medium">{field.name}</span>
                    {field.area && (
                      <p className="text-xs text-muted-foreground">
                        {formatArea(field.area)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewField && handleViewField(field);
                          }}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View field</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditField(field.id);
                          }}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit field</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))
          )}
          
          <AddFieldDialog
            open={showAddFieldDialog}
            onOpenChange={setShowAddFieldDialog}
            fieldName={newField.name}
            fieldArea={newField.area}
            onFieldNameChange={(name) => setNewField({...newField, name})}
            onFieldAreaChange={(area) => setNewField({...newField, area})}
            onAddField={handleAddField}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldList;
