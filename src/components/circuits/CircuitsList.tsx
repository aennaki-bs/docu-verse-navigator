import CircuitsList from "./circuit-list";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { DateRange } from "react-day-picker";

// Define the search column type
type SearchColumn = "code" | "title" | "description";

interface CircuitsListProps {
  onApiError?: (errorMessage: string) => void;
  searchQuery?: string;
  dateRange?: DateRange;
  flowType?: string;
  searchColumns?: SearchColumn[];
}

const CircuitsListWrapper = ({
  onApiError,
  searchQuery = "",
  dateRange,
  flowType,
  searchColumns = ["code", "title", "description"],
}: CircuitsListProps) => {
  return (
    <CircuitsList
      onApiError={onApiError}
      searchQuery={searchQuery}
      dateRange={dateRange}
      flowType={flowType}
      searchColumns={searchColumns}
    />
  );
};

export default CircuitsListWrapper;
