import React from "react";
import { useSettings } from "@/context/SettingsContext";
import { Document } from "@/models/document";
import { DateRange } from "react-day-picker";
import { File, Plus, Loader2 } from "lucide-react";

// Import both dark and light mode components
import DocumentHeaderLight from "./DocumentHeaderLight";
import DocumentTableLight from "./DocumentTableLight";
import DocumentPaginationLight from "./DocumentPaginationLight";

interface DocumentsWrapperProps {
  documents: Document[];
  selectedDocuments: number[];
  canManageDocuments: boolean;
  handleSelectDocument: (id: number) => void;
  handleSelectAll: () => void;
  onView: (document: Document) => void;
  onEdit: (document: Document) => void;
  onDelete: (id: number) => void;
  onCreateDocument: () => void;
  sortConfig: { key: string; direction: "ascending" | "descending" } | null;
  requestSort: (key: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  toggleFilters: () => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
}

const DocumentsWrapper: React.FC<DocumentsWrapperProps> = ({
  documents,
  selectedDocuments,
  canManageDocuments,
  handleSelectDocument,
  handleSelectAll,
  onView,
  onEdit,
  onDelete,
  onCreateDocument,
  sortConfig,
  requestSort,
  searchQuery,
  setSearchQuery,
  showFilters,
  toggleFilters,
  dateRange,
  setDateRange,
  page,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) => {
  const { theme } = useSettings();
  const isLightMode = theme === "light";

  if (isLoading) {
    return (
      <div className={`content-card ${isLightMode ? "light" : ""}`}>
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
          <Loader2
            className={`h-10 w-10 ${
              isLightMode ? "text-blue-500" : "text-blue-400"
            } animate-spin mb-4`}
          />
          <p
            className={
              isLightMode ? "text-gray-500 font-medium" : "text-gray-300"
            }
          >
            Loading documents...
          </p>
        </div>
      </div>
    );
  }

  if (isLightMode) {
    return (
      <div className="light content-card">
        <DocumentHeaderLight
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCreateDocument={onCreateDocument}
          showFilters={showFilters}
          toggleFilters={toggleFilters}
          dateRange={dateRange}
          setDateRange={setDateRange}
          canCreateDocument={canManageDocuments}
        />

        {documents.length > 0 ? (
          <>
            <DocumentTableLight
              documents={documents}
              selectedDocuments={selectedDocuments}
              canManageDocuments={canManageDocuments}
              handleSelectDocument={handleSelectDocument}
              handleSelectAll={handleSelectAll}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              sortConfig={sortConfig}
              requestSort={requestSort}
              page={page}
              pageSize={pageSize}
            />

            <DocumentPaginationLight
              currentPage={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              pageSize={pageSize}
              totalItems={totalItems}
            />
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <File className="w-full h-full stroke-current" />
            </div>
            <h3 className="empty-state-title">No Documents Found</h3>
            <p className="empty-state-description">
              {searchQuery
                ? "No documents match your search criteria. Try adjusting your filters or search terms."
                : "You don't have any documents yet. Create your first document to get started."}
            </p>
            {canManageDocuments && !searchQuery && (
              <button
                className="button-primary flex items-center"
                onClick={onCreateDocument}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Document
              </button>
            )}
          </div>
        )}
      </div>
    );
  } else {
    // Default to rendering the standard/dark mode components
    // In a real implementation, you would render the dark themed components here
    return (
      <div className="content-card dark">
        <div className="p-6 text-white">
          <p className="font-medium text-lg mb-4">Document Management System</p>
          <p className="text-sm text-gray-300 mb-3">
            You're currently viewing in dark mode. For an enhanced experience
            with improved visibility and a modern UI, try switching to Light
            Mode in the Settings panel.
          </p>
          <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-800/30 text-blue-300 text-sm mt-4">
            <p>Light mode provides:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Better contrast for document details</li>
              <li>Modern action menus and controls</li>
              <li>Enhanced readability for long sessions</li>
              <li>Professional design for business environments</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
};

export default DocumentsWrapper;
