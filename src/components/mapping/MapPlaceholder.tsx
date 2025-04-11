
import React from 'react';
import { Map } from 'lucide-react';

interface MapPlaceholderProps {
  children?: React.ReactNode;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ children }) => (
  <div className="bg-muted rounded-md h-[500px] flex items-center justify-center relative">
    <div className="text-center">
      <Map className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Interactive Field Map</h3>
      <p className="text-muted-foreground">
        {localStorage.getItem('googleMapsApiKey') 
          ? "Loading map..." 
          : "Please set a Google Maps API key in Admin settings to enable mapping features."}
      </p>
    </div>
    {children}
  </div>
);

export default MapPlaceholder;
