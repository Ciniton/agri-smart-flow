
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator";
import { User, Key, Globe, UserPlus, Users, Building, MapPin, Droplets, Database, Server, Bell, Settings as SettingsIcon, HelpCircle, Download, UploadCloud, Calendar } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface FormState {
  name: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  farmName: string;
  timezone: string;
  measurementSystem: 'metric' | 'imperial';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  darkMode: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  dataBackup: boolean;
  autoUpdate: boolean;
}

const Settings: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    farmName: 'Green Valley Farm',
    timezone: 'America/New_York',
    measurementSystem: 'metric',
    dateFormat: 'MM/DD/YYYY',
    darkMode: false,
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
    dataBackup: true,
    autoUpdate: true,
  });

  const handleInputChange = (field: keyof FormState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parent: keyof FormState, field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.newPassword !== formState.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    
    // Reset password fields
    setFormState(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  const handleSaveSystem = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "System Settings Updated",
      description: "Your system preferences have been saved successfully.",
    });
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved successfully.",
    });
  };

  const handleBackupNow = () => {
    toast({
      title: "Backup Started",
      description: "System backup has been initiated. You will be notified when it's complete.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your system preferences</p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="farm">Farm</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={formState.name} 
                        onChange={(e) => handleInputChange('name', e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formState.email} 
                        onChange={(e) => handleInputChange('email', e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={formState.phone} 
                        onChange={(e) => handleInputChange('phone', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePassword} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={formState.currentPassword} 
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        value={formState.newPassword} 
                        onChange={(e) => handleInputChange('newPassword', e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={formState.confirmPassword} 
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View and manage your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <Label>Account Type</Label>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-primary">Farm Manager</Badge>
                  <Badge variant="outline">Admin</Badge>
                </div>
              </div>
              
              <div>
                <Label>Account Created</Label>
                <p className="text-sm text-muted-foreground">April 10, 2023</p>
              </div>
              
              <div>
                <Label>Last Login</Label>
                <p className="text-sm text-muted-foreground">April 11, 2025 - 09:42 AM</p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Connected Devices</h3>
                    <p className="text-sm text-muted-foreground">Manage devices connected to your account</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive">Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Manage your subscription plan and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">Professional Plan</p>
                    <p className="text-sm text-muted-foreground">$39.99/month</p>
                  </div>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Next billing date: May 10, 2025</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Upgrade Plan</h3>
                    <p className="text-sm text-muted-foreground">Explore other subscription options</p>
                  </div>
                  <Button variant="outline">View Plans</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Billing Information</h3>
                    <p className="text-sm text-muted-foreground">Update your billing details and payment methods</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Billing History</h3>
                    <p className="text-sm text-muted-foreground">View past invoices and payment history</p>
                  </div>
                  <Button variant="outline">View History</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="farm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Farm Information</CardTitle>
              <CardDescription>
                Update your farm details and location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="farmName">Farm Name</Label>
                      <Input 
                        id="farmName" 
                        value={formState.farmName} 
                        onChange={(e) => handleInputChange('farmName', e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Time Zone</Label>
                      <Input 
                        id="timezone" 
                        value={formState.timezone} 
                        onChange={(e) => handleInputChange('timezone', e.target.value)} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <div className="bg-muted h-60 rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Map will be displayed here</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Drag the pin to set your farm's exact location</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Measurement System</Label>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="metric" 
                          name="measurementSystem" 
                          value="metric"
                          checked={formState.measurementSystem === 'metric'}
                          onChange={() => handleInputChange('measurementSystem', 'metric')}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="metric" className="text-sm">Metric (Liters, Hectares)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="imperial" 
                          name="measurementSystem" 
                          value="imperial"
                          checked={formState.measurementSystem === 'imperial'}
                          onChange={() => handleInputChange('measurementSystem', 'imperial')}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="imperial" className="text-sm">Imperial (Gallons, Acres)</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="mmddyyyy" 
                          name="dateFormat" 
                          value="MM/DD/YYYY"
                          checked={formState.dateFormat === 'MM/DD/YYYY'}
                          onChange={() => handleInputChange('dateFormat', 'MM/DD/YYYY')}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="mmddyyyy" className="text-sm">MM/DD/YYYY</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="ddmmyyyy" 
                          name="dateFormat" 
                          value="DD/MM/YYYY"
                          checked={formState.dateFormat === 'DD/MM/YYYY'}
                          onChange={() => handleInputChange('dateFormat', 'DD/MM/YYYY')}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="ddmmyyyy" className="text-sm">DD/MM/YYYY</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="yyyymmdd" 
                          name="dateFormat" 
                          value="YYYY-MM-DD"
                          checked={formState.dateFormat === 'YYYY-MM-DD'}
                          onChange={() => handleInputChange('dateFormat', 'YYYY-MM-DD')}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="yyyymmdd" className="text-sm">YYYY-MM-DD</Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Save Farm Settings</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Users & Access</CardTitle>
              <CardDescription>
                Manage users who have access to your farm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Farm Users</h3>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center">
                      <span className="font-medium text-white">JD</span>
                    </div>
                    <div>
                      <p className="font-medium">John Doe (You)</p>
                      <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                    </div>
                  </div>
                  <Badge>Owner</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center">
                      <span className="font-medium text-white">AS</span>
                    </div>
                    <div>
                      <p className="font-medium">Alice Smith</p>
                      <p className="text-xs text-muted-foreground">alice.smith@example.com</p>
                    </div>
                  </div>
                  <Badge variant="outline">Manager</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center">
                      <span className="font-medium text-white">BJ</span>
                    </div>
                    <div>
                      <p className="font-medium">Bob Johnson</p>
                      <p className="text-xs text-muted-foreground">bob.johnson@example.com</p>
                    </div>
                  </div>
                  <Badge variant="outline">Technician</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">User Roles</h3>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Owner:</span> Full access to all features and settings</p>
                  <p><span className="font-medium">Manager:</span> Can manage devices, schedules, and view reports</p>
                  <p><span className="font-medium">Technician:</span> Can view and control devices, limited settings access</p>
                  <p><span className="font-medium">Viewer:</span> Read-only access to dashboard and reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system appearance and behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSystem} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Use dark theme for the application</p>
                    </div>
                    <Switch 
                      id="darkMode" 
                      checked={formState.darkMode}
                      onCheckedChange={(checked) => handleInputChange('darkMode', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoUpdate">Automatic Updates</Label>
                      <p className="text-sm text-muted-foreground">Automatically update the system when new versions are available</p>
                    </div>
                    <Switch 
                      id="autoUpdate" 
                      checked={formState.autoUpdate}
                      onCheckedChange={(checked) => handleInputChange('autoUpdate', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dataBackup">Data Backup</Label>
                      <p className="text-sm text-muted-foreground">Automatically backup system data daily</p>
                    </div>
                    <Switch 
                      id="dataBackup" 
                      checked={formState.dataBackup}
                      onCheckedChange={(checked) => handleInputChange('dataBackup', checked)}
                    />
                  </div>
                  
                  {formState.dataBackup && (
                    <div className="space-y-2 pl-6">
                      <Label htmlFor="backupTime">Backup Time</Label>
                      <Input 
                        id="backupTime" 
                        type="time" 
                        defaultValue="02:00" 
                      />
                      <div className="flex justify-between mt-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleBackupNow}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Backup Now
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                        >
                          <UploadCloud className="mr-2 h-4 w-4" />
                          Restore Backup
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Save System Settings</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveNotifications} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive system alerts via email</p>
                    </div>
                    <Switch 
                      id="emailNotifications" 
                      checked={formState.notifications.email}
                      onCheckedChange={(checked) => handleNestedChange('notifications', 'email', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive system alerts via text message</p>
                    </div>
                    <Switch 
                      id="smsNotifications" 
                      checked={formState.notifications.sms}
                      onCheckedChange={(checked) => handleNestedChange('notifications', 'sms', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive system alerts on your devices</p>
                    </div>
                    <Switch 
                      id="pushNotifications" 
                      checked={formState.notifications.push}
                      onCheckedChange={(checked) => handleNestedChange('notifications', 'push', checked)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Save Notification Settings</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>
                System administration and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Admin Area</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      These settings affect the entire system. Changes made here will impact all users and farms.
                      Please proceed with caution.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-md hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-2 bg-background rounded-full">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">User Management</h3>
                    <p className="text-sm text-muted-foreground">Manage all system users and roles</p>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-2 bg-background rounded-full">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Organization Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure organization-wide settings</p>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-2 bg-background rounded-full">
                      <Droplets className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Irrigation Defaults</h3>
                    <p className="text-sm text-muted-foreground">Set system-wide irrigation defaults</p>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-2 bg-background rounded-full">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Database Management</h3>
                    <p className="text-sm text-muted-foreground">Manage database connections and operations</p>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-2 bg-background rounded-full">
                      <Server className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">System Logs</h3>
                    <p className="text-sm text-muted-foreground">View and analyze system logs</p>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-2 bg-background rounded-full">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">API Configuration</h3>
                    <p className="text-sm text-muted-foreground">Manage external API integrations</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">System Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Version:</span>
                    <span>2.3.1</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>April 5, 2025</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Server Status:</span>
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Operational
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Database Status:</span>
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Operational
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Active Users:</span>
                    <span>28</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Connected Devices:</span>
                    <span>147</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
