
import { useState } from 'react';
import { Document, Ligne } from '@/models/document';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { LigneItem } from './LigneItem';
import { CreateLigneDialog } from './dialogs/CreateLigneDialog';
import { EditLigneDialog } from './dialogs/EditLigneDialog';
import { DeleteLigneDialog } from './dialogs/DeleteLigneDialog';

interface LignesListWrapperProps {
  document: Document;
  lignes: Ligne[];
  canManageDocuments: boolean;
  onLignesUpdate: () => void;
}

export function LignesListWrapper({
  document,
  lignes,
  canManageDocuments,
  onLignesUpdate
}: LignesListWrapperProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLigne, setSelectedLigne] = useState<Ligne | null>(null);

  const handleCreateLigne = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditLigne = (ligne: Ligne) => {
    setSelectedLigne(ligne);
    setIsEditDialogOpen(true);
  };

  const handleDeleteLigne = (ligne: Ligne) => {
    setSelectedLigne(ligne);
    setIsDeleteDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    onLignesUpdate();
  };

  return (
    <div className="space-y-4">
      {canManageDocuments && (
        <div className="flex justify-end">
          <Button onClick={handleCreateLigne}>
            <Plus className="mr-2 h-4 w-4" /> Add Line
          </Button>
        </div>
      )}

      {lignes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No lines found for this document. {canManageDocuments && "Use the 'Add Line' button to create one."}
        </div>
      ) : (
        <div className="space-y-4">
          {lignes.map((ligne) => (
            <LigneItem
              key={ligne.id}
              ligne={ligne}
              document={document}
              onUpdate={onLignesUpdate}
              canManageDocuments={canManageDocuments}
            />
          ))}
        </div>
      )}

      <CreateLigneDialog
        documentId={document.id}
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleDialogSuccess}
      />

      {selectedLigne && (
        <>
          <EditLigneDialog
            ligne={selectedLigne}
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSuccess={handleDialogSuccess}
          />

          <DeleteLigneDialog
            ligne={selectedLigne}
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onSuccess={handleDialogSuccess}
          />
        </>
      )}
    </div>
  );
}
