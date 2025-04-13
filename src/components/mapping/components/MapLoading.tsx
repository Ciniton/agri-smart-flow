
import React from 'react';
import { Button } from '@/components/ui/button';

interface MapLoadingProps {
  isLoading: boolean;
  loadingProgress: number;
  error: string | null;
  onRetry: () => void;
}

const MapLoading: React.FC<MapLoadingProps> = ({ 
  isLoading, 
  loadingProgress, 
  error, 
  onRetry 
}) => {
  if (!isLoading && !error) return null;
  
  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-50">
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-medium">Loading Google Maps...</h3>
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-in-out" 
                style={{ width: `${loadingProgress}%` }} 
              />
            </div>
            <p className="text-sm text-muted-foreground">{loadingProgress}%</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-50 p-4">
          <div className="max-w-md space-y-4 text-center">
            <h3 className="text-lg font-medium text-destructive">Error Loading Map</h3>
            <p className="text-sm">{error}</p>
            <Button onClick={onRetry} variant="outline">Try Again</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MapLoading;
