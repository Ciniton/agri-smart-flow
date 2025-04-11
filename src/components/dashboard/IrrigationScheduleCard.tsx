
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduleItem {
  id: string;
  zone: string;
  startTime: string;
  duration: string;
  status: 'scheduled' | 'active' | 'completed';
}

interface IrrigationScheduleCardProps {
  schedules: ScheduleItem[];
  className?: string;
}

const IrrigationScheduleCard: React.FC<IrrigationScheduleCardProps> = ({ 
  schedules,
  className
}) => {
  const getStatusColor = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-gray-200 text-gray-700';
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'completed': return 'bg-green-100 text-green-700';
    }
  };
  
  const getStatusText = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'active': return 'Active Now';
      case 'completed': return 'Completed';
    }
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Irrigation Schedule</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-3">
          {schedules.map(schedule => (
            <div 
              key={schedule.id} 
              className={cn(
                "p-3 rounded-md border",
                schedule.status === 'active' ? 'border-blue-300' : 'border-transparent'
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{schedule.zone}</h4>
                <span 
                  className={cn(
                    "text-xs py-1 px-2 rounded-full",
                    getStatusColor(schedule.status)
                  )}
                >
                  {getStatusText(schedule.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock size={14} className="mr-1" />
                  <span>{schedule.startTime}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Droplets size={14} className="mr-1" />
                  <span>{schedule.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IrrigationScheduleCard;
