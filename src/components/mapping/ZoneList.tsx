
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Eye, Edit } from 'lucide-react';
import { Zone, Field } from './types';
import AddZoneDialog from './AddZoneDialog';

interface ZoneListProps {
  zones: Zone[];
  fields: Field[];
  newZone: { name: string; fieldId: string; irrigationType: 'low' | 'medium' | 'high' };
  showAddZoneDialog: boolean;
  setShowAddZoneDialog: (show: boolean) => void;
  setNewZone: (zone: { name: string; fieldId: string; irrigationType: 'low' | 'medium' | 'high' }) => void;
  handleEditZone: (zoneId: string) => void;
  handleAddZone: () => void;
  onViewZone?: (zone: Zone) => void;
  calculatedArea?: { squareMeters: number; hectares: number } | null;
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
  onViewZone = () => {},
  calculatedArea = null,
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Irrigation Zones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {zones.map((zone) => (
            <div key={zone.id} className="flex items-center justify-between p-3 bg-muted rounded hover:bg-accent cursor-pointer">
              <div className="flex items-center flex-grow" onClick={() => onViewZone(zone)}>
                <Droplets className={`mr-2 h-4 w-4 ${
                  zone.irrigationType === 'low' ? "text-blue-300" :
                  zone.irrigationType === 'medium' ? "text-blue-500" : "text-blue-700"
                }`} />
                <div className="flex flex-col">
                  <span className="font-medium">{zone.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {fields.find(f => f.id === zone.fieldId)?.name}
                    {zone.area && ` - ${zone.area.hectares.toFixed(2)} ha`}
                  </span>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={() => onViewZone(zone)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEditZone(zone.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <AddZoneDialog
            open={showAddZoneDialog}
            onOpenChange={setShowAddZoneDialog}
            zoneName={newZone.name}
            fieldId={newZone.fieldId}
            irrigationType={newZone.irrigationType}
            onZoneNameChange={(name) => setNewZone({...newZone, name})}
            onFieldIdChange={(fieldId) => setNewZone({...newZone, fieldId})}
            onIrrigationTypeChange={(irrigationType) => setNewZone({...newZone, irrigationType})}
            onAddZone={handleAddZone}
            fields={fields}
            calculatedArea={calculatedArea}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ZoneList;
