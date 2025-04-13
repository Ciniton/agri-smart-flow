
import { useRef, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { DeviceMarker, Field, Zone } from '../types';
import { getDeviceIcon, createDeviceInfoWindowContent } from '../utils/deviceUtils';

export const useDeviceMarkers = () => {
  const deviceMarkersRef = useRef<Map<string, any>>(new Map());
  
  const renderDeviceMarkers = useCallback((
    google: any,
    mapInstance: any, 
    devices: DeviceMarker[], 
    fields: Field[],
    zones: Zone[],
    editingDeviceId: string | null = null,
    onLocationChange?: (lat: number, lng: number, fromMapClick?: boolean) => void,
    isAddingDevice?: boolean,
    onDeviceSelect?: (deviceId: string) => void,
    isEditingLocation?: boolean
  ) => {
    // Clear existing device markers
    deviceMarkersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    deviceMarkersRef.current.clear();

    // Add markers for each device
    devices.forEach(device => {
      const markerIcon = {
        url: getDeviceIcon(device.type),
        scaledSize: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 32)
      };

      const marker = new google.maps.Marker({
        position: device.position,
        map: mapInstance,
        title: device.name,
        icon: markerIcon,
        // Only make it draggable if it's being edited AND in location edit mode
        draggable: device.id === editingDeviceId && isEditingLocation,
        animation: device.id === editingDeviceId ? google.maps.Animation.BOUNCE : null
      });

      // If this marker is the one being edited and we're in location edit mode
      if (device.id === editingDeviceId && isEditingLocation) {
        google.maps.event.addListener(marker, 'dragend', (event: any) => {
          if (onLocationChange) {
            onLocationChange(event.latLng.lat(), event.latLng.lng());
            
            // Immediately show a success toast to indicate the device was moved
            toast({
              title: "Device Moved",
              description: `Device "${device.name}" moved to new location. Remember to save your changes.`,
            });
          }
        });

        // Center on the editing device
        mapInstance.setCenter(device.position);
        mapInstance.setZoom(18);
      }

      // Add click listener to select the device
      google.maps.event.addListener(marker, 'click', () => {
        // Store the current position
        if (onLocationChange) {
          onLocationChange(device.position.lat, device.position.lng);
        }
        
        // Call the device select callback if provided
        if (onDeviceSelect) {
          onDeviceSelect(device.id);
        } else if (device.id !== editingDeviceId) {
          toast({
            title: "Device Selected",
            description: `Selected ${device.name}`,
          });
        }
      });

      // Add info window with enhanced device details including zone information
      const infoWindowContent = createDeviceInfoWindowContent(device, fields, zones);
      
      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });
      
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(mapInstance, marker);
      });

      deviceMarkersRef.current.set(device.id, marker);
    });

    // Set up map click listener if adding device mode is active
    if (isAddingDevice && mapInstance) {
      // Clear any existing click listeners to prevent multiple clicks
      google.maps.event.clearListeners(mapInstance, 'click');
      
      // Listen for map clicks to place device
      google.maps.event.addListener(mapInstance, 'click', (event: any) => {
        if (onLocationChange) {
          const clickedPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          
          // Pass true for fromMapClick to indicate this came from a map click
          onLocationChange(clickedPosition.lat, clickedPosition.lng, true);
          
          // Create a temporary marker to indicate where the device will be placed
          const tempMarker = new google.maps.Marker({
            position: clickedPosition,
            map: mapInstance,
            animation: google.maps.Animation.DROP,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#4285F4',
              fillOpacity: 0.8,
              strokeWeight: 2,
              strokeColor: '#FFFFFF',
              scale: 10
            }
          });
          
          // Store the temp marker so we can remove it when the operation is complete
          deviceMarkersRef.current.set('temp-marker', tempMarker);
          
          toast({
            title: "Location Selected",
            description: "Adding new device at selected location",
          });
          
          // Stop event propagation to prevent field/zone selection
          event.stop();
          event.stopPropagation();
          event.preventDefault();
          return false;
        }
      });
      
      // Change cursor to indicate map is clickable
      mapInstance.setOptions({ draggableCursor: 'crosshair' });
    } else if (mapInstance) {
      // Remove map click listener and restore default cursor
      google.maps.event.clearListeners(mapInstance, 'click');
      mapInstance.setOptions({ draggableCursor: null });
    }
  }, []);

  const clearTempMarkers = useCallback(() => {
    // Remove any temporary markers
    const tempMarker = deviceMarkersRef.current.get('temp-marker');
    if (tempMarker) {
      tempMarker.setMap(null);
      deviceMarkersRef.current.delete('temp-marker');
    }
  }, []);

  return {
    deviceMarkersRef,
    renderDeviceMarkers,
    clearTempMarkers
  };
};
