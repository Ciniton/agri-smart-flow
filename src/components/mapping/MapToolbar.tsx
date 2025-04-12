
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MoveHorizontal, PenTool, Ruler, Navigation, Save, FileUp, Download } from 'lucide-react';

interface MapToolbarProps {
  activeMode: 'pan' | 'draw' | 'measure';
  onModeSelect: (mode: 'pan' | 'draw' | 'measure') => void;
  onGetUserLocation: () => void;
  onSave: () => void;
  onImport?: () => void;
  onExport?: () => void;
  showImportExport?: boolean;
  drawButtonText?: string;
  saveButtonText?: string;
  locationPulsing?: boolean;
}

const MapToolbar: React.FC<MapToolbarProps> = ({
  activeMode,
  onModeSelect,
  onGetUserLocation,
  onSave,
  onImport,
  onExport,
  showImportExport = true,
  drawButtonText = "Draw",
  saveButtonText = "Save",
  locationPulsing = false
}) => {
  return (
    <div className="flex justify-between mt-4 w-full flex-wrap gap-2">
      <div className="flex space-x-2 flex-wrap gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeMode === 'pan' ? "default" : "outline"} 
                onClick={() => onModeSelect('pan')}
                className="shadow-sm hover:shadow transition-all"
              >
                <MoveHorizontal className="mr-2 h-4 w-4" />
                Pan
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Navigate around the map</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeMode === 'draw' ? "default" : "outline"}
                onClick={() => onModeSelect('draw')}
                className="shadow-sm hover:shadow transition-all"
              >
                <PenTool className="mr-2 h-4 w-4" />
                {drawButtonText}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Draw areas on the map</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeMode === 'measure' ? "default" : "outline"}
                onClick={() => onModeSelect('measure')}
                className="shadow-sm hover:shadow transition-all"
              >
                <Ruler className="mr-2 h-4 w-4" />
                Measure
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Measure distances on the map</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={onGetUserLocation}
                className="shadow-sm hover:shadow transition-all relative"
              >
                <Navigation className="mr-2 h-4 w-4" />
                Locate
                {locationPulsing && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Find your current location</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex space-x-2">
        {showImportExport && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={onImport}
                  className="shadow-sm hover:shadow transition-all"
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import GeoJSON or KML files</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={onExport}
                  className="shadow-sm hover:shadow transition-all"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export map data as GeoJSON</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onSave}
                className="shadow-sm hover:shadow-md transition-all"
              >
                <Save className="mr-2 h-4 w-4" />
                {saveButtonText}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save your changes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default MapToolbar;
