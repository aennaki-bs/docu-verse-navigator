import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  File,
  Plus,
  Trash,
  Edit,
  Search,
  FileText,
  AlertCircle,
  ArrowUpDown,
  CalendarDays,
  Tag,
  Calendar,
  Filter,
  GitBranch,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import documentService from "@/services/documentService";
import { Document } from "@/models/document";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import AssignCircuitDialog from "@/components/circuits/AssignCircuitDialog";
import DocumentsWrapper from "@/components/document/DocumentsWrapper";

const mockDocuments: Document[] = [
  {
    id: 1,
    documentKey: "DOC-2023-001",
    title: "Project Proposal",
    content: "This is a sample project proposal document.",
    docDate: new Date().toISOString(),
    status: 1,
    documentAlias: "Project-Proposal-001",
    documentType: { id: 1, typeName: "Proposal" },
    createdBy: {
      id: 1,
      username: "john.doe",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "Admin",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lignesCount: 3,
    typeId: 1,
    createdByUserId: 1,
  },
  {
    id: 2,
    documentKey: "DOC-2023-002",
    title: "Financial Report",
    content: "Quarterly financial report for Q2 2023.",
    docDate: new Date().toISOString(),
    status: 1,
    documentAlias: "Financial-Report-Q2",
    documentType: { id: 2, typeName: "Report" },
    createdBy: {
      id: 2,
      username: "jane.smith",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      role: "FullUser",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lignesCount: 5,
    typeId: 2,
    createdByUserId: 2,
  },
  {
    id: 3,
    documentKey: "DOC-2023-003",
    title: "Meeting Minutes",
    content: "Minutes from the board meeting on August 15, 2023.",
    docDate: new Date().toISOString(),
    status: 0,
    documentAlias: "Board-Minutes-Aug15",
    documentType: { id: 3, typeName: "Minutes" },
    createdBy: {
      id: 1,
      username: "john.doe",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "Admin",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lignesCount: 2,
    typeId: 3,
    createdByUserId: 1,
  },
  {
    id: 4,
    documentKey: "DOC-2023-004",
    title: "Product Specifications",
    content: "Technical specifications for the new product line.",
    docDate: new Date().toISOString(),
    status: 2,
    documentAlias: "Product-Specs-2023",
    documentType: { id: 4, typeName: "Specifications" },
    createdBy: {
      id: 3,
      username: "alex.tech",
      firstName: "Alex",
      lastName: "Tech",
      email: "alex@example.com",
      role: "FullUser",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lignesCount: 8,
    typeId: 4,
    createdByUserId: 3,
  },
  {
    id: 5,
    documentKey: "DOC-2023-005",
    title: "Marketing Strategy",
    content: "Marketing strategy for Q3 and Q4 2023.",
    docDate: new Date().toISOString(),
    status: 1,
    documentAlias: "Marketing-Strategy-Q3Q4",
    documentType: { id: 5, typeName: "Strategy" },
    createdBy: {
      id: 4,
      username: "sarah.marketing",
      firstName: "Sarah",
      lastName: "Marketing",
      email: "sarah@example.com",
      role: "SimpleUser",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lignesCount: 4,
    typeId: 5,
    createdByUserId: 4,
  },
];

const Documents = () => {
  const { user, logout } = useAuth();
  const { theme } = useSettings();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;
  const [useFakeData, setUseFakeData] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [assignCircuitDialogOpen, setAssignCircuitDialogOpen] = useState(false);
  const [documentToAssign, setDocumentToAssign] = useState<Document | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);

  const canManageDocuments =
    user?.role === "Admin" || user?.role === "FullUser";

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const data = await documentService.getAllDocuments();
      setDocuments(data);
      setTotalPages(Math.ceil(data.length / pageSize));
      setUseFakeData(false);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      toast.error("Failed to load documents. Using test data instead.");
      setDocuments(mockDocuments);
      setTotalPages(Math.ceil(mockDocuments.length / pageSize));
      setUseFakeData(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (useFakeData) {
      toast.info("You are currently viewing test data", {
        duration: 5000,
        position: "top-right",
      });
    }
  }, [useFakeData]);

  const handleLogout = () => {
    logout(navigate);
  };

  const handleSelectDocument = (id: number) => {
    if (!canManageDocuments) {
      toast.error("You do not have permission to select documents");
      return;
    }

    setSelectedDocuments((prev) => {
      if (prev.includes(id)) {
        return prev.filter((docId) => docId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (!canManageDocuments) {
      toast.error("You do not have permission to select documents");
      return;
    }

    if (selectedDocuments.length === getPageDocuments().length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(getPageDocuments().map((doc) => doc.id));
    }
  };

  const openDeleteDialog = (id?: number) => {
    if (!canManageDocuments) {
      toast.error("You do not have permission to delete documents");
      return;
    }

    if (id) {
      setDocumentToDelete(id);
    } else if (selectedDocuments.length > 0) {
      setDocumentToDelete(null);
    } else {
      return;
    }
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (documentToDelete) {
        if (useFakeData) {
          setDocuments((prev) =>
            prev.filter((doc) => doc.id !== documentToDelete)
          );
          toast.success("Document deleted successfully (simulated)");
        } else {
          await documentService.deleteDocument(documentToDelete);
          toast.success("Document deleted successfully");
        }
      } else if (selectedDocuments.length > 0) {
        if (useFakeData) {
          setDocuments((prev) =>
            prev.filter((doc) => !selectedDocuments.includes(doc.id))
          );
          toast.success(
            `${selectedDocuments.length} documents deleted successfully (simulated)`
          );
        } else {
          await documentService.deleteMultipleDocuments(selectedDocuments);
          toast.success(
            `${selectedDocuments.length} documents deleted successfully`
          );
        }
        setSelectedDocuments([]);
      }

      if (!useFakeData) {
        fetchDocuments();
      } else {
        setTotalPages(Math.ceil(documents.length / pageSize));
      }
    } catch (error) {
      console.error("Failed to delete document(s):", error);
      toast.error("Failed to delete document(s)");
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const openAssignCircuitDialog = (document: Document) => {
    if (!canManageDocuments) {
      toast.error("You do not have permission to assign documents to circuits");
      return;
    }

    setDocumentToAssign(document);
    setAssignCircuitDialogOpen(true);
  };

  const handleAssignCircuitSuccess = () => {
    toast.success("Document assigned to circuit successfully");
    if (!useFakeData) {
      fetchDocuments();
    }
  };

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  const sortedItems = useMemo(() => {
    let sortableItems = [...documents];

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case "title":
            aValue = a.title;
            bValue = b.title;
            break;
          case "documentKey":
            aValue = a.documentKey;
            bValue = b.documentKey;
            break;
          case "documentType":
            aValue = a.documentType.typeName;
            bValue = b.documentType.typeName;
            break;
          case "createdAt":
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case "createdBy":
            aValue = a.createdBy.username;
            bValue = b.createdBy.username;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [documents, sortConfig]);

  const filteredItems = useMemo(() => {
    return sortedItems.filter((doc) => {
      // Text search filter
      const matchesSearch =
        !searchQuery ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.documentKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.documentType.typeName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Date range filter
      let matchesDateRange = true;
      if (dateRange && dateRange.from) {
        const docDate = new Date(doc.docDate);
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);

        if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          matchesDateRange = docDate >= fromDate && docDate <= toDate;
        } else {
          matchesDateRange = docDate >= fromDate;
        }
      }

      return matchesSearch && matchesDateRange;
    });
  }, [sortedItems, searchQuery, dateRange]);

  const getPageDocuments = () => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredItems.slice(start, end);
  };

  useEffect(() => {
    setTotalPages(Math.ceil(filteredItems.length / pageSize));
    setPage(1); // Reset to first page when filters change
  }, [filteredItems]);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <Badge className="bg-amber-600/20 text-amber-500 hover:bg-amber-600/30 border-amber-500/30">
            hello
          </Badge>
        );
      case 1:
        return (
          <Badge className="bg-green-600/20 text-green-500 hover:bg-green-600/30 border-green-500/30">
            In Progress
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-red-600/20 text-red-500 hover:bg-red-600/30 border-red-500/30">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSortIndicator = (columnKey: string) => {
    if (sortConfig && sortConfig.key === columnKey) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return null;
  };

  const renderSortableHeader = (
    label: string,
    key: string,
    icon: React.ReactNode
  ) => (
    <div
      className="flex items-center gap-1 cursor-pointer select-none"
      onClick={() => requestSort(key)}
    >
      {icon}
      {label}
      <div className="ml-1 w-4 text-center">
        {getSortIndicator(key) || (
          <ArrowUpDown className="h-3 w-3 opacity-50" />
        )}
      </div>
    </div>
  );

  const changePageSize = (newSize: number) => {
    setPage(1); // Reset to first page when changing page size
  };

  return (
    <div className={`p-6 space-y-6 ${theme === "light" ? "light" : ""}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1
            className={`text-2xl font-bold ${
              theme === "light" ? "text-slate-900" : "text-white"
            } mb-1`}
          >
            Documents
          </h1>
          <p
            className={
              theme === "light" ? "text-slate-500" : "text-blue-300/80"
            }
          >
            Manage your documents and files
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {useFakeData && (
            <Button
              variant="outline"
              onClick={fetchDocuments}
              className="border-amber-500/50 text-amber-500 hover:bg-amber-500/20"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Using Test Data
            </Button>
          )}
          {canManageDocuments ? (
            <>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link to="/documents/create">
                  <Plus className="mr-2 h-4 w-4" /> New Document
                </Link>
              </Button>

              {selectedDocuments.length === 1 && (
                <Button
                  variant="outline"
                  className="border-blue-500/50 text-blue-500 hover:bg-blue-500/20"
                  onClick={() => {
                    const selectedDoc = documents.find(
                      (doc) => doc.id === selectedDocuments[0]
                    );
                    if (selectedDoc) {
                      openAssignCircuitDialog(selectedDoc);
                    }
                  }}
                >
                  <GitBranch className="mr-2 h-4 w-4" /> Assign to Circuit
                </Button>
              )}
            </>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700" disabled>
                    <Plus className="mr-2 h-4 w-4" /> New Document
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#0a1033]/90 border-blue-900/50">
                  <p>Only Admin or FullUser can create documents</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {canManageDocuments && selectedDocuments.length > 0 && (
            <Button variant="destructive" onClick={() => openDeleteDialog()}>
              <Trash className="mr-2 h-4 w-4" /> Delete Selected (
              {selectedDocuments.length})
            </Button>
          )}
        </div>
      </div>

      <DocumentsWrapper
        documents={getPageDocuments()}
        selectedDocuments={selectedDocuments}
        canManageDocuments={canManageDocuments}
        handleSelectDocument={handleSelectDocument}
        handleSelectAll={handleSelectAll}
        onView={(document) => navigate(`/documents/${document.id}`)}
        onEdit={(document) => navigate(`/documents/${document.id}/edit`)}
        onDelete={openDeleteDialog}
        onCreateDocument={() => navigate("/documents/new")}
        sortConfig={sortConfig}
        requestSort={requestSort}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        toggleFilters={() => setShowFilters(!showFilters)}
        dateRange={dateRange}
        setDateRange={setDateRange}
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={documents.length}
        onPageChange={setPage}
        onPageSizeChange={changePageSize}
        isLoading={isLoading}
      />

      {selectedDocuments.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a1033]/90 border-t border-blue-900/30 p-4 flex justify-between items-center transition-all duration-300 z-10 backdrop-blur-sm">
          <div className="text-blue-100">
            <span className="font-medium">{selectedDocuments.length}</span>{" "}
            documents selected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-blue-800/50 text-blue-300 hover:bg-blue-900/30"
            >
              Archive Selected
            </Button>
            <Button
              variant="outline"
              className="border-blue-800/50 text-blue-300 hover:bg-blue-900/30"
            >
              Export Selected
            </Button>
            {selectedDocuments.length === 1 && (
              <Button
                variant="outline"
                className="border-blue-500/50 text-blue-500 hover:bg-blue-900/30"
                onClick={() => {
                  const selectedDoc = documents.find(
                    (doc) => doc.id === selectedDocuments[0]
                  );
                  if (selectedDoc) {
                    openAssignCircuitDialog(selectedDoc);
                  }
                }}
              >
                <GitBranch className="h-4 w-4 mr-2" /> Assign to Circuit
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => openDeleteDialog()}
              className="bg-red-900/20 text-red-400 hover:bg-red-900/30 hover:text-red-300 border border-red-900/30"
            >
              <Trash className="h-4 w-4 mr-2" /> Delete Selected
            </Button>
          </div>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#0a1033] border-blue-900/30 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription className="text-blue-300">
              {documentToDelete
                ? "Are you sure you want to delete this document? This action cannot be undone."
                : `Are you sure you want to delete ${selectedDocuments.length} selected documents? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-blue-800 hover:bg-blue-900/30"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {documentToAssign && (
        <AssignCircuitDialog
          documentId={documentToAssign.id}
          documentTitle={documentToAssign.title}
          open={assignCircuitDialogOpen}
          onOpenChange={setAssignCircuitDialogOpen}
          onSuccess={handleAssignCircuitSuccess}
        />
      )}
    </div>
  );
};

export default Documents;
