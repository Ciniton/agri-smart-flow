
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, AlertCircle, RefreshCw, PowerOff, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ className }) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-24 border-primary/30 hover:border-primary hover:bg-primary/5"
          >
            <Play size={24} className="mb-2 text-green-600" />
            <span className="text-sm">Start Irrigation</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-24 border-primary/30 hover:border-primary hover:bg-primary/5"
          >
            <Pause size={24} className="mb-2 text-amber-500" />
            <span className="text-sm">Pause Irrigation</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-24 border-destructive/30 hover:border-destructive hover:bg-destructive/5"
          >
            <PowerOff size={24} className="mb-2 text-destructive" />
            <span className="text-sm">Stop All Systems</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-24 border-primary/30 hover:border-primary hover:bg-primary/5"
          >
            <RefreshCw size={24} className="mb-2 text-primary" />
            <span className="text-sm">Refresh Data</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
