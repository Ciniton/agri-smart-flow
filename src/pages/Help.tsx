
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, BookOpen, HelpCircle, MessageSquare, PhoneCall, FileText, Video, ChevronDown, Mail, GraduationCap } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const faqItems = [
  {
    question: "How do I set up a new irrigation schedule?",
    answer: "To set up a new irrigation schedule, navigate to the Irrigation Control page, click on the 'Schedules' tab, and then click the 'Add Schedule' button. Fill in the required details for zone, start time, duration, and days, then save your schedule."
  },
  {
    question: "What should I do if a device shows offline status?",
    answer: "If a device shows an offline status, first check the physical device for any obvious issues. Then, try refreshing the device list by clicking the 'Refresh' button on the Devices page. If the device remains offline, check its power source, network connection, and signal strength. For persistent issues, diagnose the device through the device detail page or contact support."
  },
  {
    question: "How can I interpret the soil moisture readings?",
    answer: "Soil moisture readings are displayed as percentages, with higher percentages indicating more moisture in the soil. Optimal moisture levels vary by crop type and soil composition, but generally: 0-30% is very dry, 30-50% is moderately dry, 50-70% is ideal for most crops, and 70-100% may indicate over-watering. The Reports section provides historical moisture data for analysis."
  },
  {
    question: "Can I control the system remotely?",
    answer: "Yes, the system is designed for remote access. You can control irrigation schedules, view real-time data, and receive alerts from anywhere using a web browser or our mobile app. Ensure you have a stable internet connection for reliable remote control."
  },
  {
    question: "How do I add a new zone to my field map?",
    answer: "To add a new zone, go to the Field Mapping page and select the 'Irrigation Zones' tab. Click the 'Add Zone' button, then use the drawing tools on the map to outline your new zone. You can define properties like name, irrigation type, and flow rate for the zone before saving."
  },
  {
    question: "What do the different alert priorities mean?",
    answer: "Alert priorities indicate the urgency of the notification: Critical (red) requires immediate attention as it may indicate system failure or damage. High (amber) indicates important issues that should be addressed soon. Medium (blue) denotes informational alerts that may require eventual action. Low (gray) indicates minor notifications or status updates."
  },
];

const Help: React.FC = () => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.elements.namedItem('searchQuery') as HTMLInputElement;
    
    toast({
      title: "Search Results",
      description: `Showing results for "${searchInput.value}"`,
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Your support request has been submitted. We'll respond shortly.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground mt-1">Find answers and support resources</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                name="searchQuery"
                placeholder="Search for help articles, videos, or topics..."
                className="pl-10 pr-24"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Button className="absolute right-1 top-1" size="sm">
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg mb-2">Getting Started</CardTitle>
            <p className="text-sm text-muted-foreground">
              New to the system? Learn the basics with our starter guides.
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg mb-2">User Guides</CardTitle>
            <p className="text-sm text-muted-foreground">
              Detailed guides for all features and functionality.
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg mb-2">Video Tutorials</CardTitle>
            <p className="text-sm text-muted-foreground">
              Visual instructions for common tasks and procedures.
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg mb-2">Documentation</CardTitle>
            <p className="text-sm text-muted-foreground">
              Technical specifications and reference materials.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Find quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqItems.map((item, index) => (
              <Collapsible key={index} className="border rounded-md">
                <CollapsibleTrigger className="flex justify-between items-center w-full p-4 hover:bg-muted text-left">
                  <h3 className="font-medium">{item.question}</h3>
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 text-sm text-muted-foreground border-t">
                  {item.answer}
                </CollapsibleContent>
              </Collapsible>
            ))}
            
            <div className="text-center mt-6">
              <Button variant="outline">
                View All FAQs
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Need more help? Reach out to our support team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input id="subject" placeholder="Briefly describe your issue" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  placeholder="Please provide details about your issue"
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
              </div>
              
              <Button type="submit" className="w-full">
                Submit Request
              </Button>
            </form>
            
            <div className="pt-4 border-t space-y-4">
              <h3 className="font-medium">Additional Support Options</h3>
              
              <div className="flex items-center space-x-3">
                <PhoneCall className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@agrismartflow.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Available 9am-5pm PT, Mon-Fri</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
