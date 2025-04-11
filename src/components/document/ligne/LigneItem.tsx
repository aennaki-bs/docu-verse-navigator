import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { Ligne, Document } from '@/models/document';
import SousLignesList from '../SousLignesList';

interface LigneItemProps {
  ligne: Ligne;
  document: Document;
  onUpdate: () => void;
  canManageDocuments: boolean;
  onEdit?: (ligne: Ligne) => void;
  onDelete?: (ligne: Ligne) => void;
}

export function LigneItem({ 
  ligne, 
  document, 
  onUpdate, 
  canManageDocuments,
  onEdit,
  onDelete
}: LigneItemProps) {
  const [showSousLignes, setShowSousLignes] = useState(false);

  const toggleSousLignes = () => {
    setShowSousLignes(!showSousLignes);
  };

  const handleEdit = () => {
    if (onEdit) onEdit(ligne);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(ligne);
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="text-lg font-medium">{ligne.title}</h3>
              {ligne.sousLignesCount && ligne.sousLignesCount > 0 && (
                <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  {ligne.sousLignesCount} sous-ligne{ligne.sousLignesCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {ligne.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {ligne.description}
              </p>
            )}
            <div className="mt-2 text-sm">
              <span className="font-medium">Amount:</span> {ligne.amount}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {canManageDocuments && (
              <>
                <Button variant="ghost" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {ligne.sousLignesCount && ligne.sousLignesCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleSousLignes}
                className="flex items-center"
              >
                {showSousLignes ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" /> Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" /> Show
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        
        {showSousLignes && (
          <div className="pl-4 mt-4 border-t pt-4">
            <SousLignesList ligne={ligne} onUpdate={onUpdate} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
