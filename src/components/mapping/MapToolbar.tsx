
import React from 'react';
import { MoveHorizontal, PenTool, Ruler, Navigation, Save, FileUp, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapToolbarProps {
  activeMode: 'pan' | 'draw' | 'measure';
  onModeSelect: (mode: 'pan' | 'draw' | 'measure') => void;
  onGetUserLocation: () => void;
  onSave: () => void;
  onImport?: () => void;
  onExport?: () => void;
  showImportExport?: boolean;
  drawButtonText?: string;
}

const MapToolbar: React.FC<MapToolbarProps> = ({
  activeMode,
  onModeSelect,
  onGetUserLocation,
  onSave,
  onImport,
  onExport,
  showImportExport = true,
  drawButtonText = 'Draw',
}) => {
  return (
    <div className="flex justify-between mt-4">
      <div className="flex space-x-2">
        <Button 
          variant={activeMode === 'pan' ? "default" : "outline"} 
          onClick={() => onModeSelect('pan')}
        >
          <MoveHorizontal className="mr-2 h-4 w-4" />
          Pan
        </Button>
        <Button 
          variant={activeMode === 'draw' ? "default" : "outline"}
          onClick={() => onModeSelect('draw')}
        >
          <PenTool className="mr-2 h-4 w-4" />
          {drawButtonText}
        </Button>
        {activeMode === 'measure' !== undefined && (
          <Button 
            variant={activeMode === 'measure' ? "default" : "outline"}
            onClick={() => onModeSelect('measure')}
          >
            <Ruler className="mr-2 h-4 w-4" />
            Measure
          </Button>
        )}
        <Button variant="outline" onClick={onGetUserLocation}>
          <Navigation className="mr-2 h-4 w-4" />
          Locate
        </Button>
      </div>
      <div className="flex space-x-2">
        {showImportExport && onImport && (
          <Button variant="outline" onClick={onImport}>
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
        )}
        {showImportExport && onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
        <Button onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default MapToolbar;
