import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, Check, Save, User, Lock, Bell, Router, MapPin, ExternalLink } from 'lucide-react';

const Settings: React.FC = () => {
  const [name, setName] = useState<string>('John Doe');
  const [email, setEmail] = useState<string>('john.doe@example.com');
  const [password, setPassword] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true);
  const [notificationFrequency, setNotificationFrequency] = useState<string>('daily');
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>('');
  
  useEffect(() => {
    // Load saved API key from localStorage
    const savedApiKey = localStorage.getItem('googleMapsApiKey');
    if (savedApiKey) {
      setGoogleMapsApiKey(savedApiKey);
    }
    
    // Load user settings from localStorage (example)
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    const savedSubscribed = localStorage.getItem('isSubscribed');
    const savedFrequency = localStorage.getItem('notificationFrequency');
    
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedSubscribed) setIsSubscribed(savedSubscribed === 'true');
    if (savedFrequency) setNotificationFrequency(savedFrequency);
  }, []);
  
  const handleSaveGoogleMapsApiKey = () => {
    localStorage.setItem('googleMapsApiKey', googleMapsApiKey);
    toast({
      title: "API Key Saved",
      description: "Google Maps API key has been saved successfully."
    });
  };
  
  const handleSaveAccountSettings = () => {
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    toast({
      title: "Account Settings Saved",
      description: "Your account settings have been updated."
    });
  };
  
  const handleChangePassword = () => {
    if (password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real application, you would hash the password and send it to the server
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully."
    });
    setPassword(''); // Clear the password field after successful change
  };
  
  const handleSaveNotificationSettings = () => {
    localStorage.setItem('isSubscribed', String(isSubscribed));
    localStorage.setItem('notificationFrequency', notificationFrequency);
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated."
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and app preferences</p>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integration">Integrations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        {/* Account Settings Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your personal account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button onClick={handleSaveAccountSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Account
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleChangePassword}>
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage your notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Receive Notifications</Label>
                <Switch
                  id="notifications"
                  checked={isSubscribed}
                  onCheckedChange={(checked) => setIsSubscribed(checked)}
                />
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveNotificationSettings}>
                <Bell className="mr-2 h-4 w-4" />
                Save Notifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Integrations Tab */}
        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API keys for third-party services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="googleMapsApiKey">Google Maps API Key</Label>
                    <div className="relative">
                      <Input
                        id="googleMapsApiKey"
                        type="text"
                        value={googleMapsApiKey}
                        onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                        placeholder="Enter your Google Maps API key"
                      />
                      {!googleMapsApiKey && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <AlertCircle className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Required for mapping features to work</p>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveGoogleMapsApiKey}>
                      <Save className="mr-2 h-4 w-4" />
                      Save API Key
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
                    <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" rel="noopener noreferrer" className="underline">
                      How to get a Google Maps API key
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weatherApiKey">Weather API Key</Label>
                    <div className="relative">
                      <Input
                        id="weatherApiKey"
                        type="text"
                        placeholder="Enter your Weather API key"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Optional: Enhance weather data accuracy</p>
                  </div>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Weather API Key
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Device Integrations</CardTitle>
              <CardDescription>Connect to external device management platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-8 text-center rounded-md">
                <h3 className="text-sm font-medium">Connected Devices</h3>
                <p className="text-xs text-muted-foreground mt-2">No devices connected.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Network Configuration</CardTitle>
              <CardDescription>Manage network settings and device connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="routerIP">Router IP Address</Label>
                <Input id="routerIP" type="text" placeholder="192.168.1.1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subnetMask">Subnet Mask</Label>
                <Input id="subnetMask" type="text" placeholder="255.255.255.0" />
              </div>
              <Button>
                <Router className="mr-2 h-4 w-4" />
                Update Network
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Geographic Location</CardTitle>
              <CardDescription>Set your farm's geographic location for accurate weather data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" type="text" placeholder="34.0522" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" type="text" placeholder="-118.2437" />
              </div>
              <Button>
                <MapPin className="mr-2 h-4 w-4" />
                Set Location
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
