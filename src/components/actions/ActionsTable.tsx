
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Action } from '@/models/action';

interface ActionsTableProps {
  actions: Action[];
  onEditAction: (action: Action) => void;
  onDeleteAction: (action: Action) => void;
}

export function ActionsTable({ actions, onEditAction, onDeleteAction }: ActionsTableProps) {
  return (
    <Table>
      <TableHeader className="bg-blue-900/20">
        <TableRow className="border-blue-900/30">
          <TableHead className="text-blue-200">Action Key</TableHead>
          <TableHead className="text-blue-200">Title</TableHead>
          <TableHead className="text-blue-200">Description</TableHead>
          <TableHead className="text-blue-200 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {actions.map((action) => (
          <TableRow key={action.id} className="border-blue-900/30">
            <TableCell className="font-mono">{action.actionKey}</TableCell>
            <TableCell>{action.title}</TableCell>
            <TableCell className="max-w-[300px] truncate">
              {action.description}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditAction(action)}
                  className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/40"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteAction(action)}
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
