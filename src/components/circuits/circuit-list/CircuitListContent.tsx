import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EditCircuitDialog from "../EditCircuitDialog";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import CircuitDetailsDialog from "../CircuitDetailsDialog";
import { CircuitLoadingState } from "./CircuitLoadingState";
import { CircuitEmptyState } from "./CircuitEmptyState";
import { CircuitsTable } from "./CircuitsTable";
import { useSettings } from "@/context/SettingsContext";

interface CircuitListContentProps {
  circuits: Circuit[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isSimpleUser: boolean;
  searchQuery: string;
  selectedCircuit: Circuit | null;
  editDialogOpen: boolean;
  deleteDialogOpen: boolean;
  detailsDialogOpen: boolean;
  onEdit: (circuit: Circuit) => void;
  onDelete: (circuit: Circuit) => void;
  onViewDetails: (circuit: Circuit) => void;
  setEditDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setDetailsDialogOpen: (open: boolean) => void;
  confirmDelete: () => Promise<void>;
  refetch: () => void;
  hasNoSearchResults?: boolean;
}

export function CircuitListContent({
  circuits,
  isLoading,
  isError,
  isSimpleUser,
  searchQuery,
  selectedCircuit,
  editDialogOpen,
  deleteDialogOpen,
  detailsDialogOpen,
  onEdit,
  onDelete,
  onViewDetails,
  setEditDialogOpen,
  setDeleteDialogOpen,
  setDetailsDialogOpen,
  confirmDelete,
  refetch,
  hasNoSearchResults,
}: CircuitListContentProps) {
  const { theme } = useSettings();

  if (isLoading) {
    return <CircuitLoadingState />;
  }

  if (isError) {
    return (
      <div
        className={`p-8 rounded-lg text-center ${
          theme === "dark"
            ? "text-red-400 bg-red-900/10 border border-red-900/30"
            : "text-red-600 bg-red-50 border border-red-200"
        }`}
      >
        <p>Error loading circuits</p>
        <button
          onClick={refetch}
          className={`mt-4 px-4 py-2 rounded-md text-sm ${
            theme === "dark"
              ? "bg-blue-800 hover:bg-blue-700 text-blue-100"
              : "bg-blue-100 hover:bg-blue-200 text-blue-800"
          }`}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <Card
      className={`w-full shadow-md ${
        theme === "dark"
          ? "bg-[#111633]/70 border-blue-900/30"
          : "bg-white border-blue-200/60"
      }`}
    >
      <CardHeader
        className={`flex flex-row items-center justify-between ${
          theme === "dark"
            ? "border-b border-blue-900/30 bg-blue-900/20"
            : "border-b border-blue-100 bg-blue-50/50"
        }`}
      >
        <CardTitle
          className={`text-xl ${
            theme === "dark" ? "text-blue-100" : "text-blue-700"
          }`}
        >
          Circuits
        </CardTitle>
        {circuits && circuits.length > 0 && (
          <Badge
            variant="outline"
            className={
              theme === "dark"
                ? "bg-blue-900/50 text-blue-300 border-blue-700/50"
                : "bg-blue-100 text-blue-700 border-blue-300"
            }
          >
            {circuits.length} {circuits.length === 1 ? "Circuit" : "Circuits"}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {circuits && circuits.length > 0 ? (
          <CircuitsTable
            circuits={circuits}
            isSimpleUser={isSimpleUser}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetails={onViewDetails}
          />
        ) : (
          <CircuitEmptyState
            searchQuery={searchQuery}
            isSimpleUser={isSimpleUser}
          />
        )}
      </CardContent>

      {selectedCircuit && (
        <>
          {!isSimpleUser && (
            <>
              <EditCircuitDialog
                circuit={selectedCircuit}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={refetch}
              />

              <DeleteConfirmDialog
                title="Delete Circuit"
                description={`Are you sure you want to delete the circuit "${selectedCircuit.title}"? This action cannot be undone.`}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                confirmText="Delete"
                destructive={true}
              />
            </>
          )}

          <CircuitDetailsDialog
            circuit={selectedCircuit}
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
          />
        </>
      )}
    </Card>
  );
}
