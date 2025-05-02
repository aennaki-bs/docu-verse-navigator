import { Badge } from "@/components/ui/badge";
import { useState, useMemo, ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSettings } from "@/context/SettingsContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Archive,
  Download,
  Users,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Column<T> {
  header: string;
  key: keyof T | "actions";
  cell?: (item: T) => ReactNode;
  width?: string;
}

export interface BulkAction {
  label: string;
  icon: ReactNode;
  onClick: (selectedIds: number[]) => void;
  color?: "blue" | "green" | "red" | "indigo" | "purple" | "amber" | "cyan";
}

export interface Action<T> {
  label: string;
  icon: ReactNode;
  onClick: (item: T) => void;
  color?: "blue" | "green" | "red" | "indigo" | "purple" | "amber" | "cyan";
  show?: (item: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowId: (item: T) => number;
  actions?: Action<T>[];
  bulkActions?: BulkAction[];
  isSimpleUser?: boolean;
}

export function DataTable<T extends object = any>({
  data = [],
  columns,
  getRowId,
  actions = [],
  bulkActions = [],
  isSimpleUser = false,
}: DataTableProps<T>) {
  const { theme } = useSettings();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Pagination logic
  const totalPages = Math.ceil((data?.length || 0) / rowsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return data?.slice(startIndex, startIndex + rowsPerPage) || [];
  }, [data, currentPage, rowsPerPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedData.map(getRowId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.includes(getRowId(item)));

  const hasSelected = selectedIds.length > 0;

  // Styles for different themes
  const tableStyles = {
    background:
      theme === "dark"
        ? "bg-[#0c1228] border-b border-blue-900/40"
        : "bg-white border-b border-blue-200/60",
    stripedRow: theme === "dark" ? "bg-[#0e1531]/80" : "bg-blue-50/50",
    header:
      theme === "dark"
        ? "bg-[#111a3c] text-blue-300 border-blue-800/50"
        : "bg-blue-50 text-blue-700 border-blue-200/70",
    selectedRow:
      theme === "dark"
        ? "bg-blue-900/40 border-blue-700/50"
        : "bg-blue-100/80 border-blue-300/50",
    hoverRow:
      theme === "dark" ? "hover:bg-blue-900/20" : "hover:bg-blue-100/50",
  };

  const getColorStyles = (color = "blue") => {
    const colorMap = {
      blue:
        theme === "dark"
          ? "bg-blue-900/20 border-blue-700/50 text-blue-200 hover:bg-blue-800/40"
          : "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100",
      green:
        theme === "dark"
          ? "bg-green-900/20 border-green-700/50 text-green-200 hover:bg-green-800/40"
          : "bg-green-50 border-green-300 text-green-700 hover:bg-green-100",
      red:
        theme === "dark"
          ? "bg-red-900/20 border-red-800/50 text-red-300 hover:bg-red-900/40"
          : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100",
      indigo:
        theme === "dark"
          ? "bg-indigo-900/20 border-indigo-700/50 text-indigo-200 hover:bg-indigo-800/40"
          : "bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100",
      purple:
        theme === "dark"
          ? "bg-purple-900/20 border-purple-700/50 text-purple-200 hover:bg-purple-800/40"
          : "bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100",
      amber:
        theme === "dark"
          ? "bg-amber-900/20 border-amber-700/50 text-amber-200 hover:bg-amber-800/40"
          : "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100",
      cyan:
        theme === "dark"
          ? "bg-cyan-900/20 border-cyan-700/50 text-cyan-200 hover:bg-cyan-800/40"
          : "bg-cyan-50 border-cyan-300 text-cyan-700 hover:bg-cyan-100",
    };

    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <div className="rounded-md overflow-hidden shadow-sm relative">
      <div
        className={`${
          theme === "dark" ? "bg-[#070d1f]" : "bg-white"
        } rounded-md`}
      >
        <Table>
          <TableHeader>
            <TableRow className={tableStyles.header}>
              {bulkActions.length > 0 && !isSimpleUser && (
                <TableHead className="w-10 text-center">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) =>
                      handleSelectAll(checked as boolean)
                    }
                    className={`
                      ${
                        theme === "dark"
                          ? "border-blue-500/50 data-[state=checked]:bg-indigo-600"
                          : "border-blue-300 data-[state=checked]:bg-indigo-500"
                      }
                    `}
                  />
                </TableHead>
              )}

              {columns.map((column) => (
                <TableHead
                  key={column.key as string}
                  className={`font-semibold ${column.width || ""}`}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => {
              const id = getRowId(item);
              const isSelected = selectedIds.includes(id);
              const isEven = index % 2 === 0;

              return (
                <TableRow
                  key={id}
                  className={`
                    transition-colors
                    ${
                      isSelected
                        ? tableStyles.selectedRow
                        : isEven
                        ? tableStyles.background
                        : tableStyles.stripedRow
                    }
                    ${tableStyles.hoverRow}
                  `}
                >
                  {bulkActions.length > 0 && !isSimpleUser && (
                    <TableCell className="w-10 text-center">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSelectItem(id, checked as boolean)
                        }
                        className={`
                          ${
                            theme === "dark"
                              ? "border-blue-500/50 data-[state=checked]:bg-indigo-600"
                              : "border-blue-300 data-[state=checked]:bg-indigo-500"
                          }
                        `}
                      />
                    </TableCell>
                  )}

                  {columns.map((column) => (
                    <TableCell key={column.key as string}>
                      {column.key === "actions" ? (
                        <div className="flex justify-end items-center gap-1.5">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`
                                  h-8 w-8 rounded-full
                                  ${
                                    theme === "dark"
                                      ? "text-purple-400 hover:text-purple-300 hover:bg-purple-900/40"
                                      : "text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                                  }
                                `}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className={
                                theme === "dark"
                                  ? "bg-[#111a3c] border-blue-900/50"
                                  : "bg-white border-blue-200"
                              }
                            >
                              {actions
                                .filter(
                                  (action) => !action.show || action.show(item)
                                )
                                .map((action, actionIndex) => (
                                  <DropdownMenuItem
                                    key={actionIndex}
                                    className={
                                      theme === "dark"
                                        ? `text-${
                                            action.color || "blue"
                                          }-300 hover:bg-${
                                            action.color || "blue"
                                          }-900/50 hover:text-${
                                            action.color || "blue"
                                          }-200`
                                        : `text-${
                                            action.color || "blue"
                                          }-700 hover:bg-${
                                            action.color || "blue"
                                          }-50`
                                    }
                                    onClick={() => action.onClick(item)}
                                  >
                                    {action.icon}
                                    <span className="ml-2">{action.label}</span>
                                  </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ) : column.cell ? (
                        column.cell(item)
                      ) : (
                        (item[column.key as keyof T] as ReactNode)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div
          className={`
            flex items-center justify-between px-4 py-3 border-t
            ${
              theme === "dark"
                ? "bg-[#0c1228] border-blue-900/50 text-blue-200"
                : "bg-white border-blue-100 text-blue-800"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm">Rows per page:</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => {
                setRowsPerPage(Number(value));
                setCurrentPage(1); // Reset to first page when changing rows per page
              }}
            >
              <SelectTrigger
                className={`w-[80px] h-8 text-xs
                  ${
                    theme === "dark"
                      ? "bg-[#111a3c] border-blue-800/50"
                      : "bg-blue-50 border-blue-200"
                  }
                `}
              >
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent
                className={
                  theme === "dark"
                    ? "bg-[#111a3c] border-blue-900/50 text-blue-300"
                    : "bg-white border-blue-200"
                }
              >
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-sm">
              {(data?.length || 0) > 0 ? (
                <>
                  {(currentPage - 1) * rowsPerPage + 1}-
                  {Math.min(currentPage * rowsPerPage, data?.length || 0)} of{" "}
                  {data?.length || 0}
                </>
              ) : (
                "0 items"
              )}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full
                ${
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900/40"
                    : "text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                }
                ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full
                ${
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900/40"
                    : "text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                }
                ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="mx-2 text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>

            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full
                ${
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900/40"
                    : "text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                }
                ${
                  currentPage === totalPages || data.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              `}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || data.length === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full
                ${
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900/40"
                    : "text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                }
                ${
                  currentPage === totalPages || data.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              `}
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages || data.length === 0}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar (Fixed at bottom) */}
      {hasSelected && bulkActions.length > 0 && !isSimpleUser && (
        <div
          className={`
            fixed bottom-0 right-0 z-10 flex items-center justify-between px-4 py-3
            border-t shadow-lg w-full
            ${
              theme === "dark"
                ? "bg-[#0c1228] border-blue-900/50 text-blue-100"
                : "bg-white border-blue-200 text-blue-800"
            }
          `}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                theme === "dark" ? "text-blue-200" : "text-blue-700"
              }`}
            >
              {selectedIds.length} item{selectedIds.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={getColorStyles(action.color)}
                onClick={() => action.onClick(selectedIds)}
              >
                {action.icon}
                <span className="ml-1.5">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
