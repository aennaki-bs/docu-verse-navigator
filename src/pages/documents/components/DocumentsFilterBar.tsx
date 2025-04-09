
import { useState } from 'react';
import { useDocumentsFilter } from '../hooks/useDocumentsFilter';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, CalendarDays } from 'lucide-react';
import { format } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export default function DocumentsFilterBar() {
  const { 
    searchQuery, 
    setSearchQuery, 
    dateRange, 
    setDateRange 
  } = useDocumentsFilter();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-lg text-white">Document List</div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300/70" />
            <Input 
              placeholder="Search documents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-blue-900/20 border-blue-800/30 text-white placeholder:text-blue-300/50 w-full focus:border-blue-500"
            />
          </div>
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
            className="w-auto"
            align="end"
          >
            <Button 
              variant="outline" 
              size="icon"
              className={`${dateRange ? "text-blue-400 border-blue-500" : "text-gray-400 border-blue-900/30"} hover:text-blue-300`}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </DateRangePicker>
        </div>
      </div>
      
      {dateRange && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-500/30 flex gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                </>
              ) : (
                format(dateRange.from, "MMM d, yyyy")
              )
            ) : (
              <span>Date Range</span>
            )}
            <button 
              onClick={() => setDateRange(undefined)}
              className="ml-1 hover:text-blue-200"
            >
              ×
            </button>
          </Badge>
        </div>
      )}
    </div>
  );
}
