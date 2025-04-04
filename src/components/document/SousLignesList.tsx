
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { SousLigne, Ligne, Document, CreateSousLigneRequest } from '@/models/document';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import documentService from '@/services/documentService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';

interface SousLignesListProps {
  document: Document;
  ligne: Ligne;
  canManageDocuments: boolean;
}

const SousLignesList = ({ document, ligne, canManageDocuments }: SousLignesListProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSousLigne, setCurrentSousLigne] = useState<SousLigne | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [attribute, setAttribute] = useState('');

  const queryClient = useQueryClient();

  // Fetch sous-lignes for this ligne
  const { data: sousLignes = [], isLoading, error } = useQuery({
    queryKey: ['sousLignes', ligne.id],
    queryFn: () => documentService.getSousLignesByLigneId(ligne.id),
  });

  const resetForm = () => {
    setTitle('');
    setAttribute('');
    setCurrentSousLigne(null);
  };

  const handleCreateDialogOpen = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleEditDialogOpen = (sousLigne: SousLigne) => {
    setCurrentSousLigne(sousLigne);
    setTitle(sousLigne.title);
    setAttribute(sousLigne.attribute);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDialogOpen = (sousLigne: SousLigne) => {
    setCurrentSousLigne(sousLigne);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSousLigne = async () => {
    if (!title || !attribute) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const newSousLigne: CreateSousLigneRequest = {
        ligneId: ligne.id,
        title,
        attribute
      };

      await documentService.createSousLigne(newSousLigne);
      toast.success('Sous-ligne created successfully');
      resetForm();
      setIsCreateDialogOpen(false);
      
      // Refresh data
      queryClient.invalidateQueries({queryKey: ['document', document.id]});
      queryClient.invalidateQueries({queryKey: ['documentLignes', document.id]});
      queryClient.invalidateQueries({queryKey: ['sousLignes', ligne.id]});
    } catch (error) {
      console.error('Failed to create sous-ligne:', error);
      toast.error('Failed to create sous-ligne');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSousLigne = async () => {
    if (!currentSousLigne) return;
    
    try {
      setIsSubmitting(true);
      await documentService.updateSousLigne(currentSousLigne.id, {
        title,
        attribute
      });
      toast.success('Sous-ligne updated successfully');
      resetForm();
      setIsEditDialogOpen(false);
      
      // Refresh data
      queryClient.invalidateQueries({queryKey: ['document', document.id]});
      queryClient.invalidateQueries({queryKey: ['documentLignes', document.id]});
      queryClient.invalidateQueries({queryKey: ['sousLignes', ligne.id]});
    } catch (error) {
      console.error('Failed to update sous-ligne:', error);
      toast.error('Failed to update sous-ligne');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSousLigne = async () => {
    if (!currentSousLigne) return;
    
    try {
      setIsSubmitting(true);
      await documentService.deleteSousLigne(currentSousLigne.id);
      toast.success('Sous-ligne deleted successfully');
      resetForm();
      setIsDeleteDialogOpen(false);
      
      // Refresh data
      queryClient.invalidateQueries({queryKey: ['document', document.id]});
      queryClient.invalidateQueries({queryKey: ['documentLignes', document.id]});
      queryClient.invalidateQueries({queryKey: ['sousLignes', ligne.id]});
    } catch (error) {
      console.error('Failed to delete sous-ligne:', error);
      toast.error('Failed to delete sous-ligne');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">Error loading sous-lignes</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-700">
          {sousLignes.length} Sous-ligne{sousLignes.length !== 1 && 's'}
        </h4>
        {canManageDocuments && (
          <Button onClick={handleCreateDialogOpen} size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        )}
      </div>

      {sousLignes.length === 0 ? (
        <div className="text-sm text-gray-500 italic">No sous-lignes available.</div>
      ) : (
        <div className="space-y-2">
          {sousLignes.map((sousLigne) => (
            <Card key={sousLigne.id} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium text-sm">{sousLigne.title}</h5>
                    {sousLigne.sousLigneKey && (
                      <Badge variant="outline" className="font-mono text-xs">
                        {sousLigne.sousLigneKey}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{sousLigne.attribute}</p>
                </div>
                {canManageDocuments && (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditDialogOpen(sousLigne)}>
                      <Edit className="h-3 w-3 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteDialogOpen(sousLigne)}>
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create SousLigne Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Sous-Ligne</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sl-title">Title*</Label>
              <Input 
                id="sl-title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter sous-ligne title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sl-attribute">Attribute*</Label>
              <Textarea 
                id="sl-attribute" 
                value={attribute} 
                onChange={(e) => setAttribute(e.target.value)} 
                placeholder="Enter attribute value"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSousLigne} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit SousLigne Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Sous-Ligne</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-sl-title">Title*</Label>
              <Input 
                id="edit-sl-title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter sous-ligne title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sl-attribute">Attribute*</Label>
              <Textarea 
                id="edit-sl-attribute" 
                value={attribute} 
                onChange={(e) => setAttribute(e.target.value)} 
                placeholder="Enter attribute value"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateSousLigne} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete SousLigne Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this sous-ligne?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSousLigne} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SousLignesList;
