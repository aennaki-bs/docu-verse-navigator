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

            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
              className="w-auto"
              align="end"
            >
              <Button
                variant="outline"
                size="icon"
                className={`
                  ${
                    dateRange
                      ? theme === "dark"
                        ? "text-blue-400 border-blue-500 hover:text-blue-300 hover:bg-blue-900/30"
                        : "text-blue-600 border-blue-300 hover:text-blue-700 hover:bg-blue-50"
                      : theme === "dark"
                      ? "text-gray-400 border-blue-900/30 hover:text-blue-300 hover:bg-blue-900/30"
                      : "text-gray-500 border-gray-300 hover:text-blue-700 hover:bg-blue-50"
                  }
                `}
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </DateRangePicker>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`
                    ${
                      flowType
                        ? theme === "dark"
                          ? "text-blue-400 border-blue-500 hover:text-blue-300 hover:bg-blue-900/30"
                          : "text-blue-600 border-blue-300 hover:text-blue-700 hover:bg-blue-50"
                        : theme === "dark"
                        ? "text-gray-400 border-blue-900/30 hover:text-blue-300 hover:bg-blue-900/30"
                        : "text-gray-500 border-gray-300 hover:text-blue-700 hover:bg-blue-50"
                    }
                  `}
                  size="icon"
                >
                  <Filter className="h-4 w-4" />
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
                    Filter by Flow Type
                  </h4>
                  <Select value={flowType} onValueChange={setFlowType}>
                    <SelectTrigger
                      className={`
                      ${
                        theme === "dark"
                          ? "bg-[#0d1541]/70 border-blue-900/50 text-white"
                          : "bg-white border-blue-200 text-blue-900"
                      }
                    `}
                    >
                      <SelectValue placeholder="Select Flow Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sequential">Sequential</SelectItem>
                      <SelectItem value="parallel">Parallel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
                className={`
                  ${
                    theme === "dark"
                      ? "text-blue-400 border-blue-500 hover:text-blue-300 hover:bg-blue-900/30"
                      : "text-blue-600 border-blue-300 hover:text-blue-700 hover:bg-blue-50"
                  }
                `}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {(dateRange || flowType) && (
          <div className="flex flex-wrap gap-2">
            {dateRange && (
              <Badge
                variant="outline"
                className={`
                  px-3 py-1 ${
                    theme === "dark"
                      ? "bg-blue-900/30 text-blue-200 border-blue-700/50"
                      : "bg-blue-100 text-blue-700 border-blue-200"
                  }
                `}
              >
                <CalendarDays className="h-3 w-3 mr-1" />
                {format(dateRange.from!, "MMM d, yyyy")}
                {dateRange.to && ` - ${format(dateRange.to, "MMM d, yyyy")}`}
                <button
                  onClick={() => setDateRange(undefined)}
                  className="ml-2 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {flowType && (
              <Badge
                variant="outline"
                className={`
                  px-3 py-1 ${
                    theme === "dark"
                      ? "bg-blue-900/30 text-blue-200 border-blue-700/50"
                      : "bg-blue-100 text-blue-700 border-blue-200"
                  }
                `}
              >
                <Filter className="h-3 w-3 mr-1" />
                Flow: {flowType === "sequential" ? "Sequential" : "Parallel"}
                <button
                  onClick={() => setFlowType(undefined)}
                  className="ml-2 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      <CircuitsList
        onApiError={handleApiError}
        searchQuery={searchQuery}
        dateRange={dateRange}
        flowType={flowType}
        searchColumns={searchColumns}
      />
    </div>
  );
}
