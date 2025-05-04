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
  theme?: string;
  selectedActions?: ActionItem[];
  onSelectionChange?: (actions: ActionItem[]) => void;
}

export function ActionsTable({
  actions,
  onEditAction,
  onDeleteAction,
  onViewAction,
  isSimpleUser = false,
  isRefreshing = false,
  theme = "dark",
  selectedActions = [],
  onSelectionChange = () => {},
}: ActionsTableProps) {
  // Theme-based styles
  const actionKeyClass = theme === "dark"
    ? "bg-blue-100/70 border-blue-200/60 text-blue-700" 
    : "bg-blue-50 border-blue-100 text-blue-600";
  
  const textClass = theme === "dark"
    ? "text-muted-foreground" 
    : "text-gray-500";
  
  const loadingBgClass = theme === "dark"
    ? "text-blue-500" 
    : "text-blue-600";
  
  const loadingTextClass = theme === "dark"
    ? "text-blue-400" 
    : "text-blue-500";

  // Define columns
  const columns: Column<ActionItem>[] = [
    {
      header: "Action Key",
      key: "actionKey",
      cell: (item) => (
        <span className={`font-mono text-xs px-2.5 py-1 rounded-md border ${actionKeyClass}`}>
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
        <span className={`${textClass} max-w-md truncate block`}>
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
          onClick: (ids) => {
            const selectedItems = actions.filter(a => ids.includes(a.id));
            if (onSelectionChange && selectedItems.length > 0) {
              onSelectionChange(selectedItems);
            }
          },
          color: "red",
        },
      ]
    : [];

  if (isRefreshing) {
    return (
      <div className="w-full flex items-center justify-center p-8">
        <div className="flex flex-col items-center text-center">
          <RefreshCw className={`h-6 w-6 animate-spin mb-2 ${loadingBgClass}`} />
          <p className={`text-sm ${loadingTextClass}`}>Refreshing actions...</p>
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
      className={theme === "dark" ? "dark-mode-table" : "light-mode-table"}
      selectedItems={selectedActions}
      onSelectionChange={onSelectionChange}
    />
  );
}
