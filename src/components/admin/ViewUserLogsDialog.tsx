
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
import { History, ScrollText } from 'lucide-react';

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

  // Map numeric action types to readable text based on backend enum
  const getActionTypeText = (actionType: number): string => {
    switch (actionType) {
      case 0: return 'Logout';
      case 1: return 'Login';
      case 2: return 'Create Profile';
      case 3: return 'Update Profile';
      case 4: return 'Create Document';
      case 5: return 'Update Document';
      case 6: return 'Delete Document';
      case 7: return 'Create User';
      case 8: return 'Update User';
      case 9: return 'Delete User';
      default: return `Action ${actionType}`;
    }
  };

  const getActionColor = (actionType: number) => {
    // Color coding based on action type
    switch (actionType) {
      case 0: // Logout
        return 'bg-yellow-100 text-yellow-800';
      case 1: // Login
        return 'bg-purple-100 text-purple-800';
      case 2: // Create Profile
      case 4: // Create Document
      case 7: // Create User
        return 'bg-green-100 text-green-800';
      case 3: // Update Profile
      case 5: // Update Document
      case 8: // Update User
        return 'bg-blue-100 text-blue-800';
      case 6: // Delete Document
      case 9: // Delete User
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            User Activity Logs
          </DialogTitle>
          <DialogDescription>
            View all activity history for this user
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
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge className={getActionColor(log.actionType)}>
                        {getActionTypeText(log.actionType)}
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
                    <TableCell>
                      {log.description ? (
                        <span className="text-sm text-muted-foreground">{log.description}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">No additional details</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 flex flex-col items-center">
            <ScrollText className="h-12 w-12 text-gray-300 mb-2" />
            <p>No activity logs found for this user</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
