
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SubscriptionPlans from '@/components/profile/SubscriptionPlans';
import { User, Settings, CreditCard, Bell } from 'lucide-react';

const Profile = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and subscription</p>
        </div>
        <div className="flex items-center space-x-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">Farm Manager</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full flex justify-start border-b pb-px mb-6 space-x-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue="Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Farm Information</CardTitle>
              <CardDescription>Update details about your farm and location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="farm-name">Farm Name</Label>
                  <Input id="farm-name" defaultValue="Green Valley Farm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farm-size">Farm Size (acres)</Label>
                  <Input id="farm-size" type="number" defaultValue="120" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="Fresno, California" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crop-types">Primary Crop Types</Label>
                  <Input id="crop-types" defaultValue="Almonds, Tomatoes, Lettuce" />
                </div>
              </div>
              <div className="pt-4">
                <Button>Save Farm Details</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <SubscriptionPlans />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Configure your application preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Enable dark mode for the application</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="dark-mode" className="sr-only">Dark Mode</Label>
                    <input type="checkbox" id="dark-mode" className="toggle" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Units</p>
                    <p className="text-sm text-muted-foreground">Choose your preferred units system</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="metric" name="units" className="radio" checked />
                      <Label htmlFor="metric">Metric</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="imperial" name="units" className="radio" />
                      <Label htmlFor="imperial">Imperial</Label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-muted-foreground">Set your preferred language</p>
                  </div>
                  <div className="w-[180px]">
                    <select className="w-full px-3 py-2 border rounded-md">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maps & Location</CardTitle>
              <CardDescription>Configure your map and location settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="google-maps-key">Google Maps API Key</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="google-maps-key" 
                      type="password" 
                      defaultValue={localStorage.getItem('googleMapsApiKey') || ''} 
                      placeholder="Enter your Google Maps API key"
                    />
                    <Button>Save Key</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Required for interactive field mapping</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Default Map View</p>
                    <p className="text-sm text-muted-foreground">Choose the default map view type</p>
                  </div>
                  <div className="w-[180px]">
                    <select className="w-full px-3 py-2 border rounded-md">
                      <option value="satellite">Satellite</option>
                      <option value="terrain">Terrain</option>
                      <option value="roadmap">Roadmap</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button>Save Map Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Irrigation Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified about irrigation events and issues</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="irrigation-email" className="checkbox" checked />
                      <Label htmlFor="irrigation-email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="irrigation-push" className="checkbox" checked />
                      <Label htmlFor="irrigation-push">Push</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="irrigation-sms" className="checkbox" />
                      <Label htmlFor="irrigation-sms">SMS</Label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Weather Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified about weather changes</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="weather-email" className="checkbox" checked />
                      <Label htmlFor="weather-email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="weather-push" className="checkbox" checked />
                      <Label htmlFor="weather-push">Push</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="weather-sms" className="checkbox" />
                      <Label htmlFor="weather-sms">SMS</Label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">System Updates</p>
                    <p className="text-sm text-muted-foreground">Get notified about system updates and maintenance</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="system-email" className="checkbox" checked />
                      <Label htmlFor="system-email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="system-push" className="checkbox" />
                      <Label htmlFor="system-push">Push</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="system-sms" className="checkbox" />
                      <Label htmlFor="system-sms">SMS</Label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
