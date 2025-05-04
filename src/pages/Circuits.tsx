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
  X,
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
import { useSettings } from "@/context/SettingsContext";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import AutoRefreshControl from "@/components/common/AutoRefreshControl";

// Available search columns
type SearchColumn = "code" | "title" | "description";

export default function CircuitsPage() {
  const { user } = useAuth();
  const { theme } = useSettings();
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

  // Auto-refresh functionality
  const { 
    isRefreshing, 
    isAutoRefreshEnabled, 
    toggleAutoRefresh, 
    interval, 
    changeInterval, 
    lastRefreshed, 
    getTimeAgoString, 
    refresh 
  } = useAutoRefresh({
    enabled: true,
    initialInterval: 30000, // 30 seconds default
    onRefresh: async () => {
      // Trigger a refresh by incrementing the refresh counter
      setRefreshCircuits(prev => prev + 1);
    }
  });

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

  // Check if any filters are active
  const hasActiveFilters = searchQuery || dateRange || flowType;

  return (
    <div className="p-6 space-y-6">
      <CreateCircuitDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleCircuitCreated}
      />

      <div className="flex justify-between items-center">
        <div>
          <h1
            className={`text-3xl font-semibold mb-2 ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-200 to-purple-200 text-transparent bg-clip-text"
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
            }`}
          >
            Circuit Management
          </h1>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            {isSimpleUser
              ? "View document workflow circuits"
              : "Create and manage document workflow circuits"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AutoRefreshControl
            isAutoRefreshEnabled={isAutoRefreshEnabled}
            toggleAutoRefresh={toggleAutoRefresh}
            interval={interval}
            changeInterval={changeInterval}
            isRefreshing={isRefreshing}
            onManualRefresh={refresh}
            lastRefreshed={lastRefreshed}
            getTimeAgoString={getTimeAgoString}
          />

          {!isSimpleUser && (
            <Button
              className={`${
                theme === "dark"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              }`}
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> New Circuit
            </Button>
          )}
        </div>
      </div>

      {apiError && (
        <Alert
          variant="destructive"
          className={
            theme === "dark"
              ? "mb-4 border-red-800 bg-red-950/50 text-red-300"
              : "mb-4 border-red-300 bg-red-50 text-red-700"
          }
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      <div
        className={`flex flex-col gap-4 rounded-lg border p-4 ${
          theme === "dark"
            ? "bg-blue-900/20 border-blue-800/30"
            : "bg-blue-50 border-blue-200/40"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search
              className={`h-4 w-4 ${
                theme === "dark" ? "text-blue-400" : "text-blue-500"
              }`}
            />
            <h2
              className={`font-medium ${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              }`}
            >
              Search Circuits
            </h2>
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
                className={`
                  pr-10 
                  ${
                    theme === "dark"
                      ? "bg-[#0a1033]/80 border-blue-800/50 text-blue-100 focus:border-blue-500 focus:ring-blue-500/30"
                      : "bg-white border-blue-200 text-blue-900 focus:border-blue-500 focus:ring-blue-500/30"
                  }
                `}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                    theme === "dark"
                      ? "text-blue-400 hover:bg-blue-900/50"
                      : "text-blue-500 hover:bg-blue-100"
                  }`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`
                    ${
                      theme === "dark"
                        ? "text-blue-400 border-blue-500 hover:text-blue-300 hover:bg-blue-900/30"
                        : "text-blue-600 border-blue-300 hover:text-blue-700 hover:bg-blue-50"
                    }
                  `}
                >
                  <Columns className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className={`w-48 p-3 ${
                  theme === "dark"
                    ? "bg-[#111633] border-blue-900/50"
                    : "bg-white border-blue-200"
                }`}
              >
                <div className="space-y-4">
                  <h4
                    className={`font-medium mb-2 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-700"
                    }`}
                  >
                    Search In Columns
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="search-code"
                        checked={searchColumns.includes("code")}
                        onCheckedChange={() => toggleSearchColumn("code")}
                        className={`
                          ${
                            theme === "dark"
                              ? "border-blue-500/50 data-[state=checked]:bg-blue-600"
                              : "border-blue-300 data-[state=checked]:bg-blue-500"
                          }
                        `}
                      />
                      <label
                        htmlFor="search-code"
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                          theme === "dark" ? "text-blue-100" : "text-blue-800"
                        }`}
                      >
                        Circuit Code
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="search-title"
                        checked={searchColumns.includes("title")}
                        onCheckedChange={() => toggleSearchColumn("title")}
                        className={`
                          ${
                            theme === "dark"
                              ? "border-blue-500/50 data-[state=checked]:bg-blue-600"
                              : "border-blue-300 data-[state=checked]:bg-blue-500"
                          }
                        `}
                      />
                      <label
                        htmlFor="search-title"
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                          theme === "dark" ? "text-blue-100" : "text-blue-800"
                        }`}
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
                        className={`
                          ${
                            theme === "dark"
                              ? "border-blue-500/50 data-[state=checked]:bg-blue-600"
                              : "border-blue-300 data-[state=checked]:bg-blue-500"
                          }
                        `}
                      />
                      <label
                        htmlFor="search-description"
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                          theme === "dark" ? "text-blue-100" : "text-blue-800"
                        }`}
                      >
                        Description
                      </label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={hasActiveFilters ? "default" : "outline"}
                  className={`
                    ${
                      hasActiveFilters
                        ? theme === "dark"
                          ? "bg-blue-700 text-white hover:bg-blue-600"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                        : theme === "dark"
                        ? "text-blue-400 border-blue-500 hover:text-blue-300 hover:bg-blue-900/30"
                        : "text-blue-600 border-blue-300 hover:text-blue-700 hover:bg-blue-50"
                    }
                  `}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <Badge
                      className={`ml-2 ${
                        theme === "dark"
                          ? "bg-blue-800 text-blue-200"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {
                        [
                          searchQuery ? 1 : 0,
                          dateRange ? 1 : 0,
                          flowType ? 1 : 0,
                        ].filter(Boolean).length
                      }
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className={`w-80 p-4 ${
                  theme === "dark"
                    ? "bg-[#111633] border-blue-900/50"
                    : "bg-white border-blue-200"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-medium ${
                        theme === "dark" ? "text-blue-300" : "text-blue-700"
                      }`}
                    >
                      Filters
                    </h4>
                    {hasActiveFilters && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={clearFilters}
                        className={`text-xs h-8 px-2 py-1 ${
                          theme === "dark"
                            ? "text-blue-400 hover:text-blue-300 hover:bg-blue-950/70"
                            : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        }`}
                      >
                        Clear all
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label
                        className={`text-sm ${
                          theme === "dark" ? "text-blue-300" : "text-blue-700"
                        }`}
                      >
                        Flow Type
                      </label>
                      <Select
                        value={flowType}
                        onValueChange={setFlowType}
                      >
                        <SelectTrigger
                          className={`w-full ${
                            theme === "dark"
                              ? "bg-blue-950/50 border-blue-800/50 text-blue-200"
                              : "bg-white border-blue-200 text-blue-900"
                          }`}
                        >
                          <SelectValue placeholder="Select flow type" />
                        </SelectTrigger>
                        <SelectContent
                          className={`${
                            theme === "dark"
                              ? "bg-[#111633] border-blue-900/50"
                              : "bg-white border-blue-200"
                          }`}
                        >
                          <SelectItem value="sequential">Sequential</SelectItem>
                          <SelectItem value="parallel">Parallel</SelectItem>
                          <SelectItem value="all">All Types</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center">
                        <CalendarDays
                          className={`h-4 w-4 mr-2 ${
                            theme === "dark"
                              ? "text-blue-400"
                              : "text-blue-600"
                          }`}
                        />
                        <label
                          className={`text-sm ${
                            theme === "dark"
                              ? "text-blue-300"
                              : "text-blue-700"
                          }`}
                        >
                          Creation Date Range
                        </label>
                      </div>
                      <DateRangePicker
                        date={dateRange}
                        onDateChange={setDateRange}
                        className="w-full"
                      />
                      {dateRange && dateRange.from && (
                        <div className="flex items-center mt-2">
                          <Badge
                            className={
                              theme === "dark"
                                ? "bg-blue-900/50 text-blue-200 border border-blue-700/50"
                                : "bg-blue-100 text-blue-700 border border-blue-200"
                            }
                          >
                            {dateRange.from
                              ? format(dateRange.from, "MMM dd, yyyy")
                              : ""}
                            {dateRange.to
                              ? ` to ${format(dateRange.to, "MMM dd, yyyy")}`
                              : ""}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDateRange(undefined)}
                            className={`ml-2 h-6 w-6 p-0 rounded-full ${
                              theme === "dark"
                                ? "text-blue-400 hover:bg-blue-900/50"
                                : "text-blue-600 hover:bg-blue-100"
                            }`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Circuit List Component */}
      <CircuitsList
        onError={handleApiError}
        searchQuery={searchQuery}
        searchColumns={searchColumns}
        dateRange={dateRange}
        flowType={flowType}
        refreshTrigger={refreshCircuits}
        isRefreshing={isRefreshing}
      />
    </div>
  );
}
