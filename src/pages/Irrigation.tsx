
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  PlayCircle, 
  PauseCircle, 
  StopCircle, 
  Plus, 
  Settings, 
  X,
  Check
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [showAddScheduleDialog, setShowAddScheduleDialog] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
    zoneName: '',
    zoneId: '',
    startTime: '08:00',
    duration: '30',
    days: [],
    status: 'active'
  });

  // Mock data for zones and schedules
  const [zones, setZones] = useState<Zone[]>([
    { id: 'z1', name: 'North Field - Zone 1', status: 'inactive', soilMoisture: 65 },
    { id: 'z2', name: 'East Field - Zone 2', status: 'active', soilMoisture: 42 },
    { id: 'z3', name: 'South Field - Zone 3', status: 'paused', soilMoisture: 58 },
    { id: 'z4', name: 'West Field - Zone 4', status: 'scheduled', nextScheduled: 'Today, 5:30 PM', soilMoisture: 70 },
  ]);

  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: 's1', zoneName: 'North Field - Zone 1', zoneId: 'z1', startTime: '07:30', duration: '45 minutes', days: ['Monday', 'Wednesday', 'Friday'], status: 'active' },
    { id: 's2', zoneName: 'East Field - Zone 2', zoneId: 'z2', startTime: '10:15', duration: '30 minutes', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], status: 'active' },
    { id: 's3', zoneName: 'South Field - Zone 3', zoneId: 'z3', startTime: '14:00', duration: '60 minutes', days: ['Tuesday', 'Thursday'], status: 'inactive' },
  ]);

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleZoneAction = (zoneId: string, action: 'start' | 'pause' | 'stop') => {
    const actions = {
      start: 'started',
      pause: 'paused',
      stop: 'stopped'
    };
    
    // Update zone status based on action
    const updatedZones = zones.map(zone => {
      if (zone.id === zoneId) {
        const newStatus = action === 'start' ? 'active' : action === 'pause' ? 'paused' : 'inactive';
        return { ...zone, status: newStatus };
      }
      return zone;
    });
    
    setZones(updatedZones);
    
    const zoneName = zones.find(z => z.id === zoneId)?.name;
    toast({
      title: "Irrigation Control",
      description: `${zoneName} irrigation ${actions[action]} successfully.`,
    });
  };

  const handleAddSchedule = () => {
    // Validate form
    if (!newSchedule.zoneId || !newSchedule.startTime || !newSchedule.duration || newSchedule.days?.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const zone = zones.find(z => z.id === newSchedule.zoneId);
    if (!zone) return;

    // Create new schedule
    const schedule: Schedule = {
      id: `s${Date.now()}`,
      zoneName: zone.name,
      zoneId: zone.id,
      startTime: newSchedule.startTime || '08:00',
      duration: `${newSchedule.duration} minutes`,
      days: newSchedule.days || [],
      status: newSchedule.status || 'active'
    };

    // Add schedule to the list
    setSchedules([...schedules, schedule]);

    // Update zone status if needed
    if (schedule.status === 'active') {
      const updatedZones = zones.map(z => {
        if (z.id === schedule.zoneId) {
          return { ...z, status: 'scheduled', nextScheduled: `Next: ${schedule.days[0]}, ${schedule.startTime}` };
        }
        return z;
      });
      setZones(updatedZones);
    }

    // Reset form and close dialog
    setNewSchedule({
      zoneName: '',
      zoneId: '',
      startTime: '08:00',
      duration: '30',
      days: [],
      status: 'active'
    });
    setShowAddScheduleDialog(false);

    toast({
      title: "Schedule Added",
      description: `New irrigation schedule created for ${zone.name}`,
    });
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(schedules.filter(s => s.id !== scheduleId));
    toast({
      title: "Schedule Deleted",
      description: "Irrigation schedule has been removed.",
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
            <Button onClick={() => toast({ 
              title: "Feature Coming Soon", 
              description: "Adding zones will be available in a future update."
            })}>
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
                      <div className="flex space-x-2 items-center">
                        <Badge className={schedule.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                          {schedule.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleDeleteSchedule(schedule.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="flex justify-end">
                <Dialog open={showAddScheduleDialog} onOpenChange={setShowAddScheduleDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Schedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Irrigation Schedule</DialogTitle>
                      <DialogDescription>
                        Set up a recurring irrigation schedule for a specific zone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="zone">Zone</Label>
                        <select
                          id="zone"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={newSchedule.zoneId}
                          onChange={(e) => setNewSchedule({...newSchedule, zoneId: e.target.value})}
                        >
                          <option value="">Select a zone</option>
                          {zones.map((zone) => (
                            <option key={zone.id} value={zone.id}>
                              {zone.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={newSchedule.startTime}
                            onChange={(e) => setNewSchedule({...newSchedule, startTime: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">Duration (minutes)</Label>
                          <Input
                            id="duration"
                            type="number"
                            min="1"
                            max="180"
                            value={newSchedule.duration}
                            onChange={(e) => setNewSchedule({...newSchedule, duration: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Days of Week</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {weekdays.map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`day-${day}`} 
                                checked={newSchedule.days?.includes(day)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewSchedule({
                                      ...newSchedule, 
                                      days: [...(newSchedule.days || []), day]
                                    });
                                  } else {
                                    setNewSchedule({
                                      ...newSchedule, 
                                      days: (newSchedule.days || []).filter(d => d !== day)
                                    });
                                  }
                                }}
                              />
                              <Label htmlFor={`day-${day}`} className="text-sm">{day.substring(0, 3)}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="status" 
                          checked={newSchedule.status === 'active'}
                          onCheckedChange={(checked) => {
                            setNewSchedule({
                              ...newSchedule, 
                              status: checked ? 'active' : 'inactive'
                            });
                          }}
                        />
                        <Label htmlFor="status">Activate schedule immediately</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddScheduleDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" onClick={handleAddSchedule}>
                        <Check className="mr-2 h-4 w-4" />
                        Create Schedule
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                    {schedules
                      .filter(s => s.status === 'active' && s.days.includes(
                        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]
                      ))
                      .map(s => (
                        <div key={s.id} className="text-sm p-2 bg-muted rounded-md">
                          <div className="font-medium">{s.zoneName}</div>
                          <div className="text-muted-foreground">{s.startTime} - Duration: {s.duration}</div>
                        </div>
                      ))}
                    {schedules.filter(s => s.status === 'active').length === 0 && (
                      <div className="text-sm p-2 bg-muted rounded-md text-muted-foreground">
                        No schedules for today
                      </div>
                    )}
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
