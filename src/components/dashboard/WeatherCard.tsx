
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, Droplets, Wind } from 'lucide-react';

interface WeatherCardProps {
  location: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy';
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    temperature: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy';
  }>;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  location,
  temperature,
  condition,
  humidity,
  windSpeed,
  forecast,
}) => {
  const getWeatherIcon = (condition: string, size = 24) => {
    switch (condition) {
      case 'sunny':
        return <Sun size={size} className="text-brand-amber" />;
      case 'rainy':
        return <CloudRain size={size} className="text-brand-blue" />;
      case 'cloudy':
        return <Cloud size={size} className="text-gray-400" />;
      case 'partly-cloudy':
        return (
          <div className="relative">
            <Sun size={size} className="text-brand-amber" />
            <Cloud size={size * 0.7} className="text-gray-400 absolute -bottom-1 -right-1" />
          </div>
        );
      default:
        return <Sun size={size} className="text-brand-amber" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium">{location}</p>
              <div className="flex items-center mt-1">
                <span className="text-3xl font-bold mr-1">{temperature}</span>
                <span className="text-xl">°C</span>
              </div>
            </div>
            <div className="text-4xl">
              {getWeatherIcon(condition, 48)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center">
              <Droplets size={16} className="mr-2 text-brand-blue" />
              <span className="text-sm">{humidity}% Humidity</span>
            </div>
            <div className="flex items-center">
              <Wind size={16} className="mr-2 text-gray-500" />
              <span className="text-sm">{windSpeed} km/h</span>
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="text-xs font-medium mb-2">5-Day Forecast</p>
            <div className="grid grid-cols-5 gap-1">
              {forecast.map((day) => (
                <div key={day.day} className="flex flex-col items-center">
                  <span className="text-xs">{day.day}</span>
                  <div className="my-1">{getWeatherIcon(day.condition, 20)}</div>
                  <span className="text-xs font-medium">{day.temperature}°</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
