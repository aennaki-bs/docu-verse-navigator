import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, FileStack, Settings } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';

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
  const { 
    data: sousLignes = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['sousLignes', ligne.id],
    queryFn: () => documentService.getSousLignesByLigneId(ligne.id),
  });

  // Handle error with useEffect if needed
  useEffect(() => {
    if (error) {
      console.error(`Failed to fetch sousLignes for ligne ${ligne.id}:`, error);
      toast.error('Failed to load sous-lignes');
    }
  }, [error, ligne.id]);

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
    return (
      <div className="py-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-sm text-gray-500">Loading sub-lines...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FileStack className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
          <h4 className="font-medium text-blue-900 dark:text-blue-300">
            Sub-Lines <span className="text-gray-400 text-sm font-normal">({sousLignes.length})</span>
          </h4>
        </div>
        {canManageDocuments && (
          <Button 
            onClick={() => setIsCreateDialogOpen(true)} 
            size="sm" 
            variant="outline" 
            className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Sub-Line
          </Button>
        )}
      </div>

      <AnimatePresence>
        {sousLignes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-gray-500 italic p-4 text-center bg-gray-100 dark:bg-gray-800/50 bg-opacity-50 rounded-md"
          >
            No sub-lines available for this line yet.
          </motion.div>
        ) : (
          <div className="sous-ligne-grid">
            {sousLignes.map((sousLigne, index) => (
              <motion.div
                key={sousLigne.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card className="sous-ligne-card group">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="sous-ligne-title">
                        <span>{sousLigne.title}</span>
                        {sousLigne.sousLigneKey && (
                          <Badge variant="outline" className="font-mono text-xs">
                            {sousLigne.sousLigneKey}
                          </Badge>
                        )}
                      </div>
                      <p className="sous-ligne-content line-clamp-2">{sousLigne.attribute}</p>
                    </div>
                    {canManageDocuments && (
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleEditDialogOpen(sousLigne)}
                        >
                          <Edit className="h-3.5 w-3.5 text-blue-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleDeleteDialogOpen(sousLigne)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
      
      {/* Create SousLigne Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-blue-600 dark:text-blue-400">
              <Plus className="h-5 w-5 mr-2" /> Add Sub-Line
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sl-title" className="text-sm font-medium">Title*</Label>
              <Input 
                id="sl-title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter sub-line title"
                className="border-gray-300 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sl-attribute" className="text-sm font-medium">Attribute*</Label>
              <Textarea 
                id="sl-attribute" 
                value={attribute} 
                onChange={(e) => setAttribute(e.target.value)} 
                placeholder="Enter attribute value"
                rows={3}
                className="border-gray-300 focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateSousLigne} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Create
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit SousLigne Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-blue-600 dark:text-blue-400">
              <Settings className="h-5 w-5 mr-2" /> Edit Sub-Line
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-sl-title" className="text-sm font-medium">Title*</Label>
              <Input 
                id="edit-sl-title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter sub-line title"
                className="border-gray-300 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sl-attribute" className="text-sm font-medium">Attribute*</Label>
              <Textarea 
                id="edit-sl-attribute" 
                value={attribute} 
                onChange={(e) => setAttribute(e.target.value)} 
                placeholder="Enter attribute value"
                rows={3}
                className="border-gray-300 focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleUpdateSousLigne} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-blue-700"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete SousLigne Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <Trash2 className="h-5 w-5 mr-2" /> Delete Sub-Line
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">Are you sure you want to delete this sub-line?</p>
            {currentSousLigne && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                <h4 className="font-medium text-red-800">{currentSousLigne.title}</h4>
                {currentSousLigne.sousLigneKey && (
                  <p className="text-xs text-red-600 font-mono mt-1">{currentSousLigne.sousLigneKey}</p>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              <XCircle className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteSousLigne} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-500 to-red-600"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </div>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SousLignesList;
