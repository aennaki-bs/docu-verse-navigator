
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import adminService from '@/services/adminService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ViewUserLogsDialogProps {
  userId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewUserLogsDialog({ 
  userId, 
  open, 
  onOpenChange 
}: ViewUserLogsDialogProps) {
  const { data: logs, isLoading, isError } = useQuery({
    queryKey: ['user-logs', userId],
    queryFn: () => adminService.getUserLogs(userId),
    enabled: open,
  });

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'login':
        return 'bg-purple-100 text-purple-800';
      case 'logout':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Activity Logs</DialogTitle>
          <DialogDescription>
            View all activity logs for this user
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-10">Loading logs...</div>
        ) : isError ? (
          <div className="text-red-500 py-10">Error loading activity logs</div>
        ) : logs && logs.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge className={getActionColor(log.actionType)}>
                        {log.actionType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(log.timestamp), 'PPpp')}
                    </TableCell>
                    <TableCell>
                      {log.user.username}
                      <span className="text-xs text-gray-500 ml-2">
                        ({log.user.role})
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No activity logs found for this user
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
