import { useState } from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AutoRefreshControlProps {
  isAutoRefreshEnabled: boolean;
  toggleAutoRefresh: () => void;
  interval: number;
  changeInterval: (interval: number) => void;
  isRefreshing: boolean;
  onManualRefresh: () => void;
  lastRefreshed: Date | null;
  getTimeAgoString: () => string;
}

const AutoRefreshControl: React.FC<AutoRefreshControlProps> = ({
  isAutoRefreshEnabled,
  toggleAutoRefresh,
  interval,
  changeInterval,
  isRefreshing,
  onManualRefresh,
  lastRefreshed,
  getTimeAgoString,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const intervalOptions = [
    { value: 5000, label: '5 seconds' },
    { value: 10000, label: '10 seconds' },
    { value: 30000, label: '30 seconds' },
    { value: 60000, label: '1 minute' },
    { value: 300000, label: '5 minutes' },
  ];

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onManualRefresh}
              disabled={isRefreshing}
              className={`h-9 w-9 p-0 ${isRefreshing ? 'animate-spin text-blue-400' : 'text-blue-400 hover:text-blue-300'}`}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Refresh Data</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-1.5 h-9 text-xs ${
              isAutoRefreshEnabled 
                ? 'bg-blue-800/20 text-blue-300 border-blue-700/40' 
                : 'text-blue-400/70'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Auto-refresh</span>
            {isAutoRefreshEnabled && (
              <Badge 
                variant="outline" 
                className="ml-1 py-0 px-1.5 h-5 text-[10px] bg-blue-900/30 border-blue-700/30"
              >
                {(interval / 1000).toFixed(0)}s
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-72 p-4 bg-[#0e183d] border-blue-900/30" 
          side="bottom" 
          align="end"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <h4 className="font-medium text-sm">Auto-refresh</h4>
              </div>
              <Switch 
                checked={isAutoRefreshEnabled} 
                onCheckedChange={toggleAutoRefresh}
              />
            </div>
            
            {isAutoRefreshEnabled && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-300">Refresh interval:</span>
                  <Select
                    value={interval.toString()}
                    onValueChange={(value) => changeInterval(parseInt(value))}
                    disabled={!isAutoRefreshEnabled}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs bg-blue-900/20 border-blue-800/30">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      {intervalOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()} className="text-xs">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-blue-950/40 p-2 rounded-md">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-300">Last refreshed:</span>
                    <span className="text-white">
                      {getTimeAgoString()}
                    </span>
                  </div>
                  {lastRefreshed && (
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-blue-300">Time:</span>
                      <span className="text-blue-200">
                        {lastRefreshed.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AutoRefreshControl; 