
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Edit } from 'lucide-react';
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
              <div className="flex items-center">
                <Droplets className={`mr-2 h-4 w-4 ${
                  zone.irrigationType === 'low' ? "text-blue-300" :
                  zone.irrigationType === 'medium' ? "text-blue-500" : "text-blue-700"
                }`} />
                <span>{zone.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleEditZone(zone.id)}>
                <Edit className="h-4 w-4" />
              </Button>
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
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ZoneList;
