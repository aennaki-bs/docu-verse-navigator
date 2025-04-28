
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActionsTable } from '@/components/actions/ActionsTable';
import { DeleteActionDialog } from '@/components/actions/dialogs/DeleteActionDialog';
import { ActionFormDialog } from '@/components/actions/dialogs/ActionFormDialog';
import { useActionManagement } from '@/hooks/useActionManagement';
import { Action, ActionForm } from '@/models/action';

export default function ActionsManagementPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);

  const { actions, isLoading, createAction, updateAction, deleteAction } = useActionManagement();

  const handleEditAction = (action: Action) => {
    setSelectedAction(action);
    setIsFormOpen(true);
  };

  const handleDeleteAction = (action: Action) => {
    setSelectedAction(action);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedAction) {
      await deleteAction(selectedAction.id);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleSubmitAction = async (data: ActionForm) => {
    if (selectedAction) {
      await updateAction({ id: selectedAction.id, data });
    } else {
      await createAction(data);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Action Management</h1>
        <Button onClick={() => { setSelectedAction(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Action
        </Button>
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : actions.length === 0 ? (
        <div className="text-center py-12 bg-blue-900/10 rounded-lg border border-blue-900/30">
          <h3 className="text-xl font-medium mb-2">No Actions Found</h3>
          <p className="text-blue-300 mb-4">Get started by creating your first action</p>
          <Button onClick={() => { setSelectedAction(null); setIsFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Action
          </Button>
        </div>
      ) : (
        <ActionsTable
          actions={actions}
          onEditAction={handleEditAction}
          onDeleteAction={handleDeleteAction}
        />
      )}

      <ActionFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        action={selectedAction}
        onSubmit={handleSubmitAction}
      />

      <DeleteActionDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        action={selectedAction}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
