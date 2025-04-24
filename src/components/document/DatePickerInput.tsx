
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerInputProps {
  date: Date;
  onDateChange: (date: Date | undefined) => void;
  error?: boolean;
}

export function DatePickerInput({ date, onDateChange, error }: DatePickerInputProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(() => format(date, "yyyy-MM-dd"));

  React.useEffect(() => {
    setInputValue(format(date, "yyyy-MM-dd"));
  }, [date]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    
    const parsedDate = new Date(newValue);
    if (!isNaN(parsedDate.getTime())) {
      onDateChange(parsedDate);
    }
  };

  return (
    <div className="relative w-full">
      <Input
        type="date"
        value={inputValue}
        onChange={handleInputChange}
        className={cn(
          "pr-10 bg-gray-900 border-gray-800 text-white h-12 text-base",
          error ? "border-red-500" : ""
        )}
      />
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 p-0 hover:bg-gray-800"
            )}
            onClick={() => setIsPopoverOpen(true)}
          >
            <CalendarIcon className="h-5 w-5 text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-gray-900 border border-gray-800" 
          align="end"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                onDateChange(newDate);
                setIsPopoverOpen(false);
              }
            }}
            initialFocus
            className={cn("p-3 pointer-events-auto bg-gray-900 text-white")}
            fromYear={1900}
            toYear={2100}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
