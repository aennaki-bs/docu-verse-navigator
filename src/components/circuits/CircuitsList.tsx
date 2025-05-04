import CircuitsList from "./circuit-list";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { DateRange } from "react-day-picker";

// Define the search column type
type SearchColumn = "code" | "title" | "description";

interface CircuitsListProps {
  onError?: (errorMessage: string) => void;
  searchQuery?: string;
  dateRange?: DateRange;
  flowType?: string;
  searchColumns?: SearchColumn[];
  refreshTrigger?: number; // A counter to trigger refreshes
  isRefreshing?: boolean; // Indicates if the list is currently refreshing
}

const CircuitsListWrapper = ({
  onError,
  searchQuery = "",
  dateRange,
  flowType,
  searchColumns = ["code", "title", "description"],
  refreshTrigger = 0,
  isRefreshing = false,
}: CircuitsListProps) => {
  return (
    <CircuitsList
      onApiError={onError}
      searchQuery={searchQuery}
      dateRange={dateRange}
      flowType={flowType}
      searchColumns={searchColumns}
      refreshTrigger={refreshTrigger}
      isRefreshing={isRefreshing}
    />
  );
};

export default CircuitsListWrapper;
