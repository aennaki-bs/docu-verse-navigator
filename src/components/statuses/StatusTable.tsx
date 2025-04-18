
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DocumentStatus } from '@/models/documentCircuit';

interface StatusTableProps {
  statuses: DocumentStatus[];
  onEdit: (status: DocumentStatus) => void;
  onDelete: (status: DocumentStatus) => void;
  isSimpleUser: boolean;
}

export function StatusTable({ statuses, onEdit, onDelete, isSimpleUser }: StatusTableProps) {
  if (!statuses || statuses.length === 0) {
    return (
      <div className="flex justify-center items-center h-32 text-gray-500">
        No statuses found for this step.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-blue-900/10">
          <TableRow>
            <TableHead className="w-[250px]">Status ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-[120px] text-center">Required</TableHead>
            <TableHead className="w-[120px] text-center">Complete</TableHead>
            {!isSimpleUser && (
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {statuses.map((status) => (
            <TableRow key={status.statusId}>
              <TableCell className="font-mono text-xs opacity-70">
                {status.statusKey}
              </TableCell>
              <TableCell className="font-medium">{status.title}</TableCell>
              <TableCell className="text-center">
                {status.isRequired ? (
                  <Badge variant="outline" className="bg-amber-700/20 border-amber-700/30 text-amber-200">
                    Required
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-blue-900/10 border-blue-900/30">
                    Optional
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-center">
                {status.isComplete ? (
                  <Badge variant="outline" className="bg-green-700/20 border-green-700/30 text-green-200">
                    Complete
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-800/30 border-gray-800/30">
                    Incomplete
                  </Badge>
                )}
              </TableCell>
              {!isSimpleUser && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(status)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(status)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
