
import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import InteractiveMap from '@/components/mapping/InteractiveMap';
import MapPlaceholder from './MapPlaceholder';
import MapToolbar from './MapToolbar';
import SoilLegend from './SoilLegend';
import { toast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface SoilZone {
  id: string;
  name: string;
  boundaries: { lat: number; lng: number }[];
  soilType: 'sandy' | 'clay' | 'loam' | 'rocky' | 'silty';
  color: string;
  area?: { squareMeters: number; hectares: number };
  center?: { lat: number; lng: number };
}

interface SoilTabProps {
  hasApiKey: boolean;
  activeMode: 'pan' | 'draw' | 'measure';
  onLocationChange: (lat: number, lng: number) => void;
  onModeSelect: (mode: 'pan' | 'draw' | 'measure') => void;
  onGetUserLocation: () => void;
  onSaveMap: () => void;
}

const SoilTab = forwardRef<any, SoilTabProps>(({
  hasApiKey,
  activeMode,
  onLocationChange,
  onModeSelect,
  onGetUserLocation,
  onSaveMap,
}, ref) => {
  const mapRef = useRef<any>(null);
  const [soilZones, setSoilZones] = useState<SoilZone[]>(() => {
    const savedZones = localStorage.getItem('soilZones');
    return savedZones ? JSON.parse(savedZones) : [];
  });
  const [showAddZoneDialog, setShowAddZoneDialog] = useState(false);
  const [drawnZonePath, setDrawnZonePath] = useState<{ lat: number; lng: number }[] | null>(null);
  const [calculatedArea, setCalculatedArea] = useState<{ squareMeters: number; hectares: number } | null>(null);
  const [newZone, setNewZone] = useState<{name: string, soilType: 'sandy' | 'clay' | 'loam' | 'rocky' | 'silty'}>({
    name: '',
    soilType: 'loam'
  });
  
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

  const handleZoneDrawn = (path: { lat: number; lng: number }[], area: { squareMeters: number; hectares: number }) => {
    setDrawnZonePath(path);
    setCalculatedArea(area);
    setShowAddZoneDialog(true);
    
    toast({
      title: "Soil Zone Drawn",
      description: `Zone area: ${area.squareMeters.toLocaleString()} m² (${area.hectares.toFixed(2)} hectares)`,
    });
  };

  const getSoilTypeColor = (soilType: string): string => {
    switch (soilType) {
      case 'sandy':
        return '#fcd34d'; // amber-300
      case 'clay':
        return '#92400e'; // amber-800
      case 'loam':
        return '#15803d'; // green-700
      case 'rocky':
        return '#6b7280'; // gray-500
      case 'silty':
        return '#93c5fd'; // blue-300
      default:
        return '#15803d'; // green-700
    }
  };

  const handleAddSoilZone = () => {
    if (!newZone.name) {
      toast({
        title: "Name Required",
        description: "Please enter a name for this soil zone.",
        variant: "destructive"
      });
      return;
    }

    if (!drawnZonePath) {
      toast({
        title: "No Zone Drawn",
        description: "Please draw a zone on the map first.",
        variant: "destructive"
      });
      return;
    }

    // Calculate center point for the zone
    const centerPoint = getCenterOfPolygon(drawnZonePath);
    
    const soilZone: SoilZone = {
      id: `soil-${Date.now()}`,
      name: newZone.name,
      boundaries: drawnZonePath,
      soilType: newZone.soilType,
      color: getSoilTypeColor(newZone.soilType),
      area: calculatedArea || undefined,
      center: centerPoint
    };

    const updatedZones = [...soilZones, soilZone];
    setSoilZones(updatedZones);
    localStorage.setItem('soilZones', JSON.stringify(updatedZones));
    
    // Reset state
    setNewZone({ name: '', soilType: 'loam' });
    setDrawnZonePath(null);
    setCalculatedArea(null);
    setShowAddZoneDialog(false);
    
    toast({
      title: "Soil Zone Added",
      description: `${newZone.soilType.charAt(0).toUpperCase() + newZone.soilType.slice(1)} soil zone "${newZone.name}" has been added to the map.`,
    });
    
    // Reset to pan mode
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Soil Type Mapping</CardTitle>
            {calculatedArea && (
              <CardDescription>
                Drawn Area: {calculatedArea.squareMeters.toLocaleString()} m² ({calculatedArea.hectares.toFixed(2)} ha)
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {hasApiKey ? (
              <InteractiveMap 
                ref={mapRef}
                onLocationChange={onLocationChange} 
                mode={activeMode} 
                onFieldDrawn={handleZoneDrawn}
              />
            ) : (
              <MapPlaceholder />
            )}
            
            <MapToolbar
              activeMode={activeMode}
              onModeSelect={onModeSelect}
              onGetUserLocation={handleGetLocation}
              onSave={onSaveMap}
              showImportExport={false}
              drawButtonText="Draw Soil Zone"
            />

            <div className="mt-4 border rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Soil Zones</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onModeSelect('draw')}
                  className="flex items-center h-8"
                >
                  <Palette className="h-4 w-4 mr-1" /> Add Soil Zone
                </Button>
              </div>
              
              {soilZones.length === 0 ? (
                <p className="text-sm text-muted-foreground">No soil zones defined yet. Use the draw tool to create zones.</p>
              ) : (
                <div className="grid gap-2 max-h-[200px] overflow-y-auto">
                  {soilZones.map(zone => (
                    <div key={zone.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded mr-2" 
                          style={{ backgroundColor: zone.color }}
                        ></div>
                        <span className="text-sm font-medium">{zone.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {zone.soilType.charAt(0).toUpperCase() + zone.soilType.slice(1)} soil
                        {zone.area && ` · ${zone.area.hectares.toFixed(2)} ha`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <SoilLegend />

      <Dialog open={showAddZoneDialog} onOpenChange={setShowAddZoneDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Soil Zone</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="zoneName">Zone Name</Label>
              <Input
                id="zoneName"
                value={newZone.name}
                onChange={(e) => setNewZone({...newZone, name: e.target.value})}
                placeholder="Enter zone name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="soilType">Soil Type</Label>
              <Select 
                value={newZone.soilType} 
                onValueChange={(value: 'sandy' | 'clay' | 'loam' | 'rocky' | 'silty') => setNewZone({...newZone, soilType: value})}
              >
                <SelectTrigger id="soilType">
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandy">Sandy Soil</SelectItem>
                  <SelectItem value="clay">Clay Soil</SelectItem>
                  <SelectItem value="loam">Loam Soil</SelectItem>
                  <SelectItem value="rocky">Rocky Soil</SelectItem>
                  <SelectItem value="silty">Silty Soil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {calculatedArea && (
              <div className="text-sm">
                <p>Area: {calculatedArea.hectares.toFixed(2)} hectares</p>
                <p>({calculatedArea.squareMeters.toLocaleString()} m²)</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              onClick={handleAddSoilZone} 
              disabled={!newZone.name || !drawnZonePath}
            >
              Add Soil Zone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

SoilTab.displayName = 'SoilTab';

export default SoilTab;
