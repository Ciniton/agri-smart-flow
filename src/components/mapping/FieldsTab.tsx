
import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import InteractiveMap from '@/components/mapping/InteractiveMap';
import MapPlaceholder from './MapPlaceholder';
import MapToolbar from './MapToolbar';
import FieldList from './FieldList';
import { Field } from './types';
import { toast } from "@/hooks/use-toast";
import AddFieldDialog from './AddFieldDialog';

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
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
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
  setFields
}, ref) => {
  const mapRef = useRef<any>(null);
  const [calculatedArea, setCalculatedArea] = useState<{ squareMeters: number; hectares: number } | null>(null);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [drawnFieldPath, setDrawnFieldPath] = useState<{ lat: number; lng: number }[] | null>(null);
  
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

  const handleFieldDrawn = (path: { lat: number; lng: number }[], area: { squareMeters: number; hectares: number }) => {
    setCalculatedArea(area);
    setDrawnFieldPath(path);

    // Open the dialog to name the field
    setShowAddFieldDialog(true);
    
    toast({
      title: "Field Drawn",
      description: `Field area: ${area.squareMeters.toLocaleString()} m² (${area.hectares.toFixed(2)} hectares)`,
    });
  };

  const handleAddFieldComplete = () => {
    if (!newField.name.trim()) {
      toast({
        title: "Field Name Required",
        description: "Please enter a name for your field.",
        variant: "destructive"
      });
      return;
    }

    if (!drawnFieldPath && !calculatedArea) {
      // If no field was drawn but user is trying to add a field manually
      handleAddField();
      return;
    }

    // Create a new field with the drawn path and calculated area
    const centerPoint = drawnFieldPath && drawnFieldPath.length > 0 
      ? getCenterOfPolygon(drawnFieldPath)
      : location;

    const newFieldEntry: Field = {
      id: `f${Date.now()}`,
      name: newField.name,
      boundaries: drawnFieldPath || undefined,
      center: centerPoint || undefined,
      area: calculatedArea || undefined,
      lastModified: new Date().toISOString().split('T')[0]
    };

    setFields(prev => [...prev, newFieldEntry]);
    
    // Reset state
    setCalculatedArea(null);
    setDrawnFieldPath(null);
    setNewField({ name: '', area: '' });
    setShowAddFieldDialog(false);
    
    toast({
      title: "Field Saved",
      description: `Field "${newFieldEntry.name}" has been saved.`,
    });

    // Reset the drawing mode
    onModeSelect('pan');
  };

  const getCenterOfPolygon = (points: { lat: number; lng: number }[]): { lat: number; lng: number } => {
    if (!points || points.length === 0) {
      return { lat: 0, lng: 0 };
    }
    
    const latSum = points.reduce((sum, point) => sum + point.lat, 0);
    const lngSum = points.reduce((sum, point) => sum + point.lng, 0);
    
    return {
      lat: latSum / points.length,
      lng: lngSum / points.length
    };
  };

  const handleViewField = (field: Field) => {
    setActiveFieldId(field.id);
    
    // Center the map on the field if center coordinates are available
    if (field.center && mapRef.current) {
      mapRef.current.centerOnLocation(field.center, 16);
      
      // Show the field boundaries if available
      if (field.boundaries) {
        mapRef.current.showField(field);
      }
    }
  };

  useEffect(() => {
    // When mode changes to draw, show instructions
    if (activeMode === 'draw' && !showAddFieldDialog) {
      toast({
        title: "Draw Field Mode",
        description: "Click on the map to place points and draw your field boundaries.",
      });
    }
  }, [activeMode, showAddFieldDialog]);

  // Add a custom handler for the add field dialog
  const customHandleAddField = () => {
    if (calculatedArea) {
      handleAddFieldComplete();
    } else {
      // Switch to draw mode if no area has been calculated yet
      onModeSelect('draw');
      
      // Keep the dialog open but show instructions
      toast({
        title: "Draw Your Field",
        description: "Please draw your field on the map to calculate its area.",
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
                fields={fields}
                onFieldDrawn={handleFieldDrawn}
                activeFieldId={activeFieldId}
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
        handleAddField={customHandleAddField}
        handleViewField={handleViewField}
        activeFieldId={activeFieldId || undefined}
      />

      {/* Replace the AddFieldDialog in FieldList with this one to show calculated area */}
      <AddFieldDialog
        open={showAddFieldDialog}
        onOpenChange={setShowAddFieldDialog}
        fieldName={newField.name}
        fieldArea={newField.area}
        onFieldNameChange={(name) => setNewField({...newField, name})}
        onFieldAreaChange={(area) => setNewField({...newField, area})}
        onAddField={customHandleAddField}
        calculatedArea={calculatedArea || undefined}
      />
    </div>
  );
});

FieldsTab.displayName = 'FieldsTab';

export default FieldsTab;
