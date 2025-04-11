
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SoilLegend: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Soil Types</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-8 text-center rounded-md">
          <h3 className="text-sm font-medium">Soil Type Legend</h3>
          <div className="mt-4 space-y-2 text-left">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-amber-200 mr-2"></div>
              <span className="text-xs">Sandy Soil</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-amber-800 mr-2"></div>
              <span className="text-xs">Clay Soil</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-green-700 mr-2"></div>
              <span className="text-xs">Loam Soil</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-gray-500 mr-2"></div>
              <span className="text-xs">Rocky Soil</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-blue-300 mr-2"></div>
              <span className="text-xs">Silty Soil</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoilLegend;
