
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import sousLigneService from '@/services/sousLigneService';
import { SousLigne, Ligne, CreateSousLigneRequest, UpdateSousLigneRequest } from '@/models/document';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DeleteConfirmDialog } from '@/components/ui/confirm-dialog';

interface SousLignesListProps {
  ligne: Ligne;
  onUpdate: () => void;
}

export default function SousLignesList({ ligne, onUpdate }: SousLignesListProps) {
  const [sousLignes, setSousLignes] = useState<SousLigne[]>([]);
  const [newSousLigneTitle, setNewSousLigneTitle] = useState('');
  const [newSousLigneAttribute, setNewSousLigneAttribute] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editSousLigneId, setEditSousLigneId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAttribute, setEditAttribute] = useState('');
  const [deleteSousLigneId, setDeleteSousLigneId] = useState<number | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    loadSousLignes();
  }, [ligne]);

  const loadSousLignes = async () => {
    try {
      const data = await sousLigneService.getSousLignesByLigneId(ligne.id);
      setSousLignes(data);
    } catch (error) {
      toast.error("Failed to load sous-lignes");
    }
  };

  const createSousLigne = async () => {
    if (!newSousLigneTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      await sousLigneService.createSousLigne({
        ligneId: ligne.id,
        title: newSousLigneTitle.trim(),
        attribute: newSousLigneAttribute.trim(),
        amount: 0, // Required field
        orderIndex: ligne.sousLignesCount || 0,
      });

      toast.success("Sous-ligne created successfully");
      setNewSousLigneTitle('');
      setNewSousLigneAttribute('');
      setIsCreating(false);
      loadSousLignes();
      onUpdate();
    } catch (error) {
      toast.error("Failed to create sous-ligne");
    }
  };

  const startEditing = (sousLigne: SousLigne) => {
    setEditSousLigneId(sousLigne.id);
    setEditTitle(sousLigne.title);
    setEditAttribute(sousLigne.attribute || '');
  };

  const cancelEditing = () => {
    setEditSousLigneId(null);
  };

  const updateSousLigne = async (sousLigne: SousLigne) => {
    try {
      await sousLigneService.updateSousLigne(sousLigne.id, {
        title: editTitle.trim(),
        attribute: editAttribute.trim(),
        amount: sousLigne.amount, // Keep the existing amount
        orderIndex: sousLigne.orderIndex,
      });

      toast.success("Sous-ligne updated successfully");
      setEditSousLigneId(null);
      loadSousLignes();
      onUpdate();
    } catch (error) {
      toast.error("Failed to update sous-ligne");
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteSousLigneId(id);
    setIsDeleteConfirmOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setDeleteSousLigneId(null);
  };

  const deleteSousLigne = async () => {
    if (!deleteSousLigneId) return;

    try {
      await sousLigneService.deleteSousLigne(deleteSousLigneId);
      toast.success("Sous-ligne deleted successfully");
      setIsDeleteConfirmOpen(false);
      setDeleteSousLigneId(null);
      loadSousLignes();
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete sous-ligne");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Button onClick={() => setIsCreating(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Sous-Ligne
        </Button>
      </div>

      {isCreating && (
        <div className="mb-4 p-4 border rounded-md">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Sous-ligne title"
                value={newSousLigneTitle}
                onChange={(e) => setNewSousLigneTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="attribute">Attribute</Label>
              <Input
                id="attribute"
                type="text"
                placeholder="Sous-ligne attribute"
                value={newSousLigneAttribute}
                onChange={(e) => setNewSousLigneAttribute(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={createSousLigne}>Create</Button>
            </div>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Attribute</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sousLignes.map((sousLigne) => (
            <TableRow key={sousLigne.id}>
              <TableCell>
                {editSousLigneId === sousLigne.id ? (
                  <Input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                ) : (
                  sousLigne.title
                )}
              </TableCell>
              <TableCell>
                {editSousLigneId === sousLigne.id ? (
                  <Input
                    type="text"
                    value={editAttribute}
                    onChange={(e) => setEditAttribute(e.target.value)}
                  />
                ) : (
                  sousLigne.attribute
                )}
              </TableCell>
              <TableCell className="text-right">
                {editSousLigneId === sousLigne.id ? (
                  <div className="space-x-2">
                    <Button size="sm" onClick={() => updateSousLigne(sousLigne)}>
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => startEditing(sousLigne)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => confirmDelete(sousLigne.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={deleteSousLigne}
        title="Delete Sous-Ligne"
        description="Are you sure you want to delete this sous-ligne? This action cannot be undone."
      />
    </div>
  );
}
