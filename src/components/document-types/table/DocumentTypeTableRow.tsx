
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash } from 'lucide-react';
import { DocumentType } from '@/models/document';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DocumentTypeTableRowProps {
  type: DocumentType;
  isSelected: boolean;
  onSelectType: (id: number, checked: boolean) => void;
  onDeleteType: (id: number) => void;
  onEditType: (type: DocumentType) => void;
}

export const DocumentTypeTableRow = ({
  type,
  isSelected,
  onSelectType,
  onDeleteType,
  onEditType
}: DocumentTypeTableRowProps) => {
  return (
    <TableRow 
      key={type.id} 
      className={`border-b border-blue-900/20 hover:bg-blue-900/10 ${isSelected ? 'bg-blue-900/20' : ''}`}
    >
      <TableCell className="py-2">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={(checked) => onSelectType(type.id!, checked as boolean)}
          disabled={type.documentCounter! > 0}
          aria-label={`Select ${type.typeName}`}
        />
      </TableCell>
      <TableCell className="py-2">
        <Badge variant="outline" className="px-2 py-0.5 text-xs font-mono bg-blue-900/30 text-blue-200 border-blue-800/40">
          {type.typeKey}
        </Badge>
      </TableCell>
      <TableCell className="font-medium text-white py-2">{type.typeName}</TableCell>
      <TableCell className="text-blue-300 py-2">{type.typeAttr || "-"}</TableCell>
      <TableCell className="py-2">
        <Badge 
          variant={type.documentCounter! > 0 ? "secondary" : "outline"} 
          className={`px-1.5 py-0.5 text-xs ${type.documentCounter! > 0 
            ? 'bg-blue-600/30 text-blue-200 hover:bg-blue-600/40' 
            : 'border-blue-800/40 text-blue-300'}`}
        >
          {type.documentCounter}
        </Badge>
      </TableCell>
      <TableCell className="text-right py-2">
        <div className="flex justify-end gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-blue-400 hover:text-blue-200 hover:bg-blue-900/30"
                  onClick={() => onEditType(type)}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Edit type</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-900/20 ${
                    type.documentCounter! > 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => type.documentCounter! === 0 && onDeleteType(type.id!)}
                  disabled={type.documentCounter! > 0}
                >
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {type.documentCounter! > 0 
                  ? "Cannot delete types with documents" 
                  : "Delete type"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
};
