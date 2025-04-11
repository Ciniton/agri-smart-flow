
export interface DeviceMarker {
  id: string;
  name: string;
  type: 'sensor' | 'valve' | 'weather-station';
  position: { lat: number; lng: number };
}

export interface Field {
  id: string;
  name: string;
  boundaries?: any; // In a real app, this would store polygon coordinates
  area?: number; // In square meters or acres
  lastModified: string;
}

export interface Zone {
  id: string;
  name: string;
  fieldId: string;
  irrigationType: 'low' | 'medium' | 'high';
  boundaries?: any; // In a real app, this would store polygon coordinates
  lastModified: string;
}
