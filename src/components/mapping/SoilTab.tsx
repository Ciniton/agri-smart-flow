
import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import InteractiveMap from '@/components/mapping/InteractiveMap';
import MapPlaceholder from './MapPlaceholder';
import MapToolbar from './MapToolbar';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";
import { Field, SoilZone, GoogleLatLngLiteral } from './types';
import SoilZoneList from './SoilZoneList';
import AddSoilZoneDialog from './AddSoilZoneDialog';
import { useSoilLayers } from './hooks/useSoilLayers';

interface SoilTabProps {
  hasApiKey: boolean;
  activeMode: 'pan' | 'draw' | 'measure';
  onLocationChange: (lat: number, lng: number) => void;
  onModeSelect: (mode: 'pan' | 'draw' | 'measure') => void;
  onGetUserLocation: () => void;
  onSaveMap: () => void;
  fields: Field[];
}

const SoilTab = forwardRef<any, SoilTabProps>(({
  hasApiKey,
  activeMode,
  onLocationChange,
  onModeSelect,
  onGetUserLocation,
  onSaveMap,
  fields
}, ref) => {
  const mapRef = useRef<any>(null);
  const [soilZones, setSoilZones] = useState<SoilZone[]>(() => {
    const savedZones = localStorage.getItem('soilZones');
    return savedZones ? JSON.parse(savedZones) : [];
  });
  const [activeSoilZoneId, setActiveSoilZoneId] = useState<string | null>(null);
  const [showAddSoilZoneDialog, setShowAddSoilZoneDialog] = useState(false);
  const [newSoilZone, setNewSoilZone] = useState<{
    name: string;
    fieldId: string;
    soilType: string;
    color?: string;
  }>({
    name: '',
    fieldId: '',
    soilType: 'loamy',
    color: '#FEF7CD' // Default color for loamy soil
  });
  const [calculatedArea, setCalculatedArea] = useState<{
    squareMeters: number;
    hectares: number;
  } | null>(null);
  const [drawnZonePath, setDrawnZonePath] = useState<GoogleLatLngLiteral[] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingZone, setEditingZone] = useState<SoilZone | null>(null);

  // Import custom soil layer hook
  const { renderSoilZonesLayer, showSoilZone } = useSoilLayers();

  // Save soil zones to localStorage when they change
  useEffect(() => {
    localStorage.setItem('soilZones', JSON.stringify(soilZones));
  }, [soilZones]);

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

  const handleSoilZoneDrawn = (path: GoogleLatLngLiteral[], area: {
    squareMeters: number;
    hectares: number;
  }) => {
    setCalculatedArea(area);
    setDrawnZonePath(path);

    if (isEditing && editingZone) {
      // Update the existing zone
      const updatedZones = soilZones.map(zone => {
        if (zone.id === editingZone.id) {
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
      
      setSoilZones(updatedZones);
      setIsEditing(false);
      setEditingZone(null);
      setActiveSoilZoneId(null);
      onModeSelect('pan');
      
      toast({
        title: "Soil Zone Updated",
        description: `Zone boundaries have been updated with area: ${area.hectares.toFixed(2)} hectares`,
      });
      
      return;
    }

    // For new zones, show the dialog to name the zone
    setShowAddSoilZoneDialog(true);
    
    toast({
      title: "Soil Zone Drawn",
      description: `Zone area: ${area.squareMeters.toLocaleString()} m² (${area.hectares.toFixed(2)} hectares)`,
    });
  };

  const getCenterOfPolygon = (points: GoogleLatLngLiteral[]): GoogleLatLngLiteral => {
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

  const handleAddSoilZone = () => {
    if (!newSoilZone.name || !newSoilZone.fieldId || !newSoilZone.soilType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!drawnZonePath && !calculatedArea) {
      // If no zone was drawn but user wants to add a zone, switch to draw mode
      onModeSelect('draw');
      setShowAddSoilZoneDialog(false);
      
      toast({
        title: "Draw Soil Zone",
        description: "Please draw the soil zone boundaries on the map.",
      });
      return;
    }

    // Create a new soil zone with the drawn path and calculated area
    const centerPoint = drawnZonePath 
      ? getCenterOfPolygon(drawnZonePath)
      : undefined;

    const newZone: SoilZone = {
      id: `sz-${Date.now()}`,
      name: newSoilZone.name,
      fieldId: newSoilZone.fieldId,
      soilType: newSoilZone.soilType,
      color: newSoilZone.color,
      boundaries: drawnZonePath || undefined,
      center: centerPoint,
      area: calculatedArea || undefined,
      lastModified: new Date().toISOString().split('T')[0]
    };

    setSoilZones(prev => [...prev, newZone]);
    
    // Reset states
    setCalculatedArea(null);
    setDrawnZonePath(null);
    setNewSoilZone({
      name: '',
      fieldId: '',
      soilType: 'loamy',
      color: '#FEF7CD'
    });
    setShowAddSoilZoneDialog(false);
    
    toast({
      title: "Soil Zone Saved",
      description: `Soil zone "${newZone.name}" has been saved.`,
    });

    // Reset the drawing mode
    onModeSelect('pan');
  };

  const handleAddSoilZoneClick = () => {
    // First check if there are any fields
    if (fields.length === 0) {
      toast({
        title: "No Fields Available",
        description: "Please create at least one field before adding soil zones.",
        variant: "destructive"
      });
      return;
    }
    
    // Reset form fields
    setNewSoilZone({
      name: '',
      fieldId: fields[0].id, // Default to first field
      soilType: 'loamy',
      color: '#FEF7CD'
    });
    
    setCalculatedArea(null);
    setDrawnZonePath(null);
    setIsEditing(false);
    setEditingZone(null);
    
    setShowAddSoilZoneDialog(true);
  };

  const handleEditSoilZone = (zone: SoilZone) => {
    setActiveSoilZoneId(zone.id);
    setIsEditing(true);
    setEditingZone(zone);
    
    // Populate the form with existing data
    setNewSoilZone({
      name: zone.name,
      fieldId: zone.fieldId,
      soilType: zone.soilType,
      color: zone.color
    });
    
    if (zone.boundaries) {
      setDrawnZonePath(zone.boundaries);
    }
    
    if (zone.area) {
      setCalculatedArea(zone.area);
    }
    
    // Switch to draw mode to edit boundaries
    onModeSelect('draw');
    
    toast({
      title: "Edit Soil Zone",
      description: "Edit the soil zone boundaries on the map.",
    });
  };

  const handleDeleteSoilZone = (zoneId: string) => {
    setSoilZones(prev => prev.filter(zone => zone.id !== zoneId));
    
    if (activeSoilZoneId === zoneId) {
      setActiveSoilZoneId(null);
    }
    
    toast({
      title: "Soil Zone Deleted",
      description: "The soil zone has been removed.",
    });
  };

  const handleViewSoilZone = (zone: SoilZone) => {
    setActiveSoilZoneId(zone.id);
    
    // Center the map on the zone if boundaries are available
    if (zone.boundaries && mapRef.current) {
      showSoilZone(window.google, mapRef.current, zone);
    }
  };

  useEffect(() => {
    if (activeMode === 'draw' && !showAddSoilZoneDialog) {
      toast({
        title: isEditing ? "Edit Soil Zone" : "Draw Soil Zone",
        description: "Click on the map to place points and draw the soil zone boundaries.",
      });
    }
  }, [activeMode, showAddSoilZoneDialog, isEditing]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Soil Mapping</CardTitle>
            {isEditing && editingZone ? (
              <CardDescription>
                Editing: {editingZone.name}
              </CardDescription>
            ) : (
              <CardDescription>
                Map different soil types across your fields for precision agriculture
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
                onFieldDrawn={handleSoilZoneDrawn}
              />
            ) : (
              <MapPlaceholder />
            )}
            
            <MapToolbar
              activeMode={activeMode}
              onModeSelect={onModeSelect}
              onGetUserLocation={handleGetLocation}
              onSave={onSaveMap}
            />
          </CardContent>
        </Card>
      </div>
      
      <SoilZoneList
        soilZones={soilZones}
        fields={fields}
        activeSoilZoneId={activeSoilZoneId}
        setActiveSoilZoneId={setActiveSoilZoneId}
        onAddSoilZone={handleAddSoilZoneClick}
        onEditSoilZone={handleEditSoilZone}
        onDeleteSoilZone={handleDeleteSoilZone}
        onViewSoilZone={handleViewSoilZone}
      />

      <AddSoilZoneDialog
        open={showAddSoilZoneDialog}
        onOpenChange={setShowAddSoilZoneDialog}
        fields={fields}
        soilZone={newSoilZone}
        onSoilZoneChange={setNewSoilZone}
        onAddSoilZone={handleAddSoilZone}
        calculatedArea={calculatedArea || undefined}
      />
    </div>
  );
});

SoilTab.displayName = 'SoilTab';

export default SoilTab;
