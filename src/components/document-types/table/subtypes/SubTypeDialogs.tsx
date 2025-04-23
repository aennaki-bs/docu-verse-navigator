
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { SubType } from '@/models/subType';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface SubTypeDialogsProps {
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  selectedSubType: SubType | null;
  documentTypeId: number;
  onCreateSubmit: (data: any) => void;
  onEditSubmit: (id: number, data: any) => void;
  onDeleteConfirm: (id: number) => void;
}

export default function SubTypeDialogs({
  createDialogOpen,
  setCreateDialogOpen,
  editDialogOpen,
  setEditDialogOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  selectedSubType,
  documentTypeId,
  onCreateSubmit,
  onEditSubmit,
  onDeleteConfirm
}: SubTypeDialogsProps) {
  const [newSubType, setNewSubType] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    isActive: true
  });

  const [editedSubType, setEditedSubType] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  useEffect(() => {
    if (selectedSubType) {
      setEditedSubType({
        name: selectedSubType.name,
        description: selectedSubType.description,
        startDate: new Date(selectedSubType.startDate).toISOString().split('T')[0],
        endDate: new Date(selectedSubType.endDate).toISOString().split('T')[0],
        isActive: selectedSubType.isActive
      });
    }
  }, [selectedSubType]);

  const handleCreateSubmit = () => {
    if (!newSubType.name) {
      toast.error('Name is required');
      return;
    }

    if (!newSubType.startDate || !newSubType.endDate) {
      toast.error('Start and end dates are required');
      return;
    }

    if (new Date(newSubType.startDate) > new Date(newSubType.endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    onCreateSubmit(newSubType);
  };

  const handleEditSubmit = () => {
    if (!selectedSubType) return;

    if (!editedSubType.name) {
      toast.error('Name is required');
      return;
    }

    if (!editedSubType.startDate || !editedSubType.endDate) {
      toast.error('Start and end dates are required');
      return;
    }

    if (new Date(editedSubType.startDate) > new Date(editedSubType.endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    onEditSubmit(selectedSubType.id, editedSubType);
  };

  const resetCreateForm = () => {
    setNewSubType({
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      isActive: true
    });
  };

  return (
    <>
      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={(open) => {
        setCreateDialogOpen(open);
        if (!open) resetCreateForm();
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Subtype</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newSubType.name}
                onChange={(e) => setNewSubType({ ...newSubType, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newSubType.description}
                onChange={(e) => setNewSubType({ ...newSubType, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={newSubType.startDate}
                onChange={(e) => setNewSubType({ ...newSubType, startDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={newSubType.endDate}
                onChange={(e) => setNewSubType({ ...newSubType, endDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="isActive"
                  checked={newSubType.isActive}
                  onCheckedChange={(checked) => setNewSubType({ ...newSubType, isActive: checked })}
                />
                <Label htmlFor="isActive">{newSubType.isActive ? 'Yes' : 'No'}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateSubmit}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Subtype</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editedSubType.name}
                onChange={(e) => setEditedSubType({ ...editedSubType, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={editedSubType.description}
                onChange={(e) => setEditedSubType({ ...editedSubType, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="edit-startDate"
                type="date"
                value={editedSubType.startDate}
                onChange={(e) => setEditedSubType({ ...editedSubType, startDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="edit-endDate"
                type="date"
                value={editedSubType.endDate}
                onChange={(e) => setEditedSubType({ ...editedSubType, endDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-isActive" className="text-right">
                Active
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="edit-isActive"
                  checked={editedSubType.isActive}
                  onCheckedChange={(checked) => setEditedSubType({ ...editedSubType, isActive: checked })}
                />
                <Label htmlFor="edit-isActive">{editedSubType.isActive ? 'Yes' : 'No'}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the subtype
              {selectedSubType ? ` "${selectedSubType.name}"` : ''}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedSubType && onDeleteConfirm(selectedSubType.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
