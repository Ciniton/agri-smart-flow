
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Field } from './types';
import { Plus, Eye, Edit, Trash2, MapPin } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface FieldListProps {
  fields: Field[];
  newField: { name: string; area: string };
  showAddFieldDialog: boolean;
  setShowAddFieldDialog: (show: boolean) => void;
  setNewField: (field: { name: string; area: string }) => void;
  handleEditField: (fieldId: string) => void;
  handleAddField: () => void;
  handleViewField: (field: Field) => void;
  activeFieldId?: string;
  handleEditBoundaries?: (field: Field) => void;
  setFields?: React.Dispatch<React.SetStateAction<Field[]>>;
}

const FieldList: React.FC<FieldListProps> = ({
  fields,
  setShowAddFieldDialog,
  handleEditField,
  handleViewField,
  activeFieldId,
  handleEditBoundaries,
  setFields
}) => {
  const handleDeleteField = (fieldId: string) => {
    if (setFields) {
      setFields(prevFields => prevFields.filter(field => field.id !== fieldId));
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <CardTitle>Fields</CardTitle>
        <Button size="sm" onClick={() => setShowAddFieldDialog(true)} className="flex items-center h-8">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="flex-grow p-3 overflow-auto">
        {fields.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">
            No fields found. Add a field using the button above.
          </div>
        ) : (
          <div className="space-y-2">
            {fields.map((field) => (
              <div
                key={field.id}
                className={`p-3 rounded hover:bg-accent/40 transition-colors ${
                  activeFieldId === field.id ? 'bg-primary/10 border border-primary' : 'bg-card'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-sm">{field.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {field.area 
                        ? `${field.area.hectares.toFixed(2)} ha (${field.area.squareMeters.toLocaleString()} m²)` 
                        : 'No area data'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last modified: {formatDistance(new Date(field.lastModified), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 flex items-center text-xs"
                    onClick={() => handleViewField(field)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 flex items-center text-xs"
                    onClick={() => handleEditField(field.id)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit Details
                  </Button>

                  {handleEditBoundaries && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 flex items-center text-xs"
                      onClick={() => handleEditBoundaries(field)}
                    >
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      Edit Boundaries
                    </Button>
                  )}

                  {setFields && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 flex items-center justify-center"
                      onClick={() => handleDeleteField(field.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FieldList;
