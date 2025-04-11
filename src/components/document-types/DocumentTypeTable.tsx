
import { useState } from 'react';
import { DocumentType } from '@/models/document';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Trash, Edit, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DocumentTypeTableProps {
  types: DocumentType[];
  selectedTypes: number[];
  onSelectType: (id: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onDeleteType: (id: number) => void;
  onEditType: (type: DocumentType) => void;
  onSort: (field: string) => void;
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const DocumentTypeTable: React.FC<DocumentTypeTableProps> = ({
  types,
  selectedTypes,
  onSelectType,
  onSelectAll,
  onDeleteType,
  onEditType,
  onSort,
  sortField,
  sortDirection,
  searchQuery,
  onSearchChange
}) => {
  const areAllEligibleSelected = types.length > 0 && 
    types.filter(type => type.documentCounter === 0).length === selectedTypes.length;

  const renderSortIcon = (field: string) => {
    if (sortField === field) {
      return sortDirection === 'asc' 
        ? <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-blue-400" /> 
        : <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-blue-400 rotate-180" />;
    }
    return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-30" />;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="relative w-full max-w-xs">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-blue-400" />
            <Input
              placeholder="Search document types..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 py-1 h-9 text-sm bg-blue-900/10 border-blue-800/30 text-white placeholder:text-blue-300/50 w-full rounded-md"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-blue-900/20">
        <Table>
          <TableHeader className="bg-[#0a1033]/80">
            <TableRow className="hover:bg-transparent border-b border-blue-900/30 select-none">
              <TableHead className="w-[50px] text-blue-300 py-2 h-9">
                <Checkbox 
                  checked={areAllEligibleSelected && types.some(t => t.documentCounter === 0)}
                  onCheckedChange={onSelectAll}
                  disabled={!types.some(t => t.documentCounter === 0)}
                  aria-label="Select all types"
                />
              </TableHead>
              <TableHead 
                className="w-1/6 cursor-pointer text-blue-300 hover:text-blue-200 py-2 h-9"
                onClick={() => onSort('typeKey')}
              >
                <div className="flex items-center">
                  Type Key
                  {renderSortIcon('typeKey')}
                </div>
              </TableHead>
              <TableHead 
                className="w-1/3 cursor-pointer text-blue-300 hover:text-blue-200 py-2 h-9"
                onClick={() => onSort('typeName')}
              >
                <div className="flex items-center">
                  Type Name
                  {renderSortIcon('typeName')}
                </div>
              </TableHead>
              <TableHead 
                className="w-1/4 cursor-pointer text-blue-300 hover:text-blue-200 py-2 h-9"
                onClick={() => onSort('typeAttr')}
              >
                <div className="flex items-center">
                  Attributes
                  {renderSortIcon('typeAttr')}
                </div>
              </TableHead>
              <TableHead 
                className="w-1/6 cursor-pointer text-blue-300 hover:text-blue-200 py-2 h-9"
                onClick={() => onSort('documentCounter')}
              >
                <div className="flex items-center">
                  Document Count
                  {renderSortIcon('documentCounter')}
                </div>
              </TableHead>
              <TableHead className="w-1/12 text-right text-blue-300 py-2 h-9">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-blue-400">
                  No document types found
                </TableCell>
              </TableRow>
            ) : (
              types.map((type) => (
                <TableRow 
                  key={type.id} 
                  className={`border-b border-blue-900/20 hover:bg-blue-900/10 ${selectedTypes.includes(type.id!) ? 'bg-blue-900/20' : ''}`}
                >
                  <TableCell className="py-2">
                    <Checkbox 
                      checked={selectedTypes.includes(type.id!)}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DocumentTypeTable;
