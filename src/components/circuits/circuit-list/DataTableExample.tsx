import {
  Eye,
  Edit2,
  Trash2,
  Copy,
  Archive,
  Download,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  DataTable,
  Column,
  Action,
  BulkAction,
} from "@/components/table/DataTable";

interface Circuit {
  id: number;
  circuitKey: string;
  title: string;
  descriptif: string | null;
  isActive: boolean;
  hasOrderedFlow: boolean;
}

interface CircuitsTableExampleProps {
  circuits: Circuit[];
  isSimpleUser: boolean;
  onEdit: (circuit: Circuit) => void;
  onDelete: (circuit: Circuit) => void;
  onViewDetails: (circuit: Circuit) => void;
}

export function CircuitsTableExample({
  circuits,
  isSimpleUser,
  onEdit,
  onDelete,
  onViewDetails,
}: CircuitsTableExampleProps) {
  // Define table columns
  const columns: Column<Circuit>[] = [
    {
      header: "Circuit Code",
      key: "circuitKey",
      cell: (circuit) => (
        <Link
          to={`/circuits/${circuit.id}/steps`}
          className="hover:underline flex items-center"
        >
          <span className="px-2.5 py-1 rounded-md text-xs mr-2 bg-indigo-100 border border-indigo-200 text-indigo-700">
            {circuit.circuitKey}
          </span>
        </Link>
      ),
    },
    {
      header: "Title",
      key: "title",
      cell: (circuit) => (
        <Link
          to={`/circuits/${circuit.id}/steps`}
          className="hover:underline font-medium text-blue-800"
        >
          {circuit.title}
        </Link>
      ),
    },
    {
      header: "Description",
      key: "descriptif",
      cell: (circuit) => (
        <span className="max-w-xs truncate block text-blue-600/80">
          {circuit.descriptif || "No description"}
        </span>
      ),
    },
    {
      header: "Status",
      key: "isActive",
      cell: (circuit) => (
        <Badge
          variant={circuit.isActive ? "default" : "secondary"}
          className={
            circuit.isActive
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-300"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border-zinc-300"
          }
        >
          {circuit.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Flow Type",
      key: "hasOrderedFlow",
      cell: (circuit) => (
        <Badge
          variant="outline"
          className={
            circuit.hasOrderedFlow
              ? "border-cyan-300 bg-cyan-50 text-cyan-700"
              : "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700"
          }
        >
          {circuit.hasOrderedFlow ? "Sequential" : "Parallel"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      width: "w-24",
    },
  ];

  // Define row actions
  const actions: Action<Circuit>[] = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4 mr-2" />,
      onClick: onViewDetails,
      color: "cyan",
    },
    {
      label: "Clone Circuit",
      icon: <Copy className="h-4 w-4 mr-2" />,
      onClick: (circuit) => console.log("Clone circuit", circuit),
      color: "indigo",
    },
    {
      label: "Edit Circuit",
      icon: <Edit2 className="h-4 w-4 mr-2" />,
      onClick: onEdit,
      color: "amber",
      show: () => !isSimpleUser,
    },
    {
      label: "Delete Circuit",
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      onClick: onDelete,
      color: "red",
      show: () => !isSimpleUser,
    },
  ];

  // Define bulk actions
  const bulkActions: BulkAction[] = [
    {
      label: "Archive",
      icon: <Archive className="h-3.5 w-3.5 mr-1.5" />,
      onClick: (ids) => console.log("Archive circuits", ids),
      color: "blue",
    },
    {
      label: "Export",
      icon: <Download className="h-3.5 w-3.5 mr-1.5" />,
      onClick: (ids) => console.log("Export circuits", ids),
      color: "green",
    },
    {
      label: "Assign to Circuit",
      icon: <Users className="h-3.5 w-3.5 mr-1.5" />,
      onClick: (ids) => console.log("Assign circuits", ids),
      color: "indigo",
    },
    {
      label: "Delete Selected",
      icon: <Trash2 className="h-3.5 w-3.5 mr-1.5" />,
      onClick: (ids) => console.log("Delete circuits", ids),
      color: "red",
    },
  ];

  return (
    <DataTable<Circuit>
      data={circuits}
      columns={columns}
      getRowId={(circuit) => circuit.id}
      actions={actions}
      bulkActions={bulkActions}
      isSimpleUser={isSimpleUser}
    />
  );
}
