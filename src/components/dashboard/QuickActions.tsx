
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, AlertCircle, RefreshCw, PowerOff, Play, Pause, CalendarClock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface QuickActionsProps {
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ className }) => {
  const [irrigationStatus, setIrrigationStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  const [isEmergencyStop, setIsEmergencyStop] = useState(false);
  const [isScheduleActive, setIsScheduleActive] = useState(true);
  
  const handleStartIrrigation = () => {
    if (isEmergencyStop) {
      toast({
        title: "System Locked",
        description: "Emergency stop is active. Reset the system first.",
        variant: "destructive"
      });
      return;
    }
    
    setIrrigationStatus('running');
    toast({
      title: "Irrigation Started",
      description: "All configured zones are now being irrigated."
    });
  };
  
  const handlePauseIrrigation = () => {
    if (irrigationStatus === 'running') {
      setIrrigationStatus('paused');
      toast({
        title: "Irrigation Paused",
        description: "Irrigation has been temporarily paused. Resume when ready."
      });
    } else if (irrigationStatus === 'paused') {
      setIrrigationStatus('running');
      toast({
        title: "Irrigation Resumed",
        description: "Irrigation has been resumed."
      });
    }
  };
  
  const handleEmergencyStop = () => {
    setIrrigationStatus('idle');
    setIsEmergencyStop(true);
    toast({
      title: "EMERGENCY STOP",
      description: "All irrigation systems have been stopped. Reset to continue normal operation.",
      variant: "destructive"
    });
  };
  
  const handleReset = () => {
    setIrrigationStatus('idle');
    setIsEmergencyStop(false);
    toast({
      title: "System Reset",
      description: "The irrigation system has been reset and is ready for operation."
    });
  };
  
  const toggleSchedule = () => {
    setIsScheduleActive(!isScheduleActive);
    toast({
      title: isScheduleActive ? "Schedule Deactivated" : "Schedule Activated",
      description: isScheduleActive 
        ? "Automatic irrigation schedule has been turned off." 
        : "Automatic irrigation schedule has been turned on."
    });
  };

  return (
    <Card className={cn("h-full shadow-md border-primary/10 hover:shadow-lg transition-shadow duration-300", className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Droplets className="mr-2 h-5 w-5 text-primary" />
          Quick Actions
          {irrigationStatus !== 'idle' && (
            <span className={cn(
              "ml-auto text-sm px-2 py-0.5 rounded-full",
              irrigationStatus === 'running' ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
            )}>
              {irrigationStatus === 'running' ? "Running" : "Paused"}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className={cn(
              "flex flex-col items-center justify-center h-24 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all",
              irrigationStatus === 'running' && "border-green-500/50 bg-green-50 hover:bg-green-100 hover:border-green-500"
            )}
            onClick={handleStartIrrigation}
            disabled={irrigationStatus === 'running' || isEmergencyStop}
          >
            <Play size={24} className={cn(
              "mb-2 text-green-600 transition-transform", 
              irrigationStatus === 'running' && "scale-110"
            )} />
            <span className="text-sm">Start Irrigation</span>
          </Button>
          
          <Button 
            variant="outline" 
            className={cn(
              "flex flex-col items-center justify-center h-24 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all",
              irrigationStatus === 'paused' && "border-amber-500/50 bg-amber-50 hover:bg-amber-100 hover:border-amber-500"
            )}
            onClick={handlePauseIrrigation}
            disabled={irrigationStatus === 'idle' || isEmergencyStop}
          >
            <Pause size={24} className="mb-2 text-amber-500" />
            <span className="text-sm">{irrigationStatus === 'paused' ? "Resume Irrigation" : "Pause Irrigation"}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className={cn(
              "flex flex-col items-center justify-center h-24 transition-all",
              isEmergencyStop 
                ? "border-red-500 bg-red-50 hover:bg-red-100" 
                : "border-destructive/30 hover:border-destructive hover:bg-destructive/5"
            )}
            onClick={isEmergencyStop ? handleReset : handleEmergencyStop}
          >
            {isEmergencyStop ? (
              <>
                <RefreshCw size={24} className="mb-2 text-primary" />
                <span className="text-sm">Reset System</span>
              </>
            ) : (
              <>
                <PowerOff size={24} className="mb-2 text-destructive" />
                <span className="text-sm">Emergency Stop</span>
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className={cn(
              "flex flex-col items-center justify-center h-24 transition-all",
              isScheduleActive 
                ? "border-primary/30 hover:border-primary hover:bg-primary/5" 
                : "border-gray-300 bg-gray-50 text-gray-500"
            )}
            onClick={toggleSchedule}
          >
            {isScheduleActive ? (
              <>
                <CalendarClock size={24} className="mb-2 text-primary" />
                <span className="text-sm">Schedule Active</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={24} className="mb-2 text-gray-400" />
                <span className="text-sm">Activate Schedule</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
