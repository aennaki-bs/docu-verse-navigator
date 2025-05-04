import { useState } from 'react';
import { useActionManagement } from '@/hooks/useActionManagement';
import { ActionFormDialog } from '@/components/actions/dialogs/ActionFormDialog';
import { DeleteActionDialog } from '@/components/actions/dialogs/DeleteActionDialog';
import { ActionsTable } from '@/components/actions/ActionsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Action, ActionForm } from '@/models/action';
import { Plus } from 'lucide-react';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import AutoRefreshControl from '@/components/common/AutoRefreshControl';

export function ActionsManagementPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  // Using refreshCount to trigger refresh in the hook
  const { actions, isLoading, createAction, updateAction, deleteAction } = useActionManagement({ 
    refreshTrigger: refreshCount 
  });

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
      setRefreshCount(prev => prev + 1);
    }
  });

  const handleCreate = async (data: ActionForm) => {
    await createAction(data);
  };

  const handleUpdate = async (data: ActionForm) => {
    if (selectedAction) {
      await updateAction({ id: selectedAction.id, data });
    }
  };

  const handleDelete = async () => {
    if (selectedAction) {
      await deleteAction(selectedAction.id);
      setIsDeleteOpen(false);
    }
  };

  const openEditDialog = (action: Action) => {
    setSelectedAction(action);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (action: Action) => {
    setSelectedAction(action);
    setIsDeleteOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-blue-500">Loading actions...</p>
      </div>
    </div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="bg-[#0f1642] border-blue-900/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xl font-bold">Actions Management</CardTitle>
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
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Action
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ActionsTable
            actions={actions}
            onEditAction={openEditDialog}
            onDeleteAction={openDeleteDialog}
            isRefreshing={isRefreshing}
          />
        </CardContent>
      </Card>

      <ActionFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={selectedAction ? handleUpdate : handleCreate}
        action={selectedAction}
      />

      <DeleteActionDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        action={selectedAction}
        onConfirm={handleDelete}
      />
    </div>
  );
}
