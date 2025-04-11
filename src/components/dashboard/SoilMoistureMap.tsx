
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SoilMoistureMapProps {
  className?: string;
}

const SoilMoistureMap: React.FC<SoilMoistureMapProps> = ({ className }) => {
  const moistureColors = [
    'bg-blue-900',
    'bg-blue-700',
    'bg-blue-500',
    'bg-blue-300',
    'bg-amber-300',
    'bg-amber-400',
    'bg-amber-500',
    'bg-amber-600',
    'bg-red-500',
  ];

  const moistureData = [
    [2, 3, 4, 5, 6, 5, 4, 3],
    [3, 4, 5, 6, 7, 6, 5, 4],
    [4, 5, 6, 7, 8, 7, 6, 5],
    [5, 6, 7, 8, 7, 6, 5, 4],
    [6, 7, 8, 7, 6, 5, 4, 3],
    [5, 6, 7, 6, 5, 4, 3, 2],
    [4, 5, 6, 5, 4, 3, 2, 1],
    [3, 4, 5, 4, 3, 2, 1, 0],
  ];

  const legend = [
    { label: 'Very Dry', value: 0 },
    { label: 'Dry', value: 2 },
    { label: 'Moderate', value: 4 },
    { label: 'Optimal', value: 6 },
    { label: 'Wet', value: 8 },
  ];

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Soil Moisture Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-8 gap-1 mb-4">
            {moistureData.map((row, rowIndex) => (
              <React.Fragment key={`row-${rowIndex}`}>
                {row.map((value, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={cn(
                      "w-full aspect-square rounded-sm",
                      moistureColors[value]
                    )}
                    title={`Row ${rowIndex+1}, Col ${colIndex+1}: ${value} (${value <= 2 ? 'Very Dry' : value <= 4 ? 'Dry' : value <= 6 ? 'Optimal' : 'Wet'})`}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            <div className="h-2 w-full bg-gradient-to-r from-red-500 via-amber-400 to-blue-900 rounded-full" />
          </div>
          
          <div className="flex justify-between w-full mt-1">
            {legend.map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoilMoistureMap;
