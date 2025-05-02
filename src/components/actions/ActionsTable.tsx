import { useState } from "react";
import { Action } from "@/models/action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Link } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ActionsTableProps {
  actions: Action[];
  onEditAction: (action: Action) => void;
  onDeleteAction: (action: Action) => void;
  onAssignAction: (action: Action) => void;
  selectedActions?: Action[];
  onSelectionChange?: (selectedActions: Action[]) => void;
}

export function ActionsTable({
  actions,
  onEditAction,
  onDeleteAction,
  onAssignAction,
  selectedActions = [],
  onSelectionChange,
}: ActionsTableProps) {
  const [selected, setSelected] = useState<Action[]>(selectedActions);

  const isSelected = (actionId: number) =>
    selected.some((action) => action.actionId === actionId);

  const handleSelectAll = () => {
    if (selected.length === actions.length) {
      setSelected([]);
      onSelectionChange?.([]);
    } else {
      setSelected([...actions]);
      onSelectionChange?.([...actions]);
    }
  };

  const handleSelectAction = (action: Action) => {
    const isAlreadySelected = isSelected(action.actionId);
    let newSelected: Action[];

    if (isAlreadySelected) {
      newSelected = selected.filter((a) => a.actionId !== action.actionId);
    } else {
      newSelected = [...selected, action];
    }

    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  return (
    <div className="bg-[#0f1642] border border-blue-900/30 rounded-md overflow-hidden">
      <Table>
        <TableHeader className="bg-blue-900/20">
          <TableRow className="hover:bg-blue-900/30 border-b border-blue-900/30">
            {onSelectionChange && (
              <TableHead className="w-[50px] text-center">
                <Checkbox
                  checked={
                    selected.length > 0 && selected.length === actions.length
                  }
                  indeterminate={
                    selected.length > 0 && selected.length < actions.length
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  className="translate-y-[2px]"
                />
              </TableHead>
            )}
            <TableHead className="text-blue-300 font-semibold">
              Action Key
            </TableHead>
            <TableHead className="text-blue-300 font-semibold">Title</TableHead>
            <TableHead className="text-blue-300 font-semibold">
              Description
            </TableHead>
            <TableHead className="text-right text-blue-300 font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions.length === 0 ? (
            <TableRow className="hover:bg-blue-900/10 border-b border-blue-900/20">
              <TableCell
                colSpan={onSelectionChange ? 5 : 4}
                className="h-24 text-center text-blue-400"
              >
                No actions found.
              </TableCell>
            </TableRow>
          ) : (
            actions.map((action) => (
              <TableRow
                key={action.actionId}
                className={`border-b border-blue-900/20 ${
                  isSelected(action.actionId)
                    ? "bg-blue-900/30 hover:bg-blue-900/40"
                    : "hover:bg-blue-900/10"
                }`}
              >
                {onSelectionChange && (
                  <TableCell className="text-center">
                    <Checkbox
                      checked={isSelected(action.actionId)}
                      onCheckedChange={() => handleSelectAction(action)}
                      aria-label={`Select ${action.title}`}
                    />
                  </TableCell>
                )}
                <TableCell className="font-mono text-sm text-blue-400">
                  {action.actionKey}
                </TableCell>
                <TableCell className="font-medium">{action.title}</TableCell>
                <TableCell className="max-w-[400px] truncate text-gray-300">
                  {action.description}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onAssignAction(action)}
                      className="h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-blue-900/50 transition-colors"
                      title="Assign to Step"
                    >
                      <Link className="h-4 w-4" />
                    </Button> */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditAction(action)}
                      className="h-8 w-8 text-yellow-500 hover:text-yellow-400 hover:bg-blue-900/50 transition-colors"
                      title="Edit Action"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteAction(action)}
                      className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-blue-900/50 transition-colors"
                      title="Delete Action"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
