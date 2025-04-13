
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddZoneDialog from './AddZoneDialog';
import { Zone, Field } from './types';
import { Plus, Eye, Edit, Trash2, Droplets, MapPin } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface ZoneData {
  name: string;
  fieldId: string;
  irrigationType: 'low' | 'medium' | 'high';
  boundaries?: { lat: number; lng: number }[];
  center?: { lat: number; lng: number };
  area?: { squareMeters: number; hectares: number };
}

interface ZoneListProps {
  zones: Zone[];
  fields: Field[];
  newZone: ZoneData;
  showAddZoneDialog: boolean;
  setShowAddZoneDialog: (show: boolean) => void;
  setNewZone: (zone: ZoneData) => void;
  handleEditZone: (zoneId: string) => void;
  handleAddZone: () => void;
  onViewZone: (zone: Zone) => void;
  calculatedArea?: { squareMeters: number; hectares: number };
  handleEditBoundaries?: (zone: Zone) => void;
}

const ZoneList: React.FC<ZoneListProps> = ({
  zones,
  fields,
  newZone,
  showAddZoneDialog,
  setShowAddZoneDialog,
  setNewZone,
  handleEditZone,
  handleAddZone,
  onViewZone,
  calculatedArea,
  handleEditBoundaries
}) => {
  const getIrrigationTypeColor = (type: string) => {
    switch (type) {
      case 'low':
        return 'bg-blue-300';
      case 'high':
        return 'bg-blue-700';
      case 'medium':
      default:
        return 'bg-blue-500';
    }
  };

  const handleZoneNameChange = (name: string) => {
    setNewZone({ ...newZone, name });
  };

  const handleFieldIdChange = (id: string) => {
    setNewZone({ ...newZone, fieldId: id });
  };

  const handleIrrigationTypeChange = (type: 'low' | 'medium' | 'high') => {
    setNewZone({ ...newZone, irrigationType: type });
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="p-4 flex flex-row items-center justify-between">
          <CardTitle>Irrigation Zones</CardTitle>
          <Button size="sm" onClick={() => setShowAddZoneDialog(true)} className="flex items-center h-8">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="flex-grow p-3 overflow-auto">
          {zones.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              No irrigation zones found. Add a zone using the button above.
            </div>
          ) : (
            <div className="space-y-2">
              {zones.map((zone) => {
                const parentField = fields.find(f => f.id === zone.fieldId);
                return (
                  <div
                    key={zone.id}
                    className="p-3 rounded hover:bg-accent/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center mb-1">
                          <div className={`w-3 h-3 rounded-full ${getIrrigationTypeColor(zone.irrigationType)} mr-2`}></div>
                          <h3 className="font-medium text-sm">{zone.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Field: {parentField?.name || 'Unassigned'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {zone.area 
                            ? `${zone.area.hectares.toFixed(2)} ha (${zone.area.squareMeters.toLocaleString()} m²)` 
                            : 'No area data'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last modified: {formatDistance(new Date(zone.lastModified), new Date(), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 flex items-center text-xs"
                        onClick={() => onViewZone(zone)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        View
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 flex items-center text-xs"
                        onClick={() => handleEditZone(zone.id)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit Details
                      </Button>

                      {handleEditBoundaries && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 flex items-center text-xs"
                          onClick={() => handleEditBoundaries(zone)}
                        >
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          Edit Boundaries
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddZoneDialog
        open={showAddZoneDialog}
        onOpenChange={setShowAddZoneDialog}
        zoneName={newZone.name}
        fieldId={newZone.fieldId}
        irrigationType={newZone.irrigationType}
        onZoneNameChange={handleZoneNameChange}
        onFieldIdChange={handleFieldIdChange}
        onIrrigationTypeChange={handleIrrigationTypeChange}
        onAddZone={handleAddZone}
        fields={fields}
        calculatedArea={calculatedArea}
      />
    </>
  );
};

export default ZoneList;
