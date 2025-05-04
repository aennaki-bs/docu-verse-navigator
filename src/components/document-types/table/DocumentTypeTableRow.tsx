import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, ChevronRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { DocumentType } from '@/models/document';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';

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
  const { theme } = useSettings();
  
  // Initialize documentCount early to avoid reference error
  const documentCount = type.documentCounter || 0;
  
  // Theme-specific styles
  const rowHoverClass = theme === 'dark' 
    ? 'hover:bg-blue-900/20' 
    : 'hover:bg-blue-50';
  
  const textClass = theme === 'dark' 
    ? 'text-blue-100' 
    : 'text-gray-800';
  
  const badgeClass = theme === 'dark'
    ? documentCount === 0 
      ? 'border-transparent bg-primary text-primary-foreground shadow' 
      : 'border-transparent bg-[#1a2765] text-white shadow'
    : documentCount === 0
      ? 'border-transparent bg-blue-500 text-white shadow'
      : 'border-transparent bg-blue-600 text-white shadow';
  
  const editBtnClass = theme === 'dark'
    ? documentCount > 0
      ? 'text-gray-500 cursor-not-allowed'
      : 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/40'
    : documentCount > 0
      ? 'text-gray-400 cursor-not-allowed'
      : 'text-blue-500 hover:text-blue-600 hover:bg-blue-50';
  
  const deleteBtnClass = theme === 'dark'
    ? documentCount > 0
      ? 'text-gray-500 cursor-not-allowed'
      : 'text-red-400 hover:text-red-300 hover:bg-red-900/30'
    : documentCount > 0
      ? 'text-gray-400 cursor-not-allowed'
      : 'text-red-500 hover:text-red-600 hover:bg-red-50';
  
  const detailsBtnClass = theme === 'dark'
    ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/40'
    : 'text-blue-500 hover:text-blue-600 hover:bg-blue-50';

  const handleRowClick = () => {
    navigate(`/document-types/${type.id}/subtypes`);
  };

  return (
    <TableRow 
      className={`transition-all ${rowHoverClass} cursor-pointer`}
      onClick={handleRowClick}
    >
      <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelectType(type.id!, checked as boolean)}
          disabled={documentCount > 0}
        />
      </TableCell>
      <TableCell className={textClass}>{type.typeKey}</TableCell>
      <TableCell>{type.typeName}</TableCell>
      <TableCell>{type.typeAttr}</TableCell>
      <TableCell>
        <div className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors font-mono ${badgeClass}`}>
          {documentCount}
        </div>
      </TableCell>
      <TableCell className="text-right w-[120px]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 p-0 ${editBtnClass}`}
            onClick={(e) => {
              e.stopPropagation();
              if (documentCount === 0) onEditType(type);
            }}
            disabled={documentCount > 0}
            title={documentCount > 0 ? 
              "Cannot edit type with associated documents" : 
              "Edit document type"}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 p-0 ${deleteBtnClass}`}
            onClick={(e) => {
              e.stopPropagation();
              if (documentCount === 0 && type.id) onDeleteType(type.id);
            }}
            disabled={documentCount > 0}
            title={documentCount > 0 ? 
              "Cannot delete type with associated documents" : 
              "Delete document type"}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 p-0 ${detailsBtnClass}`}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/document-types/${type.id}/subtypes`);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
