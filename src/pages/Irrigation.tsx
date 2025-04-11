import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

const data = [
  { name: "12:00 AM", uv: 4000, pv: 2400, amt: 2400 },
  { name: "4:00 AM", uv: 3000, pv: 1398, amt: 2210 },
  { name: "8:00 AM", uv: 2000, pv: 9800, amt: 2290 },
  { name: "12:00 PM", uv: 2780, pv: 3908, amt: 2000 },
  { name: "4:00 PM", uv: 1890, pv: 4800, amt: 2181 },
  { name: "8:00 PM", uv: 2390, pv: 3800, amt: 2500 },
  { name: "12:00 AM", uv: 3490, pv: 4300, amt: 2100 },
];

const Irrigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [manualMode, setManualMode] = useState(false);
  const [irrigationLevel, setIrrigationLevel] = useState(50);
  const [selectedZone, setSelectedZone] = useState('Zone A');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleManualModeToggle = () => {
    setManualMode(!manualMode);
  };

  const handleIrrigationLevelChange = (value: number[]) => {
    setIrrigationLevel(value[0]);
  };

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Irrigation Control</h1>
        <p className="text-muted-foreground mt-1">Manage and monitor your irrigation system</p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Real-Time Monitoring</CardTitle>
                <CardDescription>View live data from your sensors</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={data}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex justify-between mt-4">
                  <div>
                    <p className="text-sm font-medium">Soil Moisture</p>
                    <p className="text-2xl font-bold">68%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Water Level</p>
                    <p className="text-2xl font-bold">82%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Temperature</p>
                    <p className="text-2xl font-bold">24°C</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Irrigation Control</CardTitle>
                <CardDescription>Manually control your irrigation system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="manualMode">Manual Mode</Label>
                  <Checkbox
                    id="manualMode"
                    checked={manualMode}
                    onCheckedChange={handleManualModeToggle}
                  />
                </div>
                <Separator />
                <div>
                  <Label htmlFor="irrigationLevel">Irrigation Level</Label>
                  <TooltipProvider>
                    <div className="flex items-center space-x-2">
                      <Slider
                        id="irrigationLevel"
                        defaultValue={[irrigationLevel]}
                        max={100}
                        step={1}
                        disabled={!manualMode}
                        onValueChange={handleIrrigationLevelChange}
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" disabled={!manualMode}>
                            {irrigationLevel}%
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          Adjust the irrigation level
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
                <Separator />
                <div>
                  <Label htmlFor="zoneSelect">Select Zone</Label>
                  <ZoneSelect onSelect={handleZoneSelect} />
                </div>
                <Button disabled={!manualMode} className="w-full">
                  Start Irrigation
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Irrigation Schedule</CardTitle>
                <CardDescription>View and manage your irrigation schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Calendar and scheduling features will be implemented here.</p>
                <div className="mt-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule Settings</CardTitle>
                <CardDescription>Configure your irrigation schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Scheduling settings will be implemented here.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Irrigation History</CardTitle>
              <CardDescription>View your past irrigation sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>History and reporting features will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ZoneSelectProps {
  onSelect: (zone: string) => void;
}

const zones = ["Zone A", "Zone B", "Zone C"];

const ZoneSelect: React.FC<ZoneSelectProps> = ({ onSelect }) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? zones.find((zone) => zone === value)
            : "Select zone..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search zone..." />
          <CommandList>
            <CommandEmpty>No zone found.</CommandEmpty>
            <CommandGroup>
              {zones.map((zone) => (
                <CommandItem
                  key={zone}
                  value={zone}
                  onSelect={() => {
                    setValue(zone)
                    setOpen(false)
                    onSelect(zone);
                  }}
                >
                  {zone}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Irrigation;
