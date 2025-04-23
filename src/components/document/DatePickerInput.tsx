
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left h-12 text-base bg-gray-900 border-gray-800 text-white hover:bg-gray-800",
            error ? "border-red-500" : ""
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(date, "MMMM d, yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-gray-900 border border-gray-800" 
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          className={cn("p-3 pointer-events-auto bg-gray-900 text-white")}
        />
      </PopoverContent>
    </Popover>
  );
}
