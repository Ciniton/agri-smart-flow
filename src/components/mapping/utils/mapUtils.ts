
// Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const loadGoogleMapsScript = (
  apiKey: string | null, 
  onProgress: (progress: number) => void, 
  onError: (error: string) => void, 
  onSuccess: () => void
): void => {
  if (!apiKey) {
    onError('No Google Maps API key found. Please set it in the map settings.');
    return;
  }

  if (window.google && window.google.maps) {
    onSuccess();
    return;
  }

  // Set up a progress simulation for better UX
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 5;
    if (progress > 95) {
      clearInterval(progressInterval);
    } else {
      onProgress(progress);
    }
  }, 500);

  // Create a timeout for script loading
  const scriptLoadingTimeout = setTimeout(() => {
    clearInterval(progressInterval);
    onError('Google Maps is taking too long to load. Check your internet connection or API key.');
  }, 15000); // 15 second timeout

  window.initMap = () => {
    clearInterval(progressInterval);
    clearTimeout(scriptLoadingTimeout);
    onProgress(100);
    onSuccess();
  };

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing,geometry&callback=initMap`;
  script.async = true;
  script.defer = true;
  script.onerror = () => {
    clearInterval(progressInterval);
    clearTimeout(scriptLoadingTimeout);
    onError('Failed to load Google Maps. Please check your API key and internet connection.');
  };
  document.head.appendChild(script);
};

export const getDefaultMapOptions = (userPosition: { lat: number, lng: number } | null) => {
  // Default location (centered on North America)
  const defaultLocation = { lat: 39.8283, lng: -98.5795 };
  
  return {
    center: userPosition || defaultLocation,
    zoom: 5,
    mapTypeId: 'satellite',
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: false, // We'll use our custom zoom controls
  };
};

export const getDrawingManagerOptions = () => {
  return {
    drawingMode: null,
    drawingControl: false,
    drawingControlOptions: {
      position: window.google?.maps?.ControlPosition?.TOP_CENTER,
      drawingModes: [
        window.google?.maps?.drawing?.OverlayType?.POLYGON,
        window.google?.maps?.drawing?.OverlayType?.MARKER,
      ],
    },
    polygonOptions: {
      fillColor: '#4285F4',
      fillOpacity: 0.3,
      strokeWeight: 2,
      strokeColor: '#4285F4',
      editable: true,
      draggable: true,
    },
    markerOptions: {
      draggable: true,
    },
  };
};

// Calculate the center point of a polygon
export const getCenterOfPolygon = (points: { lat: number; lng: number }[]): { lat: number; lng: number } => {
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
