
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DeviceStatus {
  id: string;
  name: string;
  zone: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  lastReading: string;
}

interface DeviceStatusCardProps {
  devices: DeviceStatus[];
  className?: string;
}

const DeviceStatusCard: React.FC<DeviceStatusCardProps> = ({ devices, className }) => {
  const getStatusClass = (status: DeviceStatus['status']) => {
    switch (status) {
      case 'healthy': return 'status-healthy';
      case 'warning': return 'status-warning';
      case 'error': return 'status-error';
      case 'offline': return 'status-offline';
    }
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Device Status</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-1">
          {devices.map(device => (
            <div 
              key={device.id}
              className="flex items-center justify-between p-3 hover:bg-muted rounded-md cursor-pointer"
            >
              <div className="flex items-center">
                <span className={cn("status-indicator mr-3", getStatusClass(device.status))} />
                <div>
                  <p className="font-medium text-sm">{device.name}</p>
                  <p className="text-xs text-muted-foreground">{device.zone}</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {device.lastReading}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceStatusCard;
