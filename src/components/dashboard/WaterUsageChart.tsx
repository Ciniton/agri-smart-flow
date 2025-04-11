
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface WaterUsageData {
  date: string;
  actual: number;
  optimal: number;
}

interface WaterUsageChartProps {
  data: WaterUsageData[];
  className?: string;
}

const WaterUsageChart: React.FC<WaterUsageChartProps> = ({ data, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Water Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
                tickFormatter={(value) => `${value}L`}
              />
              <Tooltip 
                formatter={(value) => [`${value}L`, undefined]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="optimal" 
                stroke="#43A047" 
                fill="#43A047" 
                fillOpacity={0.1} 
                strokeWidth={2}
                name="Optimal Usage"
              />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#1E88E5" 
                fill="#1E88E5" 
                fillOpacity={0.3} 
                strokeWidth={2}
                name="Actual Usage"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterUsageChart;
