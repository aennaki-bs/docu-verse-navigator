import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
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
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Edit2,
  Copy,
  ChevronDown,
  Eye,
  MoreHorizontal,
  Archive,
  Download,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CircuitsTableProps {
  circuits: Circuit[];
  isSimpleUser: boolean;
  onEdit: (circuit: Circuit) => void;
  onDelete: (circuit: Circuit) => void;
  onViewDetails: (circuit: Circuit) => void;
}

export function CircuitsTable({
  circuits,
  isSimpleUser,
  onEdit,
  onDelete,
  onViewDetails,
}: CircuitsTableProps) {
  const { theme } = useSettings();
  const [selectedCircuits, setSelectedCircuits] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCircuits(paginatedCircuits.map((c) => c.id));
    } else {
      setSelectedCircuits([]);
    }
  };

  const handleSelectCircuit = (circuitId: number, checked: boolean) => {
    if (checked) {
      setSelectedCircuits((prev) => [...prev, circuitId]);
    } else {
      setSelectedCircuits((prev) => prev.filter((id) => id !== circuitId));
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(circuits.length / rowsPerPage);

  const paginatedCircuits = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return circuits.slice(startIndex, startIndex + rowsPerPage);
  }, [circuits, currentPage, rowsPerPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const isAllSelected =
    paginatedCircuits.length > 0 &&
    paginatedCircuits.every((circuit) => selectedCircuits.includes(circuit.id));

  const hasSelected = selectedCircuits.length > 0;

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
              <TableHead className="font-semibold">Circuit Code</TableHead>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Flow Type</TableHead>
              <TableHead className="text-right font-semibold pr-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCircuits.map((circuit, index) => {
              const isSelected = selectedCircuits.includes(circuit.id);
              const isEven = index % 2 === 0;

              return (
                <TableRow
                  key={circuit.id}
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
                  <TableCell className="w-10 text-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectCircuit(circuit.id, checked as boolean)
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
                  <TableCell
                    className={`
                    font-medium
                    ${theme === "dark" ? "text-blue-100" : "text-blue-800"}
                  `}
                  >
                    <Link
                      to={`/circuits/${circuit.id}/steps`}
                      className="hover:underline flex items-center"
                    >
                      <span
                        className={`
                        px-2.5 py-1 rounded-md text-xs mr-2 
                        ${
                          theme === "dark"
                            ? "bg-indigo-900/40 border border-indigo-700/50 text-indigo-300"
                            : "bg-indigo-100 border border-indigo-200 text-indigo-700"
                        }
                      `}
                      >
                        {circuit.circuitKey}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell
                    className={`
                    font-medium
                    ${theme === "dark" ? "text-blue-100" : "text-blue-800"}
                  `}
                  >
                    <Link
                      to={`/circuits/${circuit.id}/steps`}
                      className="hover:underline"
                    >
                      {circuit.title}
                    </Link>
                  </TableCell>
                  <TableCell
                    className={`
                    max-w-xs truncate
                    ${
                      theme === "dark" ? "text-blue-300/80" : "text-blue-600/80"
                    }
                  `}
                  >
                    {circuit.descriptif || "No description"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={circuit.isActive ? "default" : "secondary"}
                      className={
                        circuit.isActive
                          ? theme === "dark"
                            ? "bg-emerald-900/50 text-emerald-300 hover:bg-emerald-900/70 border-emerald-700/50"
                            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-300"
                          : theme === "dark"
                          ? "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800/70 border-zinc-700/50"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border-zinc-300"
                      }
                    >
                      {circuit.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        circuit.hasOrderedFlow
                          ? theme === "dark"
                            ? "border-cyan-700/50 bg-cyan-900/30 text-cyan-300"
                            : "border-cyan-300 bg-cyan-50 text-cyan-700"
                          : theme === "dark"
                          ? "border-fuchsia-700/50 bg-fuchsia-900/30 text-fuchsia-300"
                          : "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700"
                      }
                    >
                      {circuit.hasOrderedFlow ? "Sequential" : "Parallel"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-4">
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
                          <DropdownMenuLabel
                            className={
                              theme === "dark"
                                ? "text-blue-200"
                                : "text-blue-800"
                            }
                          >
                            Circuit Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator
                            className={
                              theme === "dark"
                                ? "bg-blue-900/50"
                                : "bg-blue-100"
                            }
                          />

                          <DropdownMenuItem
                            className={
                              theme === "dark"
                                ? "text-cyan-300 hover:bg-cyan-900/50 hover:text-cyan-200"
                                : "text-cyan-700 hover:bg-cyan-50"
                            }
                            onClick={() => onViewDetails(circuit)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className={
                              theme === "dark"
                                ? "text-indigo-300 hover:bg-indigo-900/50 hover:text-indigo-200"
                                : "text-indigo-700 hover:bg-indigo-50"
                            }
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Clone Circuit
                          </DropdownMenuItem>

                          {!isSimpleUser && (
                            <>
                              <DropdownMenuSeparator
                                className={
                                  theme === "dark"
                                    ? "bg-blue-900/50"
                                    : "bg-blue-100"
                                }
                              />

                              <DropdownMenuItem
                                className={
                                  theme === "dark"
                                    ? "text-amber-300 hover:bg-amber-900/50 hover:text-amber-200"
                                    : "text-amber-700 hover:bg-amber-50"
                                }
                                onClick={() => onEdit(circuit)}
                              >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit Circuit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className={
                                  theme === "dark"
                                    ? "text-red-400 hover:bg-red-900/30 hover:text-red-300"
                                    : "text-red-600 hover:bg-red-50"
                                }
                                onClick={() => onDelete(circuit)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Circuit
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
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
              {(currentPage - 1) * rowsPerPage + 1}-
              {Math.min(currentPage * rowsPerPage, circuits.length)} of{" "}
              {circuits.length}
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
              Page {currentPage} of {totalPages}
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
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              `}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
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
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              `}
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar (Fixed at bottom) */}
      {hasSelected && !isSimpleUser && (
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
              {selectedCircuits.length} circuit
              {selectedCircuits.length !== 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`
                ${
                  theme === "dark"
                    ? "bg-blue-900/20 border-blue-700/50 text-blue-200 hover:bg-blue-800/40"
                    : "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                }
              `}
            >
              <Archive className="h-3.5 w-3.5 mr-1.5" />
              <span>Archive</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`
                ${
                  theme === "dark"
                    ? "bg-green-900/20 border-green-700/50 text-green-200 hover:bg-green-800/40"
                    : "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                }
              `}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              <span>Export</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`
                ${
                  theme === "dark"
                    ? "bg-indigo-900/20 border-indigo-700/50 text-indigo-200 hover:bg-indigo-800/40"
                    : "bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                }
              `}
            >
              <Users className="h-3.5 w-3.5 mr-1.5" />
              <span>Assign to Circuit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`
                ${
                  theme === "dark"
                    ? "bg-red-900/20 border-red-800/50 text-red-300 hover:bg-red-900/40"
                    : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                }
              `}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              <span>Delete Selected</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
