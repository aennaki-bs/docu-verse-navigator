import { useAuth } from "@/context/AuthContext";
import { useCircuitList } from "./hooks/useCircuitList";
import { CircuitListContent } from "./CircuitListContent";
import { DateRange } from "react-day-picker";
import { useEffect } from "react";

// Define the search column type
type SearchColumn = "code" | "title" | "description";

interface CircuitsListProps {
  onApiError?: (errorMessage: string) => void;
  searchQuery?: string;
  dateRange?: DateRange;
  flowType?: string;
  searchColumns?: SearchColumn[];
  refreshTrigger?: number; // A counter to trigger refreshes
  isRefreshing?: boolean; // Indicates if the list is currently refreshing
}

export default function CircuitsList({
  onApiError,
  searchQuery = "",
  dateRange,
  flowType,
  searchColumns = ["code", "title", "description"],
  refreshTrigger = 0,
  isRefreshing = false,
}: CircuitsListProps) {
  const { user } = useAuth();
  const isSimpleUser = user?.role === "SimpleUser";

  const {
    circuits,
    isLoading,
    isError,
    selectedCircuit,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    detailsDialogOpen,
    setDetailsDialogOpen,
    handleEdit,
    handleDelete,
    handleViewDetails,
    confirmDelete,
    refetch,
  } = useCircuitList({
    onApiError,
    searchQuery,
    dateRange,
    flowType,
    searchColumns,
  });

  // Refetch data when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  return (
    <CircuitListContent
      circuits={circuits}
      isLoading={isLoading}
      isError={isError}
      isSimpleUser={isSimpleUser}
      searchQuery={searchQuery}
      selectedCircuit={selectedCircuit}
      editDialogOpen={editDialogOpen}
      deleteDialogOpen={deleteDialogOpen}
      detailsDialogOpen={detailsDialogOpen}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onViewDetails={handleViewDetails}
      setEditDialogOpen={setEditDialogOpen}
      setDeleteDialogOpen={setDeleteDialogOpen}
      setDetailsDialogOpen={setDetailsDialogOpen}
      confirmDelete={confirmDelete}
      refetch={refetch}
      isRefreshing={isRefreshing}
    />
  );
}
