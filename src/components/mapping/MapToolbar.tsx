
import React from 'react';
import { Button } from '@/components/ui/button';
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
  saveButtonText = "Save"
}) => {
  return (
    <div className="flex justify-between mt-4 w-full flex-wrap gap-2">
      <div className="flex space-x-2 flex-wrap gap-2">
        <Button 
          variant={activeMode === 'pan' ? "default" : "outline"} 
          onClick={() => onModeSelect('pan')}
          className="shadow-sm hover:shadow transition-all"
        >
          <MoveHorizontal className="mr-2 h-4 w-4" />
          Pan
        </Button>
        <Button 
          variant={activeMode === 'draw' ? "default" : "outline"}
          onClick={() => onModeSelect('draw')}
          className="shadow-sm hover:shadow transition-all"
        >
          <PenTool className="mr-2 h-4 w-4" />
          {drawButtonText}
        </Button>
        <Button 
          variant={activeMode === 'measure' ? "default" : "outline"}
          onClick={() => onModeSelect('measure')}
          className="shadow-sm hover:shadow transition-all"
        >
          <Ruler className="mr-2 h-4 w-4" />
          Measure
        </Button>
        <Button 
          variant="outline" 
          onClick={onGetUserLocation}
          className="shadow-sm hover:shadow transition-all"
        >
          <Navigation className="mr-2 h-4 w-4" />
          Locate
        </Button>
      </div>
      
      <div className="flex space-x-2">
        {showImportExport && (
          <>
            <Button 
              variant="outline" 
              onClick={onImport}
              className="shadow-sm hover:shadow transition-all"
            >
              <FileUp className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button 
              variant="outline" 
              onClick={onExport}
              className="shadow-sm hover:shadow transition-all"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </>
        )}
        <Button 
          onClick={onSave}
          className="shadow-sm hover:shadow-md transition-all"
        >
          <Save className="mr-2 h-4 w-4" />
          {saveButtonText}
        </Button>
      </div>
    </div>
  );
};

export default MapToolbar;
