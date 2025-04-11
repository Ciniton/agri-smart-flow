
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Edit } from 'lucide-react';
import { Field } from './types';
import AddFieldDialog from './AddFieldDialog';

interface FieldListProps {
  fields: Field[];
  newField: { name: string; area: string };
  showAddFieldDialog: boolean;
  setShowAddFieldDialog: (show: boolean) => void;
  setNewField: (field: { name: string; area: string }) => void;
  handleEditField: (fieldId: string) => void;
  handleAddField: () => void;
}

const FieldList: React.FC<FieldListProps> = ({
  fields,
  newField,
  showAddFieldDialog,
  setShowAddFieldDialog,
  setNewField,
  handleEditField,
  handleAddField,
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Fields</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center justify-between p-3 bg-muted rounded hover:bg-accent cursor-pointer">
              <div className="flex items-center">
                <Leaf className="mr-2 h-4 w-4 text-green-500" />
                <div>
                  <span className="font-medium">{field.name}</span>
                  {field.area && <p className="text-xs text-muted-foreground">{field.area.toLocaleString()} m²</p>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleEditField(field.id)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
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
