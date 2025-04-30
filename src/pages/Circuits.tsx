import CircuitsList from "@/components/circuits/CircuitsList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  InfoIcon,
  Lock,
  AlertCircle,
  Plus,
  Search,
  Calendar,
  Filter,
  CalendarDays,
  Columns,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateCircuitDialog from "@/components/circuits/CreateCircuitDialog";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Available search columns
type SearchColumn = "code" | "title" | "description";

export default function CircuitsPage() {
  const { user } = useAuth();
  const [apiError, setApiError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [flowType, setFlowType] = useState<string | undefined>(undefined);
  const [searchColumns, setSearchColumns] = useState<SearchColumn[]>([
    "code",
    "title",
    "description",
  ]);
  const isSimpleUser = user?.role === "SimpleUser";

  // For dialog open/close state and refetch trigger
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshCircuits, setRefreshCircuits] = useState(0);

  // Clear any API errors when component mounts or when user changes
  useEffect(() => {
    setApiError("");
  }, [user]);

  // Function to handle API errors from child components
  const handleApiError = (errorMessage: string) => {
    setApiError(errorMessage);
  };

  // Refetch circuits list after creation
  const handleCircuitCreated = () => {
    setRefreshCircuits((c) => c + 1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setDateRange(undefined);
    setFlowType(undefined);
  };

  // Toggle a search column
  const toggleSearchColumn = (column: SearchColumn) => {
    setSearchColumns((prev) => {
      if (prev.includes(column)) {
        // Don't allow removing the last column
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== column);
      } else {
        return [...prev, column];
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      <CreateCircuitDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleCircuitCreated}
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold mb-2 bg-gradient-to-r from-blue-200 to-purple-200 text-transparent bg-clip-text">
            Circuit Management
          </h1>
          <p className="text-gray-400">
            {isSimpleUser
              ? "View document workflow circuits"
              : "Create and manage document workflow circuits"}
          </p>
        </div>

        {!isSimpleUser && (
          <Button
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> New Circuit
          </Button>
        )}
      </div>

      {apiError && (
        <Alert
          variant="destructive"
          className="mb-4 border-red-800 bg-red-950/50 text-red-300"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4 bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search className="h-4 w-4 text-blue-400" />
            <h2 className="text-blue-300 font-medium">Search Circuits</h2>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 max-w-xl w-full">
              <Input
                placeholder={`Search by ${searchColumns
                  .map((c) =>
                    c === "code"
                      ? "Code"
                      : c === "title"
                      ? "Title"
                      : "Description"
                  )
                  .join(", ")}...`}
                className="bg-[#0a1033]/80 border-blue-800/50 text-blue-100 pl-4 pr-10 focus:border-blue-500 focus:ring-blue-500/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-blue-400 border-blue-500 hover:text-blue-300"
                >
                  <Columns className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-3 bg-[#111633] border-blue-900/50">
                <div className="space-y-4">
                  <h4 className="font-medium text-blue-300 mb-2">
                    Search In Columns
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="search-code"
                        checked={searchColumns.includes("code")}
                        onCheckedChange={() => toggleSearchColumn("code")}
                        className="border-blue-500/50 data-[state=checked]:bg-blue-600"
                      />
                      <label
                        htmlFor="search-code"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-100"
                      >
                        Circuit Code
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="search-title"
                        checked={searchColumns.includes("title")}
                        onCheckedChange={() => toggleSearchColumn("title")}
                        className="border-blue-500/50 data-[state=checked]:bg-blue-600"
                      />
                      <label
                        htmlFor="search-title"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-100"
                      >
                        Title
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="search-description"
                        checked={searchColumns.includes("description")}
                        onCheckedChange={() =>
                          toggleSearchColumn("description")
                        }
                        className="border-blue-500/50 data-[state=checked]:bg-blue-600"
                      />
                      <label
                        htmlFor="search-description"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-100"
                      >
                        Description
                      </label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
              className="w-auto"
              align="end"
            >
              <Button
                variant="outline"
                size="icon"
                className={`${
                  dateRange
                    ? "text-blue-400 border-blue-500"
                    : "text-gray-400 border-blue-900/30"
                } hover:text-blue-300`}
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </DateRangePicker>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`${
                    flowType
                      ? "text-blue-400 border-blue-500"
                      : "text-gray-400 border-blue-900/30"
                  } hover:text-blue-300`}
                  size="icon"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-3 bg-[#111633] border-blue-900/50">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-300 mb-2">Flow Type</h4>
                  <Select value={flowType} onValueChange={setFlowType}>
                    <SelectTrigger className="bg-blue-900/30 border-blue-800/60 text-blue-200">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111633] border-blue-900/50">
                      <SelectItem value="sequential">Sequential</SelectItem>
                      <SelectItem value="parallel">Parallel</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    className="w-full mt-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                    onClick={() => setFlowType(undefined)}
                  >
                    Clear selection
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {(searchQuery || dateRange || flowType) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          {searchColumns.length < 3 && (
            <Badge
              variant="outline"
              className="bg-blue-900/20 text-blue-300 border-blue-500/30 flex gap-1"
            >
              <Columns className="h-3.5 w-3.5" />
              Searching in:{" "}
              {searchColumns
                .map((c) =>
                  c === "code"
                    ? "Code"
                    : c === "title"
                    ? "Title"
                    : "Description"
                )
                .join(", ")}
            </Badge>
          )}

          {dateRange && (
            <Badge
              variant="outline"
              className="bg-blue-900/20 text-blue-300 border-blue-500/30 flex gap-1"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM d, yyyy")} -{" "}
                    {format(dateRange.to, "MMM d, yyyy")}
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
          )}

          {flowType && (
            <Badge
              variant="outline"
              className="bg-blue-900/20 text-blue-300 border-blue-500/30 flex gap-1"
            >
              <Filter className="h-3.5 w-3.5" />
              {flowType === "sequential" ? "Sequential" : "Parallel"}
              <button
                onClick={() => setFlowType(undefined)}
                className="ml-1 hover:text-blue-200"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      </div>

      <CircuitsList
        onApiError={handleApiError}
        searchQuery={searchQuery}
        dateRange={dateRange}
        flowType={flowType}
        searchColumns={searchColumns}
        key={refreshCircuits}
      />
    </div>
  );
}
