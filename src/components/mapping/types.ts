export interface GoogleLatLngLiteral {
  lat: number;
  lng: number;
}

export interface Field {
  id: string;
  name: string;
  boundaries?: GoogleLatLngLiteral[];
  center?: GoogleLatLngLiteral;
  area?: {
    squareMeters: number;
    hectares: number;
  };
  lastModified?: string;
}

export interface Zone {
  id: string;
  name: string;
  fieldId: string;
  irrigationType: 'low' | 'medium' | 'high';
  boundaries?: GoogleLatLngLiteral[];
  center?: GoogleLatLngLiteral;
  area?: {
    squareMeters: number;
    hectares: number;
  };
  lastModified?: string;
}

export interface DeviceMarker {
  id: string;
  name: string;
  type: 'sensor' | 'valve' | 'weather-station';
  position: GoogleLatLngLiteral;
  fieldId?: string;
  zoneId?: string;
  serialNumber?: string;
}

export interface SoilZone {
  id: string;
  name: string;
  fieldId: string;
  soilType: string;
  color?: string;
  boundaries?: GoogleLatLngLiteral[];
  center?: GoogleLatLngLiteral;
  area?: {
    squareMeters: number;
    hectares: number;
  };
  lastModified?: string;
}
