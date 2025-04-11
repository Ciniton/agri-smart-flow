
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { BarChart, LineChart, PieChart, Download, Calendar as CalendarIcon, Share2, Printer, ArrowDownCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

// Import recharts components for data visualization
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Legend,
  Line 
} from 'recharts';

const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  // Mock data for water usage report
  const waterUsageData = [
    { date: 'Week 1', usage: 2500, rainfall: 420, budget: 3000 },
    { date: 'Week 2', usage: 3200, rainfall: 380, budget: 3000 },
    { date: 'Week 3', usage: 2800, rainfall: 500, budget: 3000 },
    { date: 'Week 4', usage: 3800, rainfall: 120, budget: 3000 },
    { date: 'Week 5', usage: 2200, rainfall: 680, budget: 3000 },
  ];

  // Mock data for soil moisture report
  const soilMoistureData = [
    { date: 'Mon', north: 65, east: 72, south: 58, west: 62 },
    { date: 'Tue', north: 68, east: 74, south: 57, west: 64 },
    { date: 'Wed', north: 70, east: 70, south: 60, west: 67 },
    { date: 'Thu', north: 72, east: 68, south: 63, west: 69 },
    { date: 'Fri', north: 69, east: 65, south: 66, west: 64 },
    { date: 'Sat', north: 67, east: 63, south: 64, west: 62 },
    { date: 'Sun', north: 65, east: 67, south: 62, west: 60 },
  ];

  // Mock data for efficiency report
  const efficiencyData = [
    { name: 'North Field', efficiency: 88 },
    { name: 'East Field', efficiency: 76 },
    { name: 'South Field', efficiency: 92 },
    { name: 'West Field', efficiency: 84 },
  ];

  // Mock data for cost analysis
  const costAnalysisData = [
    { date: 'Jan', water: 420, energy: 180, total: 600 },
    { date: 'Feb', water: 380, energy: 160, total: 540 },
    { date: 'Mar', water: 450, energy: 190, total: 640 },
    { date: 'Apr', water: 520, energy: 220, total: 740 },
    { date: 'May', water: 650, energy: 250, total: 900 },
    { date: 'Jun', water: 750, energy: 290, total: 1040 },
  ];

  const handleExportReport = (reportType: string) => {
    toast({
      title: "Exporting Report",
      description: `${reportType} report is being exported to CSV.`,
    });
  };

  const handlePrintReport = (reportType: string) => {
    toast({
      title: "Printing Report",
      description: `${reportType} report is being prepared for printing.`,
    });
  };

  const handleShareReport = (reportType: string) => {
    toast({
      title: "Share Report",
      description: `Share options for ${reportType} report.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">View analytics and reports</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-1 md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Report Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div>
                <p className="text-sm font-medium mb-2">Start Date</p>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  className="rounded-md border"
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">End Date</p>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  className="rounded-md border"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => handleExportReport('Current')}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => handlePrintReport('Current')}>
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => handleShareReport('Current')}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Report
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="water" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="water">Water Usage</TabsTrigger>
          <TabsTrigger value="soil">Soil Moisture</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="water" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Water Usage Over Time</CardTitle>
              <CardDescription>
                Comparison of water usage, rainfall, and water budget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={waterUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="usage" name="Water Usage (L)" fill="#1E88E5" />
                    <Bar dataKey="rainfall" name="Rainfall (L)" fill="#43A047" />
                    <Line type="monotone" dataKey="budget" name="Water Budget (L)" stroke="#FFC107" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Total Water Usage</p>
                      <p className="text-2xl font-bold">14,500 L</p>
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Total Rainfall</p>
                      <p className="text-2xl font-bold">2,100 L</p>
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Water Saved</p>
                      <p className="text-2xl font-bold text-green-500">2,400 L</p>
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Efficiency</p>
                      <p className="text-2xl font-bold">84%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Water Usage by Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">North Field - Zone 1</p>
                      <p className="text-sm text-muted-foreground">4,200 L (29%)</p>
                    </div>
                    <div className="w-1/2 bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: '29%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">East Field - Zone 2</p>
                      <p className="text-sm text-muted-foreground">3,800 L (26%)</p>
                    </div>
                    <div className="w-1/2 bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: '26%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">South Field - Zone 3</p>
                      <p className="text-sm text-muted-foreground">3,400 L (23%)</p>
                    </div>
                    <div className="w-1/2 bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">West Field - Zone 4</p>
                      <p className="text-sm text-muted-foreground">3,100 L (22%)</p>
                    </div>
                    <div className="w-1/2 bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: '22%' }}></div>
                    </div>
                  </div>
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
                Soil moisture levels across different fields
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={soilMoistureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="north" name="North Field" stroke="#1E88E5" strokeWidth={2} />
                    <Line type="monotone" dataKey="east" name="East Field" stroke="#43A047" strokeWidth={2} />
                    <Line type="monotone" dataKey="south" name="South Field" stroke="#FFC107" strokeWidth={2} />
                    <Line type="monotone" dataKey="west" name="West Field" stroke="#E53935" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="efficiency" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Irrigation Efficiency by Field</CardTitle>
                <CardDescription>
                  Percentage of water effectively used by crops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={efficiencyData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="efficiency" name="Efficiency (%)" fill="#1E88E5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Efficiency Breakdown</CardTitle>
                <CardDescription>
                  Factors affecting irrigation efficiency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Soil Type Suitability</span>
                    <span className="text-sm">92%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Irrigation Timing</span>
                    <span className="text-sm">85%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Water Distribution</span>
                    <span className="text-sm">78%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Weather Adaptation</span>
                    <span className="text-sm">88%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">System Maintenance</span>
                    <span className="text-sm">65%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="cost" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
              <CardDescription>
                Water and energy costs over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={costAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="water" stackId="1" name="Water Cost ($)" stroke="#1E88E5" fill="#1E88E5" />
                    <Area type="monotone" dataKey="energy" stackId="1" name="Energy Cost ($)" stroke="#43A047" fill="#43A047" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Water Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$3,170</div>
                <p className="text-muted-foreground text-sm">YTD</p>
                <div className="mt-4 text-green-500 flex items-center">
                  <ArrowDownCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">12% from last year</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Energy Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$1,090</div>
                <p className="text-muted-foreground text-sm">YTD</p>
                <div className="mt-4 text-green-500 flex items-center">
                  <ArrowDownCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">8% from last year</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Cost per Acre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$212</div>
                <p className="text-muted-foreground text-sm">Average</p>
                <div className="mt-4 text-green-500 flex items-center">
                  <ArrowDownCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">15% from last year</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
