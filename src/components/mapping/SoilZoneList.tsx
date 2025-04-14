
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Field, SoilZone } from './types';
import SoilLegend from './SoilLegend';
import { Edit, MapPin, Trash2, ExternalLink } from 'lucide-react';

interface SoilZoneListProps {
  soilZones: SoilZone[];
  fields: Field[];
  activeSoilZoneId?: string;
  setActiveSoilZoneId: (id: string) => void;
  onAddSoilZone: () => void;
  onEditSoilZone: (zone: SoilZone) => void;
  onDeleteSoilZone: (zoneId: string) => void;
  onViewSoilZone: (zone: SoilZone) => void;
}

const SoilZoneList: React.FC<SoilZoneListProps> = ({ 
  soilZones, 
  fields, 
  activeSoilZoneId, 
  setActiveSoilZoneId,
  onAddSoilZone, 
  onEditSoilZone, 
  onDeleteSoilZone,
  onViewSoilZone
}) => {
  // Function to get field name by ID
  const getFieldName = (fieldId: string): string => {
    const field = fields.find(f => f.id === fieldId);
    return field ? field.name : 'Unassigned';
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">Soil Zones</CardTitle>
        <Button onClick={onAddSoilZone} size="sm">Add Zone</Button>
      </CardHeader>

      <CardContent>
        <SoilLegend />
        
        <ScrollArea className="h-[480px] pr-4">
          {soilZones.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No soil zones defined yet.</p>
              <p className="text-sm mt-2">Add zones to map different soil types.</p>
              <Button onClick={onAddSoilZone} variant="outline" className="mt-4">
                Add First Zone
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {soilZones.map(zone => (
                <div 
                  key={zone.id}
                  className={`p-3 rounded-md border ${activeSoilZoneId === zone.id ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{zone.name}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Field:</span> {getFieldName(zone.fieldId)}
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="font-medium mr-1">Soil type:</span> {zone.soilType}
                        </div>
                        {zone.area && (
                          <div className="flex items-center mt-1">
                            <span className="font-medium mr-1">Area:</span> 
                            {zone.area.hectares.toFixed(2)} hectares
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      backgroundColor: zone.color || '#A1CCA5',
                      borderRadius: '4px',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }} />
                  </div>
                  
                  <div className="flex justify-between mt-3 pt-2 border-t border-border">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-muted-foreground"
                      onClick={() => onDeleteSoilZone(zone.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      <span className="sr-only sm:not-sr-only sm:text-xs">Delete</span>
                    </Button>
                    
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => onEditSoilZone(zone)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        <span className="sr-only sm:not-sr-only sm:text-xs">Edit</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => onViewSoilZone(zone)}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="sr-only sm:not-sr-only sm:text-xs">View</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SoilZoneList;
