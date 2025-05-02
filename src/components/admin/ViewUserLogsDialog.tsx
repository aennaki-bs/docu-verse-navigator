import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import adminService, { LogHistoryDto } from "@/services/adminService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Activity } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ViewUserLogsDialogProps {
  userId: number;
  username: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewUserLogsDialog({
  userId,
  username,
  open,
  onOpenChange,
}: ViewUserLogsDialogProps) {
  const { theme } = useSettings();
  const isLightMode = theme === "light";

  const {
    data: logs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userLogs", userId],
    queryFn: () => adminService.getUserLogs(userId),
    enabled: open,
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPp");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getActionName = (actionType: number): string => {
    const actions = {
      0: "Logout",
      1: "Login",
      2: "Create Profile",
      3: "Update Profile",
      4: "Create Document",
      5: "Update Document",
      6: "Delete Document",
      7: "Create Profile",
      8: "Update Profile",
      9: "Delete Profile",
    };
    return (
      actions[actionType as keyof typeof actions] || `Action ${actionType}`
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-[700px] max-h-[80vh] overflow-y-auto ${
          isLightMode
            ? "bg-white"
            : "bg-[#0a1033] border-blue-900/30 text-white"
        }`}
      >
        <DialogHeader>
          <DialogTitle className={isLightMode ? "text-gray-900" : "text-white"}>
            <div className="flex items-center">
              <Activity
                className={`mr-2 h-5 w-5 ${
                  isLightMode ? "text-blue-600" : "text-blue-400"
                }`}
              />
              Activity Logs: {username}
            </div>
          </DialogTitle>
          <DialogDescription
            className={isLightMode ? "text-gray-500" : "text-blue-300"}
          >
            Recent activity history for this user account.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <div
            className={`p-4 rounded-md flex items-center ${
              isLightMode
                ? "bg-red-50 text-red-700"
                : "bg-red-900/20 text-red-400"
            }`}
          >
            <AlertCircle className="h-5 w-5 mr-2" />
            Failed to load activity logs. Please try again.
          </div>
        ) : logs && logs.length > 0 ? (
          <Table>
            <TableHeader
              className={isLightMode ? "bg-gray-50" : "bg-blue-900/20"}
            >
              <TableRow
                className={
                  isLightMode
                    ? "border-gray-200 hover:bg-gray-100"
                    : "border-blue-900/30 hover:bg-blue-900/30"
                }
              >
                <TableHead
                  className={isLightMode ? "text-gray-700" : "text-blue-300"}
                >
                  Action
                </TableHead>
                <TableHead
                  className={isLightMode ? "text-gray-700" : "text-blue-300"}
                >
                  Details
                </TableHead>
                <TableHead
                  className={isLightMode ? "text-gray-700" : "text-blue-300"}
                >
                  Timestamp
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log: LogHistoryDto, index) => (
                <TableRow
                  key={index}
                  className={
                    isLightMode
                      ? "border-gray-200 hover:bg-gray-50"
                      : "border-blue-900/20 hover:bg-blue-900/10"
                  }
                >
                  <TableCell>
                    <Badge
                      className={getBadgeClass(log.actionType, isLightMode)}
                    >
                      {getActionName(log.actionType)}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={isLightMode ? "text-gray-700" : "text-white"}
                  >
                    {log.description || "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div
                      className={`flex items-center ${
                        isLightMode ? "text-gray-600" : "text-blue-300"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      {formatDate(log.timestamp)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div
            className={`p-8 text-center rounded-md ${
              isLightMode
                ? "bg-gray-50 text-gray-500"
                : "bg-blue-900/10 text-blue-300"
            }`}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-opacity-20 mb-4">
              <Clock
                className={`h-6 w-6 ${
                  isLightMode ? "text-gray-500" : "text-blue-300"
                }`}
              />
            </div>
            <h3
              className={`text-lg font-medium mb-1 ${
                isLightMode ? "text-gray-900" : "text-white"
              }`}
            >
              No Activity Found
            </h3>
            <p>This user has no recorded activity logs.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function getBadgeClass(actionType: number, isLightMode: boolean): string {
  if (isLightMode) {
    switch (actionType) {
      case 0:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 1:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 2:
      case 4:
      case 7:
        return "bg-green-100 text-green-800 border-green-200";
      case 3:
      case 5:
      case 8:
        return "bg-amber-100 text-amber-800 border-amber-200";
      case 6:
      case 9:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  } else {
    switch (actionType) {
      case 0:
        return "bg-yellow-900/30 text-yellow-400 border-yellow-800/50";
      case 1:
        return "bg-blue-900/30 text-blue-400 border-blue-800/50";
      case 2:
      case 4:
      case 7:
        return "bg-green-900/30 text-green-400 border-green-800/50";
      case 3:
      case 5:
      case 8:
        return "bg-amber-900/30 text-amber-400 border-amber-800/50";
      case 6:
      case 9:
        return "bg-red-900/30 text-red-400 border-red-800/50";
      default:
        return "bg-gray-800/40 text-gray-400 border-gray-700/50";
    }
  }
}
