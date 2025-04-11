
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar as CalendarIcon, PlayCircle, PauseCircle, StopCircle, Plus, Settings } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Zone {
  id: string;
  name: string;
  status: 'inactive' | 'active' | 'paused' | 'scheduled';
  nextScheduled?: string;
  soilMoisture?: number;
}

interface Schedule {
  id: string;
  zoneName: string;
  zoneId: string;
  startTime: string;
  duration: string;
  days: string[];
  status: 'active' | 'inactive';
}

const Irrigation: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('zones');

  // Mock data for zones and schedules
  const zones: Zone[] = [
    { id: 'z1', name: 'North Field - Zone 1', status: 'inactive', soilMoisture: 65 },
    { id: 'z2', name: 'East Field - Zone 2', status: 'active', soilMoisture: 42 },
    { id: 'z3', name: 'South Field - Zone 3', status: 'paused', soilMoisture: 58 },
    { id: 'z4', name: 'West Field - Zone 4', status: 'scheduled', nextScheduled: 'Today, 5:30 PM', soilMoisture: 70 },
  ];

  const schedules: Schedule[] = [
    { id: 's1', zoneName: 'North Field - Zone 1', zoneId: 'z1', startTime: '07:30', duration: '45 minutes', days: ['Monday', 'Wednesday', 'Friday'], status: 'active' },
    { id: 's2', zoneName: 'East Field - Zone 2', zoneId: 'z2', startTime: '10:15', duration: '30 minutes', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], status: 'active' },
    { id: 's3', zoneName: 'South Field - Zone 3', zoneId: 'z3', startTime: '14:00', duration: '60 minutes', days: ['Tuesday', 'Thursday'], status: 'inactive' },
  ];

  const handleZoneAction = (zoneId: string, action: 'start' | 'pause' | 'stop') => {
    const actions = {
      start: 'started',
      pause: 'paused',
      stop: 'stopped'
    };
    
    const zoneName = zones.find(z => z.id === zoneId)?.name;
    toast({
      title: "Irrigation Control",
      description: `${zoneName} irrigation ${actions[action]} successfully.`,
    });
  };

  const getZoneStatusBadge = (status: Zone['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'paused':
        return <Badge className="bg-amber-500">Paused</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      default:
        return <Badge variant="outline">Inactive</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Irrigation Control</h1>
        <p className="text-muted-foreground mt-1">Manage your irrigation system</p>
      </div>
      
      <Tabs defaultValue="zones" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="zones" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map((zone) => (
              <Card key={zone.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{zone.name}</CardTitle>
                    {getZoneStatusBadge(zone.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {zone.soilMoisture && (
                        <div>
                          <p className="text-muted-foreground">Soil Moisture</p>
                          <p className="font-medium">{zone.soilMoisture}%</p>
                        </div>
                      )}
                      {zone.nextScheduled && (
                        <div>
                          <p className="text-muted-foreground">Next Scheduled</p>
                          <p className="font-medium">{zone.nextScheduled}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleZoneAction(zone.id, 'start')}
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleZoneAction(zone.id, 'pause')}
                      >
                        <PauseCircle className="mr-2 h-4 w-4" />
                        Pause
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleZoneAction(zone.id, 'stop')}
                      >
                        <StopCircle className="mr-2 h-4 w-4" />
                        Stop
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Zone
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="schedules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {schedules.map((schedule) => (
                <Card key={schedule.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{schedule.zoneName}</CardTitle>
                      <Badge className={schedule.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                        {schedule.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Start Time</p>
                            <p className="font-medium">{schedule.startTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">{schedule.duration}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Days</p>
                        <div className="flex flex-wrap gap-1">
                          {schedule.days.map((day) => (
                            <Badge key={day} variant="outline" className="text-xs">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Settings className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="flex justify-end">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Schedule
                </Button>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Today's Schedule</h3>
                  <div className="space-y-2">
                    <div className="text-sm p-2 bg-muted rounded-md">
                      <div className="font-medium">East Field - Zone 2</div>
                      <div className="text-muted-foreground">10:15 AM - 10:45 AM</div>
                    </div>
                    <div className="text-sm p-2 bg-muted rounded-md">
                      <div className="font-medium">South Field - Zone 3</div>
                      <div className="text-muted-foreground">02:00 PM - 03:00 PM</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Irrigation;
