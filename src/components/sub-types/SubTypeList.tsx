
import { useState } from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { SubType } from '@/models/subType';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface SubTypeListProps {
  subTypes: SubType[];
  isLoading: boolean;
  onEdit: (subType: SubType) => void;
  onDelete: (subType: SubType) => void;
  isSimpleUser: boolean;
}

const SubTypeList = ({ subTypes, isLoading, onEdit, onDelete, isSimpleUser }: SubTypeListProps) => {
  // State to track sorting
  const [sortField, setSortField] = useState<keyof SubType>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle sorting
  const handleSort = (field: keyof SubType) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort subtypes
  const sortedSubTypes = [...subTypes].sort((a, b) => {
    if (sortField === 'startDate' || sortField === 'endDate') {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      const valueA = String(a[sortField]).toLowerCase();
      const valueB = String(b[sortField]).toLowerCase();
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
  });

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-[#0f1642] border border-blue-900/30 rounded-lg shadow-md">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-blue-800/30 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-blue-800/30 rounded w-full mb-2"></div>
            <div className="h-6 bg-blue-800/30 rounded w-full mb-2"></div>
            <div className="h-6 bg-blue-800/30 rounded w-full mb-2"></div>
            <div className="h-6 bg-blue-800/30 rounded w-full mb-2"></div>
            <div className="h-6 bg-blue-800/30 rounded w-full mb-2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Render empty state
  if (subTypes.length === 0) {
    return (
      <div className="bg-[#0f1642] border border-blue-900/30 rounded-lg shadow-md">
        <div className="p-6 text-center">
          <h3 className="text-lg font-medium text-white mb-2">No subtypes found</h3>
          <p className="text-blue-300 mb-4">
            {isSimpleUser 
              ? "There are no subtypes matching your criteria." 
              : "Create your first subtype to get started."}
          </p>
        </div>
      </div>
    );
  }

  // Render subtype list
  return (
    <div className="bg-[#0f1642] border border-blue-900/30 rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-blue-900/20">
              <TableHead 
                onClick={() => handleSort('subTypeKey')}
                className="cursor-pointer hover:text-blue-400 transition-colors w-[150px]"
              >
                Key {sortField === 'subTypeKey' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                onClick={() => handleSort('name')}
                className="cursor-pointer hover:text-blue-400 transition-colors"
              >
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                onClick={() => handleSort('documentTypeId')}
                className="cursor-pointer hover:text-blue-400 transition-colors"
              >
                Document Type {sortField === 'documentTypeId' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                onClick={() => handleSort('startDate')}
                className="cursor-pointer hover:text-blue-400 transition-colors w-[150px]"
              >
                Start Date {sortField === 'startDate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                onClick={() => handleSort('endDate')}
                className="cursor-pointer hover:text-blue-400 transition-colors w-[150px]"
              >
                End Date {sortField === 'endDate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                onClick={() => handleSort('isActive')}
                className="cursor-pointer hover:text-blue-400 transition-colors w-[100px]"
              >
                Status {sortField === 'isActive' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSubTypes.map((subType) => (
              <TableRow key={subType.id} className="hover:bg-blue-900/20">
                <TableCell className="font-mono text-blue-300">{subType.subTypeKey}</TableCell>
                <TableCell className="font-medium text-white">{subType.name}</TableCell>
                <TableCell>{subType.documentType?.typeName || `Type ID: ${subType.documentTypeId}`}</TableCell>
                <TableCell>{formatDate(subType.startDate)}</TableCell>
                <TableCell>{formatDate(subType.endDate)}</TableCell>
                <TableCell>
                  <Badge className={subType.isActive ? "bg-green-600" : "bg-red-600"}>
                    {subType.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                            onClick={() => onEdit(subType)}
                            disabled={isSimpleUser}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit subtype</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => onDelete(subType)}
                            disabled={isSimpleUser}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete subtype</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SubTypeList;
