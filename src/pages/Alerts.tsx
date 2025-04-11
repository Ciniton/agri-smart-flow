
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from "@/components/ui/switch";
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Bell, Mail, MessagesSquare, BellOff, Plus, Settings, CheckCircle2, AlertTriangle, Search, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  title: string;
  message: string;
  source: string;
  timestamp: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'acknowledged' | 'resolved';
}

const Alerts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Mock data for alerts
  const alertsData: Alert[] = [
    {
      id: 'a1',
      title: 'Low Water Pressure Detected',
      message: 'Water pressure has dropped below 20 psi in North Field Zone 1.',
      source: 'Valve Controller A1',
      timestamp: '2025-04-10 14:32',
      priority: 'critical',
      status: 'new',
    },
    {
      id: 'a2',
      title: 'Soil Moisture Below Threshold',
      message: 'Soil moisture in East Field Zone 2 is below the set threshold (30%).',
      source: 'Moisture Sensor B3',
      timestamp: '2025-04-10 12:45',
      priority: 'high',
      status: 'acknowledged',
    },
    {
      id: 'a3',
      title: 'Weather Alert - High Wind',
      message: 'Wind speeds of 25 mph detected. Consider adjusting irrigation schedule.',
      source: 'Weather Station',
      timestamp: '2025-04-10 10:15',
      priority: 'medium',
      status: 'acknowledged',
    },
    {
      id: 'a4',
      title: 'Valve Malfunction',
      message: 'Valve not responding to open command in South Field Zone 3.',
      source: 'Valve Controller C2',
      timestamp: '2025-04-10 09:22',
      priority: 'high',
      status: 'new',
    },
    {
      id: 'a5',
      title: 'Pump Pressure Fluctuation',
      message: 'Unusual pressure fluctuations detected in main pump.',
      source: 'Pump Control Unit',
      timestamp: '2025-04-09 18:05',
      priority: 'medium',
      status: 'resolved',
    },
    {
      id: 'a6',
      title: 'Battery Low',
      message: 'Battery level below 15% in South Field moisture sensor.',
      source: 'Moisture Sensor C5',
      timestamp: '2025-04-09 16:30',
      priority: 'low',
      status: 'resolved',
    },
  ];

  // Filter alerts based on search, priority, and status
  const filteredAlerts = alertsData.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alert.source.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = selectedPriority.length === 0 || selectedPriority.includes(alert.priority);
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(alert.status);
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Sort alerts based on timestamp
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const togglePriorityFilter = (priority: string) => {
    if (selectedPriority.includes(priority)) {
      setSelectedPriority(selectedPriority.filter(p => p !== priority));
    } else {
      setSelectedPriority([...selectedPriority, priority]);
    }
  };

  const toggleStatusFilter = (status: string) => {
    if (selectedStatus.includes(status)) {
      setSelectedStatus(selectedStatus.filter(s => s !== status));
    } else {
      setSelectedStatus([...selectedStatus, status]);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getPriorityBadge = (priority: Alert['priority']) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-500">Critical</Badge>;
      case 'high':
        return <Badge className="bg-amber-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-blue-500">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const getStatusBadge = (status: Alert['status']) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-purple-500">New</Badge>;
      case 'acknowledged':
        return <Badge className="bg-blue-500">Acknowledged</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
    }
  };

  const handleAlertAction = (alertId: string, action: 'acknowledge' | 'resolve' | 'disable') => {
    const alert = alertsData.find(a => a.id === alertId);
    
    if (!alert) return;
    
    const actions = {
      acknowledge: 'acknowledged',
      resolve: 'resolved',
      disable: 'disabled',
    };
    
    toast({
      title: "Alert Action",
      description: `Alert "${alert.title}" has been ${actions[action]}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alerts</h1>
        <p className="text-muted-foreground mt-1">Manage system alerts and notifications</p>
      </div>
      
      <Tabs defaultValue="current" className="w-full">
        <TabsList>
          <TabsTrigger value="current">Current Alerts</TabsTrigger>
          <TabsTrigger value="history">Alert History</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Input
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={toggleSortOrder}>
                {sortOrder === 'desc' ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronUp className="mr-2 h-4 w-4" />}
                {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Alert Rule
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-4">
              {sortedAlerts.length > 0 ? (
                sortedAlerts.map((alert) => (
                  <Card key={alert.id} className={`overflow-hidden ${alert.status === 'new' ? 'border-l-4 border-l-red-500' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center">
                            {alert.priority === 'critical' && <AlertCircle className="h-5 w-5 text-red-500 mr-2" />}
                            {alert.title}
                          </CardTitle>
                          <CardDescription>{alert.message}</CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          {getPriorityBadge(alert.priority)}
                          {getStatusBadge(alert.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-4">
                        <span className="font-medium">Source:</span> {alert.source} | <span className="font-medium">Time:</span> {alert.timestamp}
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        {alert.status === 'new' && (
                          <Button variant="outline" size="sm" onClick={() => handleAlertAction(alert.id, 'acknowledge')}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Acknowledge
                          </Button>
                        )}
                        
                        {(alert.status === 'new' || alert.status === 'acknowledged') && (
                          <Button variant="outline" size="sm" onClick={() => handleAlertAction(alert.id, 'resolve')}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Resolve
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm" onClick={() => handleAlertAction(alert.id, 'disable')}>
                          <BellOff className="mr-2 h-4 w-4" />
                          Disable
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center text-center p-8">
                    <div className="rounded-full bg-muted p-3 mb-3">
                      <Bell className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-lg mb-1">No alerts found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery || selectedPriority.length || selectedStatus.length
                        ? "No alerts match your current filters."
                        : "You don't have any active alerts. Great job!"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filter Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Priority</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="priority-critical" 
                          checked={selectedPriority.includes('critical')}
                          onCheckedChange={() => togglePriorityFilter('critical')}
                        />
                        <label
                          htmlFor="priority-critical"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Critical
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="priority-high" 
                          checked={selectedPriority.includes('high')}
                          onCheckedChange={() => togglePriorityFilter('high')}
                        />
                        <label
                          htmlFor="priority-high"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          High
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="priority-medium" 
                          checked={selectedPriority.includes('medium')}
                          onCheckedChange={() => togglePriorityFilter('medium')}
                        />
                        <label
                          htmlFor="priority-medium"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Medium
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="priority-low" 
                          checked={selectedPriority.includes('low')}
                          onCheckedChange={() => togglePriorityFilter('low')}
                        />
                        <label
                          htmlFor="priority-low"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Low
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="status-new" 
                          checked={selectedStatus.includes('new')}
                          onCheckedChange={() => toggleStatusFilter('new')}
                        />
                        <label
                          htmlFor="status-new"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          New
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="status-acknowledged" 
                          checked={selectedStatus.includes('acknowledged')}
                          onCheckedChange={() => toggleStatusFilter('acknowledged')}
                        />
                        <label
                          htmlFor="status-acknowledged"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Acknowledged
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="status-resolved" 
                          checked={selectedStatus.includes('resolved')}
                          onCheckedChange={() => toggleStatusFilter('resolved')}
                        />
                        <label
                          htmlFor="status-resolved"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Resolved
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" onClick={() => {
                    setSelectedPriority([]);
                    setSelectedStatus([]);
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Alert Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Critical</span>
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '16.7%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">High</span>
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '33.3%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Medium</span>
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '33.3%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Low</span>
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gray-500 h-2 rounded-full" style={{ width: '16.7%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <div className="bg-muted p-8 text-center rounded-md">
            <h3 className="text-lg font-medium">Alert History</h3>
            <p className="text-muted-foreground mt-2">
              View and search through all historical alerts and their resolutions.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive alert notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Notification Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <MessagesSquare className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive alerts via text message</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive alerts on your mobile device</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Alert Priorities</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-center text-sm">
                    <div></div>
                    <div className="font-medium">Email</div>
                    <div className="font-medium">SMS</div>
                    <div className="font-medium">Push</div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div className="font-medium">Critical</div>
                    <div className="flex justify-center"><Checkbox defaultChecked /></div>
                    <div className="flex justify-center"><Checkbox defaultChecked /></div>
                    <div className="flex justify-center"><Checkbox defaultChecked /></div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div className="font-medium">High</div>
                    <div className="flex justify-center"><Checkbox defaultChecked /></div>
                    <div className="flex justify-center"><Checkbox /></div>
                    <div className="flex justify-center"><Checkbox defaultChecked /></div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div className="font-medium">Medium</div>
                    <div className="flex justify-center"><Checkbox defaultChecked /></div>
                    <div className="flex justify-center"><Checkbox /></div>
                    <div className="flex justify-center"><Checkbox /></div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <div className="font-medium">Low</div>
                    <div className="flex justify-center"><Checkbox /></div>
                    <div className="flex justify-center"><Checkbox /></div>
                    <div className="flex justify-center"><Checkbox /></div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Quiet Hours</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Quiet Hours</p>
                      <p className="text-sm text-muted-foreground">Only critical alerts will be sent during quiet hours</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Start Time</p>
                      <Input type="time" defaultValue="22:00" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">End Time</p>
                      <Input type="time" defaultValue="07:00" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={() => {
                  toast({
                    title: "Settings Saved",
                    description: "Your notification preferences have been updated.",
                  });
                }}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Alerts;
