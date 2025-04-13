
import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import InteractiveMap from '@/components/mapping/InteractiveMap';
import MapPlaceholder from './MapPlaceholder';
import MapToolbar from './MapToolbar';
import ZoneList from './ZoneList';
import { Field, Zone, GoogleLatLngLiteral } from './types';
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

interface ZoneData {
  name: string;
  fieldId: string;
  irrigationType: 'low' | 'medium' | 'high';
  boundaries?: GoogleLatLngLiteral[];
  center?: { lat: number; lng: number };
  area?: { squareMeters: number; hectares: number };
}

interface ZonesTabProps {
  hasApiKey: boolean;
  activeMode: 'pan' | 'draw' | 'measure';
  zones: Zone[];
  fields: Field[];
  newZone: ZoneData;
  showAddZoneDialog: boolean;
  onLocationChange: (lat: number, lng: number) => void;
  onModeSelect: (mode: 'pan' | 'draw' | 'measure') => void;
  onGetUserLocation: () => void;
  onSaveMap: () => void;
  setShowAddZoneDialog: (show: boolean) => void;
  setNewZone: (zone: ZoneData) => void;
  handleEditZone: (zoneId: string) => void;
  handleAddZone: () => void;
}

const ZonesTab = forwardRef<any, ZonesTabProps>(({
  hasApiKey,
  activeMode,
  zones,
  fields,
  newZone,
  showAddZoneDialog,
  onLocationChange,
  onModeSelect,
  onGetUserLocation,
  onSaveMap,
  setShowAddZoneDialog,
  setNewZone,
  handleEditZone,
  handleAddZone,
}, ref) => {
  const mapRef = useRef<any>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [drawnZonePath, setDrawnZonePath] = useState<GoogleLatLngLiteral[] | null>(null);
  const [calculatedArea, setCalculatedArea] = useState<{ squareMeters: number; hectares: number } | null>(null);
  const [editingZone, setEditingZone] = useState(false);
  
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

  // Use 'field_unassigned' as a default unassigned value
  const handleFieldSelect = (fieldId: string) => {
    setSelectedFieldId(fieldId || 'field_unassigned');
    
    // When updating newZone, make sure to preserve existing properties
    setNewZone({
      ...newZone,
      fieldId: fieldId || 'field_unassigned'
    });
    
    // Center the map on the selected field
    const selectedField = fields.find(f => f.id === fieldId);
    if (selectedField && selectedField.center && mapRef.current) {
      mapRef.current.showField(selectedField);
      
      toast({
        title: "Field Selected",
        description: "Now you can draw an irrigation zone within this field.",
      });
    }
  };

  const handleViewZone = (zone: Zone) => {
    setActiveZoneId(zone.id);
    
    // Center the map on the zone if boundaries are available
    if (zone.boundaries && mapRef.current) {
      mapRef.current.showZone(zone);
    }
    // Otherwise try to center on the parent field
    else if (zone.fieldId) {
      const parentField = fields.find(f => f.id === zone.fieldId);
      if (parentField && parentField.center && mapRef.current) {
        mapRef.current.showField(parentField);
      }
    }
  };
  
  const handleStartEditZone = (zone: Zone) => {
    setActiveZoneId(zone.id);
    setEditingZone(true);
    setSelectedFieldId(zone.fieldId);
    onModeSelect('draw');
    
    // Show the zone on the map
    if (zone.boundaries && mapRef.current) {
      mapRef.current.showZone(zone);
    }
    
    toast({
      title: "Edit Zone Boundaries",
      description: "Draw the new boundaries for this irrigation zone on the map.",
    });
  };

  const handleZoneDrawn = (path: GoogleLatLngLiteral[], area: { squareMeters: number; hectares: number }) => {
    setDrawnZonePath(path);
    setCalculatedArea(area);
    
    // If editing a zone, update it directly
    if (editingZone && activeZoneId) {
      const zoneToUpdate = zones.find(z => z.id === activeZoneId);
      if (zoneToUpdate) {
        const updatedZones = zones.map(zone => {
          if (zone.id === activeZoneId) {
            return {
              ...zone,
              boundaries: path,
              area: area,
              center: getCenterOfPolygon(path),
              lastModified: new Date().toISOString().split('T')[0]
            };
          }
          return zone;
        });
        
        // Update zones in the parent component
        // This would need to be implemented in the Mapping.tsx
        if (typeof window !== 'undefined') {
          localStorage.setItem('zones', JSON.stringify(updatedZones));
          window.location.reload(); // Simple way to update the state
        }
        
        setEditingZone(false);
        setActiveZoneId(null);
        onModeSelect('pan');
        
        toast({
          title: "Zone Updated",
          description: `Zone boundaries have been updated with area: ${area.hectares.toFixed(2)} hectares`,
        });
        
        return;
      }
    }
    
    // Auto-open the add zone dialog with pre-populated area
    setShowAddZoneDialog(true);
    
    toast({
      title: "Irrigation Zone Drawn",
      description: `Zone area: ${area.squareMeters.toLocaleString()} m² (${area.hectares.toFixed(2)} hectares)`,
    });
  };

  const handleAddZoneWithArea = () => {
    if (!newZone.name || !newZone.fieldId) {
      toast({
        title: "Missing Information",
        description: "Please enter a zone name and select a field.",
        variant: "destructive"
      });
      return;
    }
    
    // If we have drawn a zone path, add that information
    if (drawnZonePath && calculatedArea) {
      // Calculate center point for the zone
      const centerPoint = getCenterOfPolygon(drawnZonePath);
      
      // Enhance the zone data before adding
      setNewZone({
        ...newZone,
        boundaries: drawnZonePath,
        center: centerPoint,
        area: calculatedArea
      });
    }
    
    // Call the parent's add zone handler
    handleAddZone();
    
    // Reset drawing state
    setDrawnZonePath(null);
    setCalculatedArea(null);
  };

  const getCenterOfPolygon = (points: GoogleLatLngLiteral[]): { lat: number; lng: number } => {
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

  useEffect(() => {
    // When mode changes to draw, show instructions
    if (activeMode === 'draw' && !showAddZoneDialog && selectedFieldId) {
      toast({
        title: editingZone ? "Edit Zone Boundaries" : "Draw Irrigation Zone",
        description: "Click on the map to place points and draw your irrigation zone boundaries.",
      });
    }
  }, [activeMode, showAddZoneDialog, selectedFieldId, editingZone]);

  // Fix the type error in this useEffect
  useEffect(() => {
    if (calculatedArea && drawnZonePath) {
      const centerPoint = getCenterOfPolygon(drawnZonePath);
      
      // Create a new ZoneData object directly instead of using a function
      const updatedZone: ZoneData = {
        ...newZone,
        boundaries: drawnZonePath,
        center: centerPoint,
        area: calculatedArea
      };
      
      // Pass the object directly to setNewZone
      setNewZone(updatedZone);
    }
  }, [calculatedArea, drawnZonePath, newZone]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Irrigation Zones</CardTitle>
            {editingZone && activeZoneId && (
              <CardDescription>
                Editing: {zones.find(z => z.id === activeZoneId)?.name}
              </CardDescription>
            )}
            {selectedFieldId && !editingZone && (
              <CardDescription>
                Selected Field: {fields.find(f => f.id === selectedFieldId)?.name || 'None'}
                {calculatedArea && ` | Zone Area: ${calculatedArea.squareMeters.toLocaleString()} m² (${calculatedArea.hectares.toFixed(2)} ha)`}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="fieldSelect">Select a Field to Add Irrigation Zone:</Label>
              <Select value={selectedFieldId} onValueChange={handleFieldSelect}>
                <SelectTrigger id="fieldSelect">
                  <SelectValue placeholder="Select a field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="field_unassigned">All Fields</SelectItem>
                  {fields.map(field => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          
            {hasApiKey ? (
              <InteractiveMap 
                ref={mapRef}
                onLocationChange={onLocationChange} 
                mode={activeMode} 
                fields={fields}
                zones={zones}
                onZoneDrawn={handleZoneDrawn}
                activeFieldId={selectedFieldId || null}
                activeZoneId={activeZoneId}
              />
            ) : (
              <MapPlaceholder>
                <div className="absolute left-4 bottom-4 p-2 bg-white rounded shadow">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded bg-blue-300 mr-2"></div>
                      <span className="text-xs">Low Irrigation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded bg-blue-500 mr-2"></div>
                      <span className="text-xs">Medium Irrigation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded bg-blue-700 mr-2"></div>
                      <span className="text-xs">High Irrigation</span>
                    </div>
                  </div>
                </div>
              </MapPlaceholder>
            )}
            
            <MapToolbar
              activeMode={activeMode}
              onModeSelect={onModeSelect}
              onGetUserLocation={handleGetLocation}
              onSave={calculatedArea ? handleAddZoneWithArea : onSaveMap}
              showImportExport={false}
              drawButtonText="Draw Zone"
              saveButtonText={calculatedArea ? "Save Zone" : "Save Zones"}
            />
          </CardContent>
        </Card>
      </div>
      
      <ZoneList
        zones={zones}
        fields={fields}
        newZone={newZone}
        showAddZoneDialog={showAddZoneDialog}
        setShowAddZoneDialog={setShowAddZoneDialog}
        setNewZone={setNewZone}
        handleEditZone={handleEditZone}
        handleAddZone={handleAddZoneWithArea}
        onViewZone={handleViewZone}
        calculatedArea={calculatedArea}
        handleEditBoundaries={handleStartEditZone}
      />
    </div>
  );
});

ZonesTab.displayName = 'ZonesTab';

export default ZonesTab;
