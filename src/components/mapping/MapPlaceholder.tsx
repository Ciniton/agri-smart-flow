
import React, { useState } from 'react';
import { Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "@/hooks/use-toast";

interface MapPlaceholderProps {
  children?: React.ReactNode;
}

const MapPlaceholder: React.FC<MapPlaceholderProps> = ({ children }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSettingKey, setIsSettingKey] = useState(false);

  const handleSetApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid Google Maps API key",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('googleMapsApiKey', apiKey);
    toast({
      title: "API Key Saved",
      description: "Your Google Maps API key has been saved. The map will now load.",
    });
    
    // Force reload to initialize maps with the new API key
    window.location.reload();
  };

  return (
    <div className="bg-muted rounded-md h-[500px] flex items-center justify-center relative">
      <div className="text-center max-w-md px-4">
        <Map className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Interactive Field Map</h3>
        <p className="text-muted-foreground mb-4">
          {localStorage.getItem('googleMapsApiKey') 
            ? "Loading map... If the map doesn't appear, your API key may be invalid." 
            : "Please set a Google Maps API key to enable mapping features."}
        </p>
        
        {!localStorage.getItem('googleMapsApiKey') && (
          <div>
            {isSettingKey ? (
              <div className="space-y-2">
                <Input 
                  type="text" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Google Maps API key"
                  className="w-full bg-background"
                />
                <div className="flex space-x-2 justify-center">
                  <Button variant="outline" onClick={() => setIsSettingKey(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSetApiKey}>
                    Save API Key
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  You can get an API key from the Google Cloud Platform. 
                  Enable Maps JavaScript API for full functionality.
                </p>
              </div>
            ) : (
              <Button onClick={() => setIsSettingKey(true)}>
                Set API Key
              </Button>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default MapPlaceholder;
