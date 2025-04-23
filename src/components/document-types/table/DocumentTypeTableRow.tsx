
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentType } from '@/models/document';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, ChevronRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface DocumentTypeTableRowProps {
  type: DocumentType;
  isSelected: boolean;
  onSelectType: (id: number, checked: boolean) => void;
  onDeleteType: (id: number) => void;
  onEditType: (type: DocumentType) => void;
}

export function DocumentTypeTableRow({
  type,
  isSelected,
  onSelectType,
  onDeleteType,
  onEditType,
}: DocumentTypeTableRowProps) {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/document-types/${type.id}/subtypes`);
  };

  return (
    <TableRow 
      className={`transition-all hover:bg-blue-900/20 cursor-pointer`}
      onClick={handleRowClick}
    >
      <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelectType(type.id!, checked as boolean)}
          disabled={type.documentCounter !== undefined && type.documentCounter > 0}
        />
      </TableCell>
      <TableCell className="text-blue-100">{type.typeKey}</TableCell>
      <TableCell>{type.typeName}</TableCell>
      <TableCell>{type.typeAttr}</TableCell>
      <TableCell>
        <Badge 
          variant={type.documentCounter === 0 ? 'default' : 'secondary'}
          className="font-mono"
        >
          {type.documentCounter || 0}
        </Badge>
      </TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
            onClick={() => onEditType(type)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${
              type.documentCounter && type.documentCounter > 0
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
            }`}
            onClick={() => type.documentCounter === 0 && type.id && onDeleteType(type.id)}
            disabled={type.documentCounter !== undefined && type.documentCounter > 0}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
