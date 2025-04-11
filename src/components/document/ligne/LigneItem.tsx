
import { useState } from 'react';
import { 
  Edit, Trash2, ChevronDown, ChevronUp, DollarSign
} from 'lucide-react';
import { Ligne, Document } from '@/models/document';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import SousLignesList from '../SousLignesList';
import { motion, AnimatePresence } from 'framer-motion';

interface LigneItemProps {
  ligne: Ligne;
  expandedLigneId: number | null;
  toggleLigneExpansion: (ligneId: number) => void;
  document: Document;
  canManageDocuments: boolean;
  onEdit: (ligne: Ligne) => void;
  onDelete: (ligne: Ligne) => void;
}

const LigneItem = ({ 
  ligne, 
  expandedLigneId, 
  toggleLigneExpansion, 
  document, 
  canManageDocuments,
  onEdit,
  onDelete
}: LigneItemProps) => {
  return (
    <motion.div 
      key={ligne.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border border-white/10 overflow-hidden shadow-md bg-gradient-to-br from-gray-900/90 to-blue-900/60 hover:shadow-lg transition-all duration-200"
    >
      <div 
        className={`p-4 cursor-pointer transition-colors duration-200 flex items-center justify-between group hover:bg-blue-900/20 ${
          expandedLigneId === ligne.id ? 'bg-blue-900/20' : ''
        }`}
        onClick={() => toggleLigneExpansion(ligne.id)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-white">{ligne.title}</h3>
            <Badge variant="outline" className="font-mono text-xs border-blue-500/30 bg-blue-900/30 text-blue-300">
              {ligne.ligneKey}
            </Badge>
          </div>
          <p className="text-sm text-blue-200 mt-1 line-clamp-1">{ligne.article}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center px-3 py-1.5 rounded-full bg-green-900/20 text-green-300 border border-green-500/30">
            <DollarSign className="h-3.5 w-3.5 mr-1" />
            {ligne.prix.toFixed(2)}
          </div>
          
          <div className="flex items-center gap-1">
            {canManageDocuments && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-900/40"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(ligne);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(ligne);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400">
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
            <Separator className="bg-white/10" />
            <div className="p-4 bg-gradient-to-br from-blue-950/50 to-indigo-950/40">
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
  );
};

export default LigneItem;
