import { useAuth } from "@/context/AuthContext";
import { useCircuitList } from "./hooks/useCircuitList";
import { CircuitListContent } from "./CircuitListContent";
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

export default function CircuitsList({
  onApiError,
  searchQuery = "",
  dateRange,
  flowType,
  searchColumns = ["code", "title", "description"],
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
    />
  );
}
