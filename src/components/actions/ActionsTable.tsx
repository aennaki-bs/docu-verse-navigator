import { Pencil, Trash2, Eye, RefreshCw } from "lucide-react";
import { Column, Action, BulkAction } from "@/components/table/DataTable";
import { createDataTable } from "@/components/table/create-data-table";

interface ActionItem {
  id: number;
  actionKey: string;
  title: string;
  description: string;
}

// Create a typed DataTable for ActionItem
const ActionItemTable = createDataTable<ActionItem>();

interface ActionsTableProps {
  actions: ActionItem[];
  onEditAction?: (action: ActionItem) => void;
  onDeleteAction?: (action: ActionItem) => void;
  onViewAction?: (action: ActionItem) => void;
  isSimpleUser?: boolean;
  isRefreshing?: boolean;
}

export function ActionsTable({
  actions,
  onEditAction,
  onDeleteAction,
  onViewAction,
  isSimpleUser = false,
  isRefreshing = false,
}: ActionsTableProps) {
  // Define columns
  const columns: Column<ActionItem>[] = [
    {
      header: "Action Key",
      key: "actionKey",
      cell: (item) => (
        <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-blue-100/70 border border-blue-200/60 text-blue-700">
          {item.actionKey}
        </span>
      ),
    },
    {
      header: "Title",
      key: "title",
      cell: (item) => <span className="font-medium">{item.title}</span>,
    },
    {
      header: "Description",
      key: "description",
      cell: (item) => (
        <span className="text-muted-foreground max-w-md truncate block">
          {item.description || "No description"}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      width: "w-20",
    },
  ];

  // Define row actions
  const tableActions: Action<ActionItem>[] = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4 mr-2" />,
      onClick: onViewAction || (() => {}),
      color: "blue",
      show: () => !!onViewAction,
    },
    {
      label: "Edit Action",
      icon: <Pencil className="h-4 w-4 mr-2" />,
      onClick: onEditAction || (() => {}),
      color: "amber",
      show: () => !isSimpleUser && !!onEditAction,
    },
    {
      label: "Delete Action",
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      onClick: onDeleteAction || (() => {}),
      color: "red",
      show: () => !isSimpleUser && !!onDeleteAction,
    },
  ];

  // Define bulk actions
  const bulkActions: BulkAction[] = !isSimpleUser
    ? [
        {
          label: "Delete Selected",
          icon: <Trash2 className="h-3.5 w-3.5 mr-1.5" />,
          onClick: (ids) => console.log("Delete actions", ids),
          color: "red",
        },
      ]
    : [];

  if (isRefreshing) {
    return (
      <div className="w-full flex items-center justify-center p-8">
        <div className="flex flex-col items-center text-center">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-500 mb-2" />
          <p className="text-sm text-blue-400">Refreshing actions...</p>
        </div>
      </div>
    );
  }

  return (
    <ActionItemTable
      data={actions}
      columns={columns}
      getRowId={(item) => item.id}
      actions={tableActions}
      bulkActions={bulkActions}
      isSimpleUser={isSimpleUser}
    />
  );
}
