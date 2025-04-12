
import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import InteractiveMap from '@/components/mapping/InteractiveMap';
import MapPlaceholder from './MapPlaceholder';
import MapToolbar from './MapToolbar';
import FieldList from './FieldList';
import { Field } from './types';
import { toast } from "@/hooks/use-toast";

interface FieldsTabProps {
  location: { lat: number, lng: number } | null;
  hasApiKey: boolean;
  activeMode: 'pan' | 'draw' | 'measure';
  fields: Field[];
  newField: { name: string; area: string };
  showAddFieldDialog: boolean;
  onLocationChange: (lat: number, lng: number) => void;
  onModeSelect: (mode: 'pan' | 'draw' | 'measure') => void;
  onGetUserLocation: () => void;
  onSaveMap: () => void;
  onImportMap: () => void;
  onExportMap: () => void;
  setShowAddFieldDialog: (show: boolean) => void;
  setNewField: (field: { name: string; area: string }) => void;
  handleEditField: (fieldId: string) => void;
  handleAddField: () => void;
}

const FieldsTab = forwardRef<any, FieldsTabProps>(({
  location,
  hasApiKey,
  activeMode,
  fields,
  newField,
  showAddFieldDialog,
  onLocationChange,
  onModeSelect,
  onGetUserLocation,
  onSaveMap,
  onImportMap,
  onExportMap,
  setShowAddFieldDialog,
  setNewField,
  handleEditField,
  handleAddField,
}, ref) => {
  const mapRef = useRef<any>(null);
  
  useImperativeHandle(ref, () => ({
    getUserLocation: () => {
      if (mapRef.current && mapRef.current.getUserLocation) {
        mapRef.current.getUserLocation();
      } else {
        toast({
          title: "Map Not Ready",
          description: "The map is still loading. Please try again in a moment.",
          variant: "destructive",
        });
      }
    }
  }));

  const handleGetLocation = () => {
    if (mapRef.current && typeof mapRef.current.getUserLocation === 'function') {
      mapRef.current.getUserLocation();
    } else {
      toast({
        title: "Map Not Ready",
        description: "The map is still loading. Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Field Overview</CardTitle>
            {location && (
              <CardDescription>
                Current Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {hasApiKey ? (
              <InteractiveMap 
                ref={mapRef}
                onLocationChange={onLocationChange} 
                mode={activeMode} 
              />
            ) : (
              <MapPlaceholder />
            )}
            
            <MapToolbar
              activeMode={activeMode}
              onModeSelect={onModeSelect}
              onGetUserLocation={handleGetLocation}
              onSave={onSaveMap}
              onImport={onImportMap}
              onExport={onExportMap}
            />
          </CardContent>
        </Card>
      </div>
      
      <FieldList
        fields={fields}
        newField={newField}
        showAddFieldDialog={showAddFieldDialog}
        setShowAddFieldDialog={setShowAddFieldDialog}
        setNewField={setNewField}
        handleEditField={handleEditField}
        handleAddField={handleAddField}
      />
    </div>
  );
});

FieldsTab.displayName = 'FieldsTab';

export default FieldsTab;
