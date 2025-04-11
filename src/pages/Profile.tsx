import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { User, CreditCard, CalendarClock, Upload, Check, AlertTriangle, CreditCard as CreditCardIcon, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingCard, setIsChangingCard] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
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

  // Payment form states
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvc: ''
  });

  // Plan details 
  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 9.99,
      features: ['Basic field mapping', 'Manual irrigation control', 'Weather data', 'Up to 5 connected devices']
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      price: 29.99,
      features: ['Unlimited field mapping', 'Advanced irrigation control', 'Weather data integration', 'Up to 25 connected devices']
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 79.99,
      features: ['Unlimited field mapping', 'AI irrigation optimization', 'Advanced analytics', 'Unlimited connected devices', 'Priority support']
    }
  ];
  
  const [selectedPlan, setSelectedPlan] = useState(plans[1]); // Default to Professional

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
    setIsUpgrading(true);
  };

  const handleProcessPayment = () => {
    // Validate card details
    if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvc) {
      toast({
        title: "Invalid Card Details",
        description: "Please fill in all the card information fields.",
        variant: "destructive"
      });
      return;
    }

    // Process payment (mock)
    toast({
      title: "Payment Processing",
      description: "Processing your payment details..."
    });

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: `You have successfully subscribed to the ${selectedPlan.name}.`
      });
      
      // Update user data with new subscription
      setUserData({
        ...userData,
        subscription: {
          ...userData.subscription,
          plan: selectedPlan.name,
          nextBilling: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
        }
      });
      
      setIsUpgrading(false);
      setIsChangingCard(false);
    }, 1500);
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Subscription Cancelled",
      description: "Your subscription will remain active until the end of the billing period."
    });
    
    // Update subscription status (in a real app, this would call an API)
    setUserData({
      ...userData,
      subscription: {
        ...userData.subscription,
        status: 'cancelled'
      }
    });
    
    setShowCancelDialog(false);
  };

  const handleUpdatePaymentMethod = () => {
    setIsChangingCard(true);
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
                <Badge className={userData.subscription.status === 'active' ? "bg-green-500" : "bg-red-500"}>
                  {userData.subscription.status === 'active' ? 'Active' : 'Canceled'}
                </Badge>
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
                    <Button variant="outline" onClick={() => setShowCancelDialog(true)}>
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={handleUpdatePaymentMethod}>
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Update Payment Method
              </Button>

              {/* Payment Method Change Dialog */}
              <Dialog open={isChangingCard} onOpenChange={setIsChangingCard}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Update Payment Method</DialogTitle>
                    <DialogDescription>
                      Enter your new payment details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardDetails.cardName}
                        onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        value={cardDetails.cardNumber}
                        onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          value={cardDetails.cvc}
                          onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsChangingCard(false)}>Cancel</Button>
                    <Button onClick={handleProcessPayment}>Update Payment Method</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Upgrade Subscription Dialog */}
              <Dialog open={isUpgrading} onOpenChange={setIsUpgrading}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Upgrade Your Subscription</DialogTitle>
                    <DialogDescription>
                      Choose a plan that fits your needs and enter your payment details.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                      <Label>Select a Plan</Label>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {plans.map((plan) => (
                          <Card 
                            key={plan.id} 
                            className={`cursor-pointer hover:border-primary ${selectedPlan.id === plan.id ? 'border-2 border-primary' : ''}`}
                            onClick={() => setSelectedPlan(plan)}
                          >
                            <CardHeader className="p-4">
                              <CardTitle className="text-lg">{plan.name}</CardTitle>
                              <CardDescription>${plan.price}/month</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <ul className="space-y-2 text-sm">
                                {plan.features.map((feature, i) => (
                                  <li key={i} className="flex items-start">
                                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex items-center mb-4">
                        <Lock className="mr-2 h-4 w-4" />
                        <h3 className="font-medium">Payment Details</h3>
                      </div>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="upgCardName">Name on Card</Label>
                          <Input
                            id="upgCardName"
                            placeholder="John Doe"
                            value={cardDetails.cardName}
                            onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="upgCardNumber">Card Number</Label>
                          <Input
                            id="upgCardNumber"
                            placeholder="4242 4242 4242 4242"
                            value={cardDetails.cardNumber}
                            onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="upgExpiryDate">Expiry Date</Label>
                            <Input
                              id="upgExpiryDate"
                              placeholder="MM/YY"
                              value={cardDetails.expiryDate}
                              onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="upgCvc">CVC</Label>
                            <Input
                              id="upgCvc"
                              placeholder="123"
                              value={cardDetails.cvc}
                              onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUpgrading(false)}>Cancel</Button>
                    <Button onClick={handleProcessPayment}>
                      Subscribe to {selectedPlan.name} (${selectedPlan.price}/month)
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Cancel Subscription Confirmation Dialog */}
              <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Cancel Subscription</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel your subscription? 
                      You'll continue to have access until the end of your current billing period.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setShowCancelDialog(false)}>Keep Subscription</Button>
                    <Button variant="destructive" onClick={handleCancelSubscription}>Cancel Subscription</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Have Questions?</h4>
                    <p className="text-sm text-amber-700">For any questions about your subscription, please contact our billing department at billing@example.com</p>
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
