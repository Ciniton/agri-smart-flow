
export interface DeviceMarker {
  id: string;
  name: string;
  type: 'sensor' | 'valve' | 'weather-station';
  position: { lat: number; lng: number };
  fieldId?: string; // Associate device with a specific field
  lastReading?: any; // Store the last reading from this device
  settings?: any; // Device configuration settings
}

export interface Field {
  id: string;
  name: string;
  boundaries?: google.maps.LatLngLiteral[]; // Store polygon coordinates
  center?: google.maps.LatLngLiteral; // Center point of the field
  area?: {
    squareMeters: number;
    hectares: number;
  }; // In square meters or hectares
  lastModified: string;
  userId?: string; // To associate field with a user
}

export interface Zone {
  id: string;
  name: string;
  fieldId: string;
  irrigationType: 'low' | 'medium' | 'high';
  boundaries?: google.maps.LatLngLiteral[]; // Store polygon coordinates
  lastModified: string;
}

export interface DeviceReading {
  id: string;
  deviceId: string;
  timestamp: string;
  values: {
    [key: string]: any; // Different devices return different values
  };
}

// Add these types to access google.maps methods without typescript errors
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}
