import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const { theme } = useSettings();
  const isLightMode = theme === "light";
  const pageSizeOptions = [5, 10, 25, 50, 100];

  // Calculate the range of items being displayed
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Configure light/dark mode styles
  const styles = isLightMode
    ? {
        container:
          "flex items-center justify-between py-4 bg-gray-50 border-t border-gray-200 text-gray-700 px-4",
        select: {
          trigger: "w-[80px] h-8 text-xs bg-white border-gray-300",
          content: "bg-white border-gray-200 text-gray-800",
        },
        button:
          "h-8 w-8 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        disabledButton: "opacity-50 cursor-not-allowed",
        text: "text-sm text-gray-600",
      }
    : {
        container:
          "flex items-center justify-between py-4 bg-[#0c1228] border-t border-blue-900/50 text-blue-200 px-4",
        select: {
          trigger: "w-[80px] h-8 text-xs bg-[#111a3c] border-blue-800/50",
          content: "bg-[#111a3c] border-blue-900/50 text-blue-300",
        },
        button:
          "h-8 w-8 rounded-full text-blue-400 hover:text-blue-300 hover:bg-blue-900/40",
        disabledButton: "opacity-50 cursor-not-allowed",
        text: "text-sm text-blue-200",
      };

  return (
    <div className={styles.container}>
      <div className="flex items-center gap-3">
        <span className={styles.text}>Rows per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className={styles.select.trigger}>
            <SelectValue placeholder={pageSize.toString()} />
          </SelectTrigger>
          <SelectContent className={styles.select.content}>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className={styles.text}>
          {totalItems > 0 ? (
            <>
              {startItem}-{endItem} of {totalItems}
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
          className={`${styles.button} ${
            currentPage === 1 ? styles.disabledButton : ""
          }`}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`${styles.button} ${
            currentPage === 1 ? styles.disabledButton : ""
          }`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className={`mx-2 ${styles.text}`}>
          Page {currentPage} of {totalPages || 1}
        </span>

        <Button
          variant="ghost"
          size="icon"
          className={`${styles.button} ${
            currentPage === totalPages || totalItems === 0
              ? styles.disabledButton
              : ""
          }`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalItems === 0}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`${styles.button} ${
            currentPage === totalPages || totalItems === 0
              ? styles.disabledButton
              : ""
          }`}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalItems === 0}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
