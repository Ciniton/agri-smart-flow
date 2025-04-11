
import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import DeviceStatusCard from '@/components/dashboard/DeviceStatusCard';
import WeatherCard from '@/components/dashboard/WeatherCard';
import WaterUsageChart from '@/components/dashboard/WaterUsageChart';
import SoilMoistureMap from '@/components/dashboard/SoilMoistureMap';
import IrrigationScheduleCard from '@/components/dashboard/IrrigationScheduleCard';
import QuickActions from '@/components/dashboard/QuickActions';
import { Droplets, Gauge, Clock, ThermometerSun } from 'lucide-react';

// Mock data with proper typing
const deviceData: {
  id: string;
  name: string;
  zone: string;
  status: "healthy" | "warning" | "error" | "offline";
  lastReading: string;
}[] = [
  { id: '1', name: 'Valve Controller A1', zone: 'North Field', status: "healthy", lastReading: '2 min ago' },
  { id: '2', name: 'Moisture Sensor B3', zone: 'East Field', status: "warning", lastReading: '5 min ago' },
  { id: '3', name: 'Weather Station', zone: 'Central', status: "healthy", lastReading: '1 min ago' },
  { id: '4', name: 'Valve Controller C2', zone: 'South Field', status: "error", lastReading: '15 min ago' },
  { id: '5', name: 'Flow Meter M1', zone: 'Irrigation System', status: "healthy", lastReading: '3 min ago' },
  { id: '6', name: 'Pump Control Unit', zone: 'Pump House', status: "offline", lastReading: '1 hr ago' },
];

const waterUsageData = [
  { date: 'Mon', actual: 120, optimal: 100 },
  { date: 'Tue', actual: 140, optimal: 100 },
  { date: 'Wed', actual: 110, optimal: 100 },
  { date: 'Thu', actual: 90, optimal: 100 },
  { date: 'Fri', actual: 130, optimal: 100 },
  { date: 'Sat', actual: 100, optimal: 100 },
  { date: 'Sun', actual: 80, optimal: 100 },
];

const scheduleData: {
  id: string;
  zone: string;
  startTime: string;
  duration: string;
  status: "completed" | "active" | "scheduled";
}[] = [
  { id: '1', zone: 'North Field - Zone 1', startTime: '07:30 AM', duration: '45 min', status: "completed" },
  { id: '2', zone: 'East Field - Zone 3', startTime: '10:15 AM', duration: '30 min', status: "active" },
  { id: '3', zone: 'South Field - Zone 2', startTime: '02:00 PM', duration: '60 min', status: "scheduled" },
  { id: '4', zone: 'West Field - Zone 4', startTime: '05:30 PM', duration: '40 min', status: "scheduled" },
];

const weatherData = {
  location: 'Central Farm',
  temperature: 24,
  condition: "partly-cloudy" as "partly-cloudy" | "sunny" | "rainy" | "cloudy", // Type assertion
  humidity: 65,
  windSpeed: 8,
  forecast: [
    { day: 'Mon', temperature: 24, condition: "partly-cloudy" as "partly-cloudy" | "sunny" | "rainy" | "cloudy" },
    { day: 'Tue', temperature: 27, condition: "sunny" as "partly-cloudy" | "sunny" | "rainy" | "cloudy" },
    { day: 'Wed', temperature: 25, condition: "partly-cloudy" as "partly-cloudy" | "sunny" | "rainy" | "cloudy" },
    { day: 'Thu', temperature: 22, condition: "rainy" as "partly-cloudy" | "sunny" | "rainy" | "cloudy" },
    { day: 'Fri', temperature: 23, condition: "cloudy" as "partly-cloudy" | "sunny" | "rainy" | "cloudy" },
  ],
};

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your irrigation system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Water Usage Today" 
          value="1,240 L" 
          icon={<Droplets size={24} />} 
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard 
          title="Avg. Soil Moisture" 
          value="65%" 
          icon={<Gauge size={24} />} 
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard 
          title="Next Irrigation" 
          value="2h 15m" 
          icon={<Clock size={24} />} 
        />
        <StatCard 
          title="Avg. Temperature" 
          value="24°C" 
          icon={<ThermometerSun size={24} />} 
          trend={{ value: 2, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WaterUsageChart data={waterUsageData} />
        </div>
        <div>
          <WeatherCard {...weatherData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DeviceStatusCard devices={deviceData} />
        <IrrigationScheduleCard schedules={scheduleData} />
        <div className="grid grid-cols-1 gap-6">
          <QuickActions />
          <SoilMoistureMap />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
