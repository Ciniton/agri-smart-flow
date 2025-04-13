
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ZoomIn, ZoomOut, Navigation, Pencil, Ruler, Layers } from 'lucide-react';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className="absolute right-4 top-4 flex flex-col space-y-1 z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="secondary"
              onClick={onZoomIn}
              className="rounded-full bg-white/90 hover:bg-white shadow-md"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon" 
              variant="secondary"
              onClick={onZoomOut}
              className="rounded-full bg-white/90 hover:bg-white shadow-md"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom Out</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

interface DrawingControlsProps {
  activeTool: 'pan' | 'draw' | 'measure';
  onSelectMode: (mode: 'pan' | 'draw' | 'measure') => void;
}

export const DrawingControls: React.FC<DrawingControlsProps> = ({ activeTool, onSelectMode }) => {
  return (
    <div className="absolute left-4 top-4 flex flex-col space-y-1 z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon"
              variant={activeTool === 'pan' ? "default" : "secondary"}
              onClick={() => onSelectMode('pan')}
              className="rounded-full bg-white/90 hover:bg-white shadow-md"
            >
              <Navigation className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Pan</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon"
              variant={activeTool === 'draw' ? "default" : "secondary"}
              onClick={() => onSelectMode('draw')}
              className="rounded-full bg-white/90 hover:bg-white shadow-md"
            >
              <Pencil className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Draw</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon"
              variant={activeTool === 'measure' ? "default" : "secondary"}
              onClick={() => onSelectMode('measure')}
              className="rounded-full bg-white/90 hover:bg-white shadow-md"
            >
              <Ruler className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Measure</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

interface LayerControlsProps {
  onToggleFields: () => void;
  onToggleZones: () => void;
}

export const LayerControls: React.FC<LayerControlsProps> = ({ onToggleFields, onToggleZones }) => {
  return (
    <div className="absolute left-4 bottom-4 flex flex-col space-y-1 z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon"
              variant="secondary"
              onClick={onToggleFields}
              className="rounded-full bg-white/90 hover:bg-white shadow-md"
            >
              <Layers className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Fields</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon"
              variant="secondary"
              onClick={onToggleZones}
              className="rounded-full bg-white/90 hover:bg-white shadow-md text-blue-500"
            >
              <Layers className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Zones</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
