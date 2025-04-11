
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { User, CreditCard, CalendarClock, Upload, Check, AlertTriangle } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data - in a real app, this would come from your auth context
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Farms',
    role: 'Farm Manager',
    avatar: '',
    subscription: {
      plan: 'Professional',
      status: 'active',
      nextBilling: '2025-05-12',
      paymentMethod: 'Visa ending in 4242'
    }
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully."
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form values to original data
  };

  const handleUploadAvatar = () => {
    // In a real app, this would trigger a file upload dialog
    toast({
      title: "Upload Profile Picture",
      description: "This would open a file picker in a complete implementation."
    });
  };

  const handleUpgradeSubscription = () => {
    toast({
      title: "Upgrade Subscription",
      description: "This would redirect to a payment page in a complete implementation."
    });
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Cancel Subscription",
      description: "Your subscription will remain active until the end of the billing period."
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and subscription</p>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="text-4xl">{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={handleUploadAvatar}>
                  <Upload className="mr-2 h-4 w-4" />
                  Change Picture
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Personal Information</CardTitle>
                  {!isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={userData.name} 
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        disabled={!isEditing} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Contact support to change your email address</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={userData.phone} 
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Farm/Company Name</Label>
                      <Input 
                        id="company" 
                        value={userData.company}
                        onChange={(e) => setUserData({...userData, company: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input 
                        id="role" 
                        value={userData.role}
                        onChange={(e) => setUserData({...userData, role: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Subscription Plan</CardTitle>
                <Badge className="bg-green-500">{userData.subscription.status === 'active' ? 'Active' : 'Inactive'}</Badge>
              </div>
              <CardDescription>Manage your subscription details and payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{userData.subscription.plan} Plan</h3>
                    <p className="text-muted-foreground">All features included with automated irrigation control</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" /> 
                    <span>Unlimited field mapping</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" /> 
                    <span>Advanced irrigation control</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" /> 
                    <span>Weather data integration</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" /> 
                    <span>Up to 25 connected devices</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-muted-foreground flex items-center">
                      <CalendarClock className="h-4 w-4 mr-2" />
                      Next billing date: {userData.subscription.nextBilling}
                    </p>
                    <p className="text-muted-foreground flex items-center mt-1">
                      <CreditCard className="h-4 w-4 mr-2" />
                      {userData.subscription.paymentMethod}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button onClick={handleUpgradeSubscription}>
                      Upgrade Plan
                    </Button>
                    <Button variant="outline" onClick={handleCancelSubscription}>
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Payment Method Update</h4>
                    <p className="text-sm text-amber-700">To update your payment method, please contact our billing department at billing@example.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your past invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-4 py-2 font-medium border-b">
                  <div>Date</div>
                  <div>Description</div>
                  <div>Amount</div>
                  <div className="text-right">Status</div>
                </div>
                <div className="grid grid-cols-4 py-3 border-b">
                  <div>Apr 12, 2025</div>
                  <div>Professional Plan - Monthly</div>
                  <div>$29.00</div>
                  <div className="text-right"><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge></div>
                </div>
                <div className="grid grid-cols-4 py-3 border-b">
                  <div>Mar 12, 2025</div>
                  <div>Professional Plan - Monthly</div>
                  <div>$29.00</div>
                  <div className="text-right"><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge></div>
                </div>
                <div className="grid grid-cols-4 py-3 border-b">
                  <div>Feb 12, 2025</div>
                  <div>Professional Plan - Monthly</div>
                  <div>$29.00</div>
                  <div className="text-right"><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
