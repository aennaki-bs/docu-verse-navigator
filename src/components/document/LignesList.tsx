
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, Package, PlusCircle, DollarSign, FileText } from 'lucide-react';
import { Ligne, Document, CreateLigneRequest } from '@/models/document';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import documentService from '@/services/documentService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SousLignesList from './SousLignesList';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

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

  const getTotalPrice = () => {
    return lignes.reduce((total, ligne) => total + ligne.prix, 0).toFixed(2);
  };
  
  // Function to get a deterministic gradient based on ligne ID
  const getLigneGradient = (ligneId: number) => {
    const gradients = ['from-blue-50 to-indigo-50', 'from-green-50 to-emerald-50', 
                       'from-purple-50 to-pink-50', 'from-amber-50 to-yellow-50'];
    return gradients[ligneId % gradients.length];
  };

  return (
    <div>
      {canManageDocuments && (
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
            Manage Document Lines
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)} 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Add New Line
          </Button>
        </div>
      )}

      {lignes.length === 0 ? (
        <div className="p-12 text-center bg-gray-50 dark:bg-gray-800/50">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No Lines Found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            This document doesn't have any lines yet. Add your first line to get started.
          </p>
          {canManageDocuments && (
            <Button 
              onClick={() => setIsCreateDialogOpen(true)} 
              variant="outline" 
              className="border-dashed border-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Your First Line
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="p-4 space-y-3">
            {lignes.map((ligne) => (
              <motion.div 
                key={ligne.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="ligne-card"
              >
                <div 
                  className={`ligne-header ${getLigneGradient(ligne.id)}`}
                  onClick={() => toggleLigneExpansion(ligne.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="ligne-title">{ligne.title}</h3>
                      <Badge variant="outline" className="font-mono text-xs">
                        {ligne.ligneKey}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{ligne.article}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="ligne-price">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {ligne.prix.toFixed(2)}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {canManageDocuments && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditDialogOpen(ligne);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDialogOpen(ligne);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <Button variant="ghost" size="icon" className="text-gray-400">
                        {expandedLigneId === ligne.id ? 
                          <ChevronUp className="h-5 w-5" /> : 
                          <ChevronDown className="h-5 w-5" />
                        }
                      </Button>
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedLigneId === ligne.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Separator />
                      <div className="ligne-body">
                        <SousLignesList 
                          document={document}
                          ligne={ligne}
                          canManageDocuments={canManageDocuments}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
          {lignes.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t flex justify-between items-center">
              <div className="text-gray-600 dark:text-gray-400">
                Total Lines: <span className="font-medium">{lignes.length}</span>
              </div>
              <div className="text-lg font-medium">
                Total: <span className="text-green-600 dark:text-green-400">{getTotalPrice()} €</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Ligne Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-blue-600 dark:text-blue-400">
              <PlusCircle className="h-5 w-5 mr-2" /> Add New Line
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">Title*</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter line title"
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="article" className="text-gray-700">Article Description*</Label>
              <Textarea 
                id="article" 
                value={article} 
                onChange={(e) => setArticle(e.target.value)} 
                placeholder="Enter article description"
                rows={3}
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prix" className="text-gray-700">Price (€)*</Label>
              <Input 
                id="prix" 
                type="number" 
                value={prix} 
                onChange={(e) => setPrix(Number(e.target.value))} 
                placeholder="0.00"
                min="0"
                step="0.01"
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateLigne} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-blue-600"
            >
              {isSubmitting ? 'Creating...' : 'Create Line'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Ligne Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-blue-600">
              <Edit className="h-5 w-5 mr-2" /> Edit Line
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-gray-700">Title*</Label>
              <Input 
                id="edit-title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter line title"
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-article" className="text-gray-700">Article Description*</Label>
              <Textarea 
                id="edit-article" 
                value={article} 
                onChange={(e) => setArticle(e.target.value)} 
                placeholder="Enter article description"
                rows={3}
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-prix" className="text-gray-700">Price (€)*</Label>
              <Input 
                id="edit-prix" 
                type="number" 
                value={prix} 
                onChange={(e) => setPrix(Number(e.target.value))} 
                placeholder="0.00"
                min="0"
                step="0.01"
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleUpdateLigne} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-blue-700"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Ligne Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <Trash2 className="h-5 w-5 mr-2" /> Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">Are you sure you want to delete this line? This will also delete all related sous-lignes.</p>
            {currentLigne && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="font-medium">{currentLigne.title}</p>
                <p className="text-sm text-gray-500">{currentLigne.ligneKey}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteLigne} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-500 to-red-600"
            >
              {isSubmitting ? 'Deleting...' : 'Delete Line'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LignesList;
