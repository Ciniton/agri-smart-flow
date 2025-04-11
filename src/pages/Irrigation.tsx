
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Droplets, Calendar, Plus, Settings, Clock, Power, Trash2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Zone {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'paused' | 'scheduled';
  nextScheduled?: string;
  soilMoisture?: number;
}

interface Schedule {
  id: string;
  zoneId: string;
  days: string[];
  startTime: string;
  duration: number;
  enabled: boolean;
}

const Irrigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('zones');
  const [showAddScheduleDialog, setShowAddScheduleDialog] = useState(false);
  
  // Mock data for irrigation zones
  const [zones, setZones] = useState<Zone[]>([
    { id: 'z1', name: 'North Field Zone', status: 'active', nextScheduled: 'Today, 4:00 PM', soilMoisture: 42 },
    { id: 'z2', name: 'East Field Zone', status: 'scheduled', nextScheduled: 'Tomorrow, 6:00 AM', soilMoisture: 38 },
    { id: 'z3', name: 'South Field Zone', status: 'inactive', soilMoisture: 65 },
    { id: 'z4', name: 'West Field Zone', status: 'paused', nextScheduled: 'Manual override', soilMoisture: 25 },
  ]);
  
  // Mock data for schedules
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: 's1', zoneId: 'z1', days: ['Monday', 'Wednesday', 'Friday'], startTime: '16:00', duration: 20, enabled: true },
    { id: 's2', zoneId: 'z2', days: ['Tuesday', 'Thursday', 'Saturday'], startTime: '06:00', duration: 15, enabled: true },
    { id: 's3', zoneId: 'z4', days: ['Monday', 'Thursday'], startTime: '18:30', duration: 25, enabled: false },
  ]);
  
  const [newSchedule, setNewSchedule] = useState<Omit<Schedule, 'id'>>({
    zoneId: '',
    days: [],
    startTime: '08:00',
    duration: 15,
    enabled: true
  });
  
  const toggleZoneStatus = (zoneId: string) => {
    setZones(zones.map(zone => {
      if (zone.id === zoneId) {
        const newStatus: Zone['status'] = 
          zone.status === 'active' ? 'inactive' : 
          zone.status === 'inactive' ? 'active' : 
          zone.status === 'paused' ? 'active' : 'paused';
        
        return { ...zone, status: newStatus };
      }
      return zone;
    }));
    
    toast({
      title: "Zone Status Updated",
      description: "The irrigation zone status has been changed.",
    });
  };
  
  const handleAddZone = () => {
    const newZone: Zone = {
      id: `z${Date.now()}`,
      name: `New Zone ${zones.length + 1}`,
      status: 'inactive',
      soilMoisture: Math.floor(Math.random() * 50) + 20
    };
    
    setZones([...zones, newZone]);
    
    toast({
      title: "Zone Added",
      description: "New irrigation zone has been added successfully.",
    });
  };
  
  const handleAddSchedule = () => {
    if (!newSchedule.zoneId || !newSchedule.days.length || !newSchedule.startTime) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const schedule: Schedule = {
      id: `s${Date.now()}`,
      ...newSchedule
    };
    
    setSchedules([...schedules, schedule]);
    
    // Update zone status if the schedule is enabled
    if (schedule.enabled) {
      setZones(zones.map(zone => {
        if (zone.id === schedule.zoneId) {
          return { 
            ...zone, 
            status: 'scheduled' as const,
            nextScheduled: `Next: ${schedule.days[0]}, ${formatTime(schedule.startTime)}`
          };
        }
        return zone;
      }));
    }
    
    setNewSchedule({
      zoneId: '',
      days: [],
      startTime: '08:00',
      duration: 15,
      enabled: true
    });
    
    setShowAddScheduleDialog(false);
    
    toast({
      title: "Schedule Added",
      description: "New irrigation schedule has been added successfully.",
    });
  };
  
  const toggleScheduleEnabled = (scheduleId: string) => {
    const updatedSchedules = schedules.map(schedule => {
      if (schedule.id === scheduleId) {
        return { ...schedule, enabled: !schedule.enabled };
      }
      return schedule;
    });
    
    setSchedules(updatedSchedules);
    
    // Update zone status based on schedule changes
    const updatedZones = zones.map(zone => {
      const zoneSchedules = updatedSchedules.filter(s => s.zoneId === zone.id && s.enabled);
      if (zoneSchedules.length > 0 && zone.status !== 'active') {
        return { 
          ...zone, 
          status: 'scheduled' as const,
          nextScheduled: `Next: ${zoneSchedules[0].days[0]}, ${formatTime(zoneSchedules[0].startTime)}`
        };
      } else if (zoneSchedules.length === 0 && zone.status === 'scheduled') {
        return { ...zone, status: 'inactive' as const, nextScheduled: undefined };
      }
      return zone;
    });
    
    setZones(updatedZones);
    
    toast({
      title: "Schedule Updated",
      description: "The irrigation schedule has been updated.",
    });
  };
  
  const deleteSchedule = (scheduleId: string) => {
    const scheduleToDelete = schedules.find(s => s.id === scheduleId);
    if (!scheduleToDelete) return;
    
    setSchedules(schedules.filter(s => s.id !== scheduleId));
    
    // Check if this was the last schedule for the zone
    const remainingZoneSchedules = schedules.filter(s => 
      s.id !== scheduleId && s.zoneId === scheduleToDelete.zoneId && s.enabled
    );
    
    if (remainingZoneSchedules.length === 0) {
      setZones(zones.map(zone => {
        if (zone.id === scheduleToDelete.zoneId && zone.status === 'scheduled') {
          return { ...zone, status: 'inactive' as const, nextScheduled: undefined };
        }
        return zone;
      }));
    }
    
    toast({
      title: "Schedule Deleted",
      description: "The irrigation schedule has been removed.",
    });
  };
  
  const formatTime = (time24: string): string => {
    const [hour, minute] = time24.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
  };
  
  const getDayCheckboxes = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map(day => (
      <div key={day} className="flex items-center space-x-2">
        <Checkbox 
          id={`day-${day}`} 
          checked={newSchedule.days.includes(day)}
          onCheckedChange={(checked) => {
            if (checked) {
              setNewSchedule({ ...newSchedule, days: [...newSchedule.days, day] });
            } else {
              setNewSchedule({ 
                ...newSchedule, 
                days: newSchedule.days.filter(d => d !== day) 
              });
            }
          }}
        />
        <label 
          htmlFor={`day-${day}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {day}
        </label>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Irrigation Control</h1>
        <p className="text-muted-foreground mt-1">Manage your irrigation zones and schedules</p>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="zones" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {zones.map((zone) => (
              <Card key={zone.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{zone.name}</CardTitle>
                    <Badge 
                      className={
                        zone.status === 'active' ? "bg-green-500" : 
                        zone.status === 'scheduled' ? "bg-blue-500" :
                        zone.status === 'paused' ? "bg-amber-500" : "bg-gray-500"
                      }
                    >
                      {zone.status.charAt(0).toUpperCase() + zone.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {zone.soilMoisture !== undefined && (
                      <div>
                        <p className="text-sm font-medium mb-1">Soil Moisture</p>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              zone.soilMoisture < 30 ? "bg-red-500" : 
                              zone.soilMoisture < 50 ? "bg-amber-500" : "bg-green-500"
                            }`}
                            style={{ width: `${zone.soilMoisture}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-right mt-1">{zone.soilMoisture}%</p>
                      </div>
                    )}
                    
                    {zone.nextScheduled && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{zone.nextScheduled}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-2">
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Configure
                      </Button>
                      <Button 
                        size="sm"
                        variant={zone.status === 'active' ? "destructive" : "default"}
                        onClick={() => toggleZoneStatus(zone.id)}
                      >
                        <Power className="mr-2 h-4 w-4" />
                        {zone.status === 'active' ? 'Stop' : 'Start'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="flex items-center justify-center h-[220px] border-dashed">
              <Button variant="ghost" className="h-20 w-20 rounded-full" onClick={handleAddZone}>
                <Plus className="h-8 w-8" />
              </Button>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="schedules" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Current Schedules</h2>
            <Dialog open={showAddScheduleDialog} onOpenChange={setShowAddScheduleDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Schedule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Schedule</DialogTitle>
                  <DialogDescription>
                    Create a new irrigation schedule for a specific zone.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="zone" className="text-right text-sm font-medium">
                      Zone
                    </Label>
                    <select
                      id="zone"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newSchedule.zoneId}
                      onChange={(e) => setNewSchedule({...newSchedule, zoneId: e.target.value})}
                    >
                      <option value="" disabled>Select a zone</option>
                      {zones.map(zone => (
                        <option key={zone.id} value={zone.id}>{zone.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right text-sm font-medium mt-2">
                      Days
                    </Label>
                    <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {getDayCheckboxes()}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startTime" className="text-right text-sm font-medium">
                      Start Time
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      className="col-span-3"
                      value={newSchedule.startTime}
                      onChange={(e) => setNewSchedule({...newSchedule, startTime: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right text-sm font-medium">
                      Duration (min)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="120"
                      className="col-span-3"
                      value={newSchedule.duration}
                      onChange={(e) => setNewSchedule({...newSchedule, duration: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="enabled" className="text-right text-sm font-medium">
                      Enabled
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch
                        id="enabled"
                        checked={newSchedule.enabled}
                        onCheckedChange={(checked) => setNewSchedule({...newSchedule, enabled: checked})}
                      />
                      <Label htmlFor="enabled">
                        {newSchedule.enabled ? 'Active' : 'Inactive'}
                      </Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddScheduleDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSchedule}>
                    Add Schedule
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-4">
            {schedules.map((schedule) => {
              const zone = zones.find(z => z.id === schedule.zoneId);
              return (
                <Card key={schedule.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h3 className="font-medium">{zone?.name || 'Unknown Zone'}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatTime(schedule.startTime)}, {schedule.duration} min</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {schedule.days.map(day => (
                            <Badge key={day} variant="outline" className="text-xs">
                              {day.slice(0, 3)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={schedule.enabled}
                          onCheckedChange={() => toggleScheduleEnabled(schedule.id)}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteSchedule(schedule.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {schedules.length === 0 && (
              <div className="text-center py-10 border rounded-md border-dashed">
                <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Schedules</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't created any irrigation schedules yet.
                </p>
                <Button onClick={() => setShowAddScheduleDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Schedule
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Irrigation;
