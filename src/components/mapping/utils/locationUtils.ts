
import { toast } from "@/hooks/use-toast";

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const getUserLocation = (
  options: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  },
  onSuccess: (position: { lat: number, lng: number }) => void,
  onError: (error: string) => void
): void => {
  if (!navigator.geolocation) {
    onError('Geolocation is not supported by your browser');
    return;
  }

  toast({
    title: "Getting Location",
    description: "Detecting your current location...",
  });

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      onSuccess({ lat: latitude, lng: longitude });
      
      toast({
        title: "Location Detected",
        description: `Your location has been detected at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      });
    },
    (error) => {
      let errorMessage = "Failed to get your location.";
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location permission denied. Please allow location access in your browser settings.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out.";
          break;
        default:
          errorMessage = "An unknown error occurred while trying to access your location.";
          break;
      }
      
      onError(errorMessage);
      
      toast({
        title: "Location Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
    options
  );
};

export const createUserLocationMarker = (
  google: any,
  map: any,
  position: { lat: number, lng: number }
) => {
  // Create a pulse effect with concentric circles
  const pulseSymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#4285F4',
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 2,
    scale: 12
  };

  // Create the marker
  const marker = new google.maps.Marker({
    position,
    map,
    icon: pulseSymbol,
    title: 'Your Location',
    animation: google.maps.Animation.BOUNCE,
    optimized: false // Needed for smooth CSS animations
  });

  // Apply a CSS animation to make it pulse
  const markerElement = marker.getIcon();
  if (markerElement) {
    markerElement.fillOpacity = 0.7;
    markerElement.strokeOpacity = 0.7;
  }

  // Add an info window to show exact coordinates
  const infoWindow = new google.maps.InfoWindow({
    content: `<div class="p-2 text-sm">
                <strong>Your Location</strong><br>
                Lat: ${position.lat.toFixed(6)}<br>
                Lng: ${position.lng.toFixed(6)}
              </div>`
  });

  // Add a click listener to open the info window
  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(map, marker);
  });

  // Open the info window initially
  infoWindow.open(map, marker);
  setTimeout(() => infoWindow.close(), 5000); // Close after 5 seconds

  return marker;
};
