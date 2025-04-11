
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Bar, 
  Pie, 
  Line, 
  BarChart, 
  PieChart, 
  LineChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell 
} from 'recharts';
import { Download, FileUp, Calendar as CalendarIcon, Filter } from 'lucide-react';

// Mock data for reports
const waterUsageData = [
  { month: 'Jan', volume: 1200, target: 1000 },
  { month: 'Feb', volume: 1100, target: 1000 },
  { month: 'Mar', volume: 1300, target: 1000 },
  { month: 'Apr', volume: 900, target: 1000 },
  { month: 'May', volume: 1500, target: 1000 },
  { month: 'Jun', volume: 1700, target: 1200 },
  { month: 'Jul', volume: 1900, target: 1300 },
  { month: 'Aug', volume: 1800, target: 1300 },
  { month: 'Sep', volume: 1600, target: 1200 },
  { month: 'Oct', volume: 1400, target: 1100 },
  { month: 'Nov', volume: 1100, target: 1000 },
  { month: 'Dec', volume: 1000, target: 1000 },
];

const deviceUsageData = [
  { name: 'Valve Controllers', value: 42 },
  { name: 'Moisture Sensors', value: 28 },
  { name: 'Flow Meters', value: 15 },
  { name: 'Weather Stations', value: 8 },
  { name: 'Pump Controls', value: 7 },
];

const soilMoistureData = [
  { date: '2025-03-01', north: 65, east: 58, south: 72, west: 60 },
  { date: '2025-03-08', north: 68, east: 61, south: 69, west: 63 },
  { date: '2025-03-15', north: 60, east: 57, south: 74, west: 59 },
  { date: '2025-03-22', north: 70, east: 63, south: 71, west: 65 },
  { date: '2025-03-29', north: 72, east: 65, south: 68, west: 69 },
  { date: '2025-04-05', north: 67, east: 60, south: 73, west: 64 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reportPeriod, setReportPeriod] = useState('monthly');
  
  const handleExportReport = () => {
    // In a real app, this would generate and download a report
    alert('Report exported successfully');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">Analytics and data reports for your irrigation system</p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="relative">
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{date ? date.toLocaleDateString() : "Select date"}</span>
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <FileUp className="mr-2 h-4 w-4" />
            Import Data
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="water" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="water">Water Usage</TabsTrigger>
          <TabsTrigger value="devices">Device Usage</TabsTrigger>
          <TabsTrigger value="soil">Soil Moisture</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="water" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Water Usage Over Time</CardTitle>
              <CardDescription>
                Monthly water consumption compared to target usage
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={waterUsageData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" name="Water Used (L)" fill="#3b82f6" />
                  <Bar dataKey="target" name="Target Usage (L)" fill="#93c5fd" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Water Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">15,600 L</div>
                <p className="text-muted-foreground">Last 30 days</p>
                <div className="mt-4 text-sm">
                  <span className="text-green-500 font-medium">8% decrease</span> compared to previous period
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Average Daily Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">520 L</div>
                <p className="text-muted-foreground">Per day</p>
                <div className="mt-4 text-sm">
                  <span className="text-green-500 font-medium">3% decrease</span> compared to previous period
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Water Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">92%</div>
                <p className="text-muted-foreground">Target vs. Actual</p>
                <div className="mt-4 text-sm">
                  <span className="text-green-500 font-medium">5% improvement</span> compared to previous period
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>
                  Breakdown of installed devices by type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={130}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Device Status</CardTitle>
                <CardDescription>
                  Current status of installed devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Active Devices</span>
                      <span className="font-medium">87</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Warning Status</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '8%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Error Status</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '3%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Offline</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-medium mb-2">Device Reliability</h4>
                  <div className="text-3xl font-bold">95.8%</div>
                  <p className="text-muted-foreground text-sm">Average uptime across all devices</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="soil" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Soil Moisture Trends</CardTitle>
              <CardDescription>
                Soil moisture readings across different fields
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={soilMoistureData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="north" name="North Field" stroke="#0088FE" strokeWidth={2} />
                  <Line type="monotone" dataKey="east" name="East Field" stroke="#00C49F" strokeWidth={2} />
                  <Line type="monotone" dataKey="south" name="South Field" stroke="#FFBB28" strokeWidth={2} />
                  <Line type="monotone" dataKey="west" name="West Field" stroke="#FF8042" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">North Field</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">65%</div>
                <p className="text-muted-foreground text-sm">Current moisture</p>
                <div className="mt-2 text-xs">
                  <span className="text-green-500 font-medium">Optimal</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">East Field</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">58%</div>
                <p className="text-muted-foreground text-sm">Current moisture</p>
                <div className="mt-2 text-xs">
                  <span className="text-amber-500 font-medium">Below optimal</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">South Field</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">72%</div>
                <p className="text-muted-foreground text-sm">Current moisture</p>
                <div className="mt-2 text-xs">
                  <span className="text-red-500 font-medium">Above optimal</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">West Field</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">60%</div>
                <p className="text-muted-foreground text-sm">Current moisture</p>
                <div className="mt-2 text-xs">
                  <span className="text-green-500 font-medium">Optimal</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>
                Create customized reports with the metrics you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12 border-2 border-dashed border-muted-foreground/25 rounded-md">
                <h3 className="text-lg font-medium mb-2">Build Your Custom Report</h3>
                <p className="text-muted-foreground mb-6">
                  Select metrics, time periods, and fields to include in your report
                </p>
                <Button>
                  <Filter className="mr-2 h-4 w-4" />
                  Configure Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
