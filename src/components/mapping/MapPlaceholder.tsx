
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSetApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid Google Maps API key",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Check if the key format is valid (basic validation)
    if (!apiKey.startsWith('AIza')) {
      toast({
        title: "Invalid API Key Format",
        description: "Google Maps API keys typically start with 'AIza'. Please check your key.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem('googleMapsApiKey', apiKey);
    toast({
      title: "API Key Saved",
      description: "Your Google Maps API key has been saved. The map will now load.",
    });
    
    // Wait briefly to let the toast show before reload
    setTimeout(() => {
      // Force reload to initialize maps with the new API key
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="bg-muted rounded-md h-[500px] flex items-center justify-center relative">
      <div className="text-center max-w-md px-6 py-8 bg-card rounded-lg shadow-sm">
        <Map className="h-16 w-16 mx-auto text-primary mb-4" />
        <h3 className="text-xl font-medium mb-3">Interactive Field Map</h3>
        <p className="text-muted-foreground mb-6">
          {localStorage.getItem('googleMapsApiKey') 
            ? "Loading map... If the map doesn't appear, your API key may be invalid." 
            : "Please set a Google Maps API key to enable mapping features."}
        </p>
        
        {!localStorage.getItem('googleMapsApiKey') && (
          <div>
            {isSettingKey ? (
              <div className="space-y-3">
                <Input 
                  type="text" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Google Maps API key"
                  className="w-full bg-background"
                />
                <div className="flex space-x-3 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSettingKey(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSetApiKey}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save API Key'}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded">
                  <p className="font-medium mb-1">How to get a Google Maps API Key:</p>
                  <ol className="list-decimal list-inside text-left space-y-1">
                    <li>Go to the Google Cloud Console</li>
                    <li>Create a new project or select an existing one</li>
                    <li>Enable Maps JavaScript API</li>
                    <li>Create an API key in Credentials</li>
                  </ol>
                </div>
              </div>
            ) : (
              <Button 
                className="bg-primary hover:bg-primary/90" 
                onClick={() => setIsSettingKey(true)}
              >
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
