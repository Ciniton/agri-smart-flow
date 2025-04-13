
export const getDeviceIcon = (type: 'sensor' | 'valve' | 'weather-station') => {
  // Return appropriate SVG icon URL based on device type
  switch (type) {
    case 'sensor':
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a8 8 0 0 1-8-8c0-5 8-13 8-13s8 8 8 13a8 8 0 0 1-8 8z"/></svg>`);
    case 'valve':
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`);
    case 'weather-station':
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFC107" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>`);
    default:
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`);
  }
};

export const createDeviceInfoWindowContent = (
  device: {
    name: string;
    type: string;
    position: { lat: number; lng: number };
    fieldId?: string;
    zoneId?: string;
  },
  fields: { id: string; name: string; }[],
  zones: { id: string; name: string; }[]
) => {
  return `
    <div style="padding: 8px; max-width: 200px;">
      <h3 style="margin: 0 0 8px; font-weight: 500;">${device.name}</h3>
      <p style="margin: 0; font-size: 12px; color: #666;">
        <strong>Type:</strong> ${device.type.replace('-', ' ')}
      </p>
      <p style="margin: 4px 0; font-size: 12px; color: #666;">
        <strong>Position:</strong> ${device.position.lat.toFixed(6)}, ${device.position.lng.toFixed(6)}
      </p>
      ${device.fieldId ? 
        `<p style="margin: 4px 0; font-size: 12px; color: #666;">
          <strong>Field:</strong> ${fields.find(f => f.id === device.fieldId)?.name || 'Unknown'}
        </p>` : ''
      }
      ${device.zoneId ? 
        `<p style="margin: 4px 0; font-size: 12px; color: #666;">
          <strong>Zone:</strong> ${zones.find(z => z.id === device.zoneId)?.name || 'Unknown'}
        </p>` : ''
      }
    </div>
  `;
};
