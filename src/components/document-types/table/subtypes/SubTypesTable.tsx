
import { SubType } from '@/models/subType';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface SubTypesTableProps {
  subTypes: SubType[];
  isLoading: boolean;
  onEdit: (subType: SubType) => void;
  onDelete: (subType: SubType) => void;
}

export function SubTypesTable({ subTypes, isLoading, onEdit, onDelete }: SubTypesTableProps) {
  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  if (isLoading) {
    return <div className="text-blue-300/70 text-sm">Loading subtypes...</div>;
  }

  if (subTypes.length === 0) {
    return (
      <div className="text-blue-300/70 text-sm text-center py-8">
        No subtypes defined for this document type yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Key</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subTypes.map((subType) => (
          <TableRow key={subType.id}>
            <TableCell className="font-mono text-sm text-blue-300">
              {subType.subTypeKey}
            </TableCell>
            <TableCell>{subType.name}</TableCell>
            <TableCell>{formatDate(subType.startDate)}</TableCell>
            <TableCell>{formatDate(subType.endDate)}</TableCell>
            <TableCell>
              <Badge 
                variant={subType.isActive ? 'success' : 'secondary'}
                className={subType.isActive ? 'bg-green-500/20 text-green-400' : ''}
              >
                {subType.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                  onClick={() => onEdit(subType)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={() => onDelete(subType)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
