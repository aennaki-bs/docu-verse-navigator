
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Ligne, Document, CreateLigneRequest } from '@/models/document';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import documentService from '@/services/documentService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SousLignesList from './SousLignesList';
import { Badge } from '@/components/ui/badge';

interface LignesListProps {
  document: Document;
  lignes: Ligne[];
  canManageDocuments: boolean;
}

const LignesList = ({ document, lignes, canManageDocuments }: LignesListProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expandedLigneId, setExpandedLigneId] = useState<number | null>(null);
  const [currentLigne, setCurrentLigne] = useState<Ligne | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [article, setArticle] = useState('');
  const [prix, setPrix] = useState<number>(0);

  const queryClient = useQueryClient();

  const resetForm = () => {
    setTitle('');
    setArticle('');
    setPrix(0);
    setCurrentLigne(null);
  };

  const handleCreateDialogOpen = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleEditDialogOpen = (ligne: Ligne) => {
    setCurrentLigne(ligne);
    setTitle(ligne.title);
    setArticle(ligne.article);
    setPrix(ligne.prix);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDialogOpen = (ligne: Ligne) => {
    setCurrentLigne(ligne);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateLigne = async () => {
    if (!title || !article) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const newLigne: CreateLigneRequest = {
        documentId: document.id,
        title,
        article,
        prix
      };

      await documentService.createLigne(newLigne);
      toast.success('Ligne created successfully');
      resetForm();
      setIsCreateDialogOpen(false);
      
      // Refresh document data
      queryClient.invalidateQueries({queryKey: ['document', document.id]});
      queryClient.invalidateQueries({queryKey: ['documentLignes', document.id]});
    } catch (error) {
      console.error('Failed to create ligne:', error);
      toast.error('Failed to create ligne');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLigne = async () => {
    if (!currentLigne) return;
    
    try {
      setIsSubmitting(true);
      await documentService.updateLigne(currentLigne.id, {
        title,
        article,
        prix
      });
      toast.success('Ligne updated successfully');
      resetForm();
      setIsEditDialogOpen(false);
      
      // Refresh document data
      queryClient.invalidateQueries({queryKey: ['document', document.id]});
      queryClient.invalidateQueries({queryKey: ['documentLignes', document.id]});
    } catch (error) {
      console.error('Failed to update ligne:', error);
      toast.error('Failed to update ligne');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLigne = async () => {
    if (!currentLigne) return;
    
    try {
      setIsSubmitting(true);
      await documentService.deleteLigne(currentLigne.id);
      toast.success('Ligne deleted successfully');
      resetForm();
      setIsDeleteDialogOpen(false);
      
      // Refresh document data
      queryClient.invalidateQueries({queryKey: ['document', document.id]});
      queryClient.invalidateQueries({queryKey: ['documentLignes', document.id]});
    } catch (error) {
      console.error('Failed to delete ligne:', error);
      toast.error('Failed to delete ligne');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLigneExpansion = (ligneId: number) => {
    setExpandedLigneId(expandedLigneId === ligneId ? null : ligneId);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Lignes</h2>
        {canManageDocuments && (
          <Button onClick={handleCreateDialogOpen} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" /> Add Ligne
          </Button>
        )}
      </div>

      {lignes.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No lines have been added to this document yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {lignes.map((ligne) => (
            <Card key={ligne.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 dark:bg-gray-800 p-4 cursor-pointer" onClick={() => toggleLigneExpansion(ligne.id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{ligne.title}</CardTitle>
                      <Badge variant="outline" className="font-mono text-xs">
                        {ligne.ligneKey}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Article: {ligne.article}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-semibold text-green-600">{ligne.prix.toFixed(2)} €</span>
                    {canManageDocuments && (
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={(e) => {
                          e.stopPropagation();
                          handleEditDialogOpen(ligne);
                        }}>
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDialogOpen(ligne);
                        }}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {expandedLigneId === ligne.id && (
                <CardContent className="p-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <h3 className="font-medium mb-2">Sous-Lignes</h3>
                    <SousLignesList 
                      document={document}
                      ligne={ligne}
                      canManageDocuments={canManageDocuments}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Ligne Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Ligne</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title*</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter line title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="article">Article*</Label>
              <Textarea 
                id="article" 
                value={article} 
                onChange={(e) => setArticle(e.target.value)} 
                placeholder="Enter article description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prix">Price*</Label>
              <Input 
                id="prix" 
                type="number" 
                value={prix} 
                onChange={(e) => setPrix(Number(e.target.value))} 
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateLigne} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Ligne Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ligne</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title*</Label>
              <Input 
                id="edit-title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter line title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-article">Article*</Label>
              <Textarea 
                id="edit-article" 
                value={article} 
                onChange={(e) => setArticle(e.target.value)} 
                placeholder="Enter article description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-prix">Price*</Label>
              <Input 
                id="edit-prix" 
                type="number" 
                value={prix} 
                onChange={(e) => setPrix(Number(e.target.value))} 
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateLigne} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Ligne Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this ligne? This will also delete all related sous-lignes.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteLigne} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LignesList;
