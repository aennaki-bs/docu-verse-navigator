import { useState } from "react";
import { useActionManagement } from "@/hooks/useActionManagement";
import { useActionFilters } from "@/hooks/useActionFilters";
import { ActionFormDialog } from "@/components/actions/dialogs/ActionFormDialog";
import { DeleteActionDialog } from "@/components/actions/dialogs/DeleteActionDialog";
import { AssignActionDialog } from "@/components/actions/dialogs/AssignActionDialog";
import { ActionsTable } from "@/components/actions/ActionsTable";
import { ActionSearchBar } from "@/components/actions/ActionSearchBar";
import { ActionsBulkBar } from "@/components/actions/ActionsBulkBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Action, CreateActionDto, UpdateActionDto } from "@/models/action";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useSettings } from "@/context/SettingsContext";

export default function ActionsManagementPage() {
  const { theme } = useSettings();
  const { actions, isLoading, createAction, updateAction, deleteAction } =
    useActionManagement();
  const { filteredActions, filters, setFilters } = useActionFilters(actions);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [selectedActions, setSelectedActions] = useState<Action[]>([]);

  // Theme-specific classes
  const cardClass = theme === 'dark' 
    ? "bg-[#0f1642] border-blue-900/30" 
    : "bg-white border-gray-200";
  
  const titleClass = theme === 'dark' 
    ? "text-white" 
    : "text-gray-800";
  
  const buttonClass = theme === 'dark' 
    ? "bg-blue-600 hover:bg-blue-700" 
    : "bg-blue-500 hover:bg-blue-600";
  
  const loadingClass = theme === 'dark' 
    ? "border-blue-500" 
    : "border-blue-600";
  
  const emptyStateClass = theme === 'dark'
    ? "bg-blue-900/10 border-blue-900/30 text-white"
    : "bg-blue-50/50 border-blue-100 text-gray-800";
  
  const emptyStateTextClass = theme === 'dark'
    ? "text-blue-300"
    : "text-blue-600";

  const handleEditAction = (action: Action) => {
    setSelectedAction(action);
    setIsFormOpen(true);
  };

  const handleDeleteAction = (action: Action) => {
    setSelectedAction(action);
    setIsDeleteDialogOpen(true);
  };

  const handleAssignAction = (action: Action) => {
    setSelectedAction(action);
    setIsAssignDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedAction?.actionId) {
      try {
        await deleteAction(selectedAction.actionId);
        setIsDeleteDialogOpen(false);
        toast({
          title: "Success",
          description: "Action deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete action",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmitAction = async (
    data: CreateActionDto | UpdateActionDto
  ) => {
    try {
      if (selectedAction) {
        await updateAction({ id: selectedAction.actionId, data });
        toast({
          title: "Success",
          description: "Action updated successfully",
        });
      } else {
        await createAction(data as CreateActionDto);
        toast({
          title: "Success",
          description: "Action created successfully",
        });
      }
      setIsFormOpen(false);
      setSelectedAction(null);
    } catch (error) {
      toast({
        title: "Error",
        description: selectedAction
          ? "Failed to update action"
          : "Failed to create action",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      // Process deletions sequentially to avoid overwhelming the API
      for (const action of selectedActions) {
        await deleteAction(action.actionId);
      }

      setSelectedActions([]);
      toast({
        title: "Success",
        description: `${selectedActions.length} actions deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some actions",
        variant: "destructive",
      });
    }
  };

  const handleBulkAssign = () => {
    // Open assign dialog for multiple actions
    // For simplicity, we're using the existing dialog
    if (selectedActions.length > 0) {
      setSelectedAction(selectedActions[0]);
      setIsAssignDialogOpen(true);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6 pb-20">
      <Card className={cardClass}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className={`text-xl font-bold ${titleClass}`}>
            Actions Management
          </CardTitle>
          <Button
            onClick={() => {
              setSelectedAction(null);
              setIsFormOpen(true);
            }}
            className={buttonClass}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Action
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <ActionSearchBar
            filters={filters}
            onFiltersChange={setFilters}
            className="mb-4"
            theme={theme}
          />

          {isLoading ? (
            <div className="w-full flex justify-center p-12">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${loadingClass}`}></div>
            </div>
          ) : filteredActions.length === 0 &&
            !filters.query &&
            filters.field === "all" ? (
            <div className={`text-center py-12 rounded-lg border ${emptyStateClass}`}>
              <h3 className={`text-xl font-medium mb-2 ${titleClass}`}>
                No Actions Found
              </h3>
              <p className={`mb-4 ${emptyStateTextClass}`}>
                Get started by creating your first action
              </p>
              <Button
                onClick={() => {
                  setSelectedAction(null);
                  setIsFormOpen(true);
                }}
                className={buttonClass}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Action
              </Button>
            </div>
          ) : filteredActions.length === 0 ? (
            <div className={`text-center py-12 rounded-lg border ${emptyStateClass}`}>
              <h3 className={`text-xl font-medium mb-2 ${titleClass}`}>
                No Matching Actions
              </h3>
              <p className={`mb-4 ${emptyStateTextClass}`}>
                Try adjusting your search filters
              </p>
            </div>
          ) : (
            <ActionsTable
              actions={filteredActions}
              onEditAction={handleEditAction}
              onDeleteAction={handleDeleteAction}
              onAssignAction={handleAssignAction}
              selectedActions={selectedActions}
              onSelectionChange={setSelectedActions}
              theme={theme}
            />
          )}
        </CardContent>
      </Card>

      <ActionFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        action={selectedAction}
        onSubmit={handleSubmitAction}
        theme={theme}
      />

      <DeleteActionDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        action={selectedAction}
        onConfirm={handleDeleteConfirm}
        theme={theme}
      />

      <AssignActionDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        action={selectedAction}
        theme={theme}
        // We're not fetching steps here to fix the issue
        skipStepsFetch={true}
      />

      {selectedActions.length > 0 && (
        <ActionsBulkBar
          selectedCount={selectedActions.length}
          onDelete={handleBulkDelete}
          onAssignToStep={handleBulkAssign}
          theme={theme}
        />
      )}
    </div>
  );
}
