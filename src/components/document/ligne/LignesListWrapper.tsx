
import { useState } from 'react';
import { Plus, Edit, Delete } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Document, Ligne } from '@/models/document';
import { LigneItem } from './LigneItem';
import { LigneEmptyState } from './LigneEmptyState';
import { LigneSummaryFooter } from './LigneSummaryFooter';
import { CreateLigneDialog } from './dialogs/CreateLigneDialog';
import { EditLigneDialog } from './dialogs/EditLigneDialog';
import { DeleteLigneDialog } from './dialogs/DeleteLigneDialog';

interface LignesListWrapperProps {
  document: Document;
  lignes: Ligne[];
  canManageDocuments: boolean;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
}

export function LignesListWrapper({
  document,
  lignes,
  canManageDocuments,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
}: LignesListWrapperProps) {
  const [selectedLigne, setSelectedLigne] = useState<Ligne | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Calculate total amount
  const totalAmount = lignes.reduce((sum, ligne) => sum + ligne.amount, 0);

  const handleEditClick = (ligne: Ligne) => {
    setSelectedLigne(ligne);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (ligne: Ligne) => {
    setSelectedLigne(ligne);
    setIsDeleteDialogOpen(true);
  };

  const handleSuccess = () => {
    // This would typically refetch the lignes data
    // For now, we'll just close dialogs
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Lines</CardTitle>
        {canManageDocuments && (
          <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Line
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {lignes.length > 0 ? (
          <div className="space-y-4">
            {lignes.map((ligne) => (
              <LigneItem
                key={ligne.id}
                ligne={ligne}
                document={document}
                canManageDocuments={canManageDocuments}
                onEdit={() => handleEditClick(ligne)}
                onDelete={() => handleDeleteClick(ligne)}
              />
            ))}
            
            <LigneSummaryFooter totalAmount={totalAmount} />
          </div>
        ) : (
          <LigneEmptyState canAdd={canManageDocuments} onAddClick={() => setIsCreateDialogOpen(true)} />
        )}
      </CardContent>
      
      {/* Dialogs */}
      <CreateLigneDialog 
        documentId={document.id}
        isOpen={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onSuccess={handleSuccess}
      />
      
      {selectedLigne && (
        <>
          <EditLigneDialog
            ligne={selectedLigne}
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSuccess={handleSuccess}
          />
          
          <DeleteLigneDialog
            ligne={selectedLigne}
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onSuccess={handleSuccess}
          />
        </>
      )}
    </Card>
  );
}
