import { useState } from 'react';
import { useActionManagement } from '@/hooks/useActionManagement';
import { ActionFormDialog } from '@/components/actions/dialogs/ActionFormDialog';
import { DeleteActionDialog } from '@/components/actions/dialogs/DeleteActionDialog';
import { ActionsTable } from '@/components/actions/ActionsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Action, ActionForm } from '@/models/action';
import { Plus } from 'lucide-react';

export default function ActionsManagementPage() {
  const { actions, isLoading, createAction, updateAction, deleteAction } = useActionManagement();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);

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
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="bg-[#0f1642] border-blue-900/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xl font-bold text-white">Actions Management</CardTitle>
          <Button 
            onClick={() => { setSelectedAction(null); setIsFormOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Action
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="w-full flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : actions.length === 0 ? (
            <div className="text-center py-12 bg-blue-900/10 rounded-lg border border-blue-900/30">
              <h3 className="text-xl font-medium mb-2 text-white">No Actions Found</h3>
              <p className="text-blue-300 mb-4">Get started by creating your first action</p>
              <Button 
                onClick={() => { setSelectedAction(null); setIsFormOpen(true); }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Action
              </Button>
            </div>
          ) : (
            <ActionsTable
              actions={actions}
              onEditAction={handleEditAction}
              onDeleteAction={handleDeleteAction}
            />
          )}
        </CardContent>
      </Card>

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
