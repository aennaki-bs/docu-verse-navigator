import React from "react";
import { FileText, Plus, Filter, Search, X, Calendar } from "lucide-react";
import { DateRange } from "react-day-picker";

interface DocumentHeaderLightProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreateDocument: () => void;
  showFilters: boolean;
  toggleFilters: () => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  canCreateDocument: boolean;
}

const DocumentHeaderLight: React.FC<DocumentHeaderLightProps> = ({
  searchQuery,
  setSearchQuery,
  onCreateDocument,
  showFilters,
  toggleFilters,
  dateRange,
  setDateRange,
  canCreateDocument,
}) => {
  return (
    <div className="document-list-header mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center">
          <div className="bg-blue-50 p-3 rounded-xl mr-4">
            <FileText className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <h1 className="document-list-title">Documents</h1>
            <p className="document-list-description">
              Manage and organize your documents
            </p>
          </div>
        </div>

        {canCreateDocument && (
          <button
            className="button-primary flex items-center"
            onClick={onCreateDocument}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="search-icon h-4 w-4" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <button
          className={`button-secondary flex items-center ${
            showFilters ? "bg-blue-50 border-blue-200 text-blue-600" : ""
          }`}
          onClick={toggleFilters}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {showFilters && dateRange && (dateRange.from || dateRange.to) && (
            <span className="ml-2 bg-blue-100 text-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {(dateRange?.from ? 1 : 0) + (dateRange?.to ? 1 : 0)}
            </span>
          )}
        </button>

        <div className="select-container w-40">
          <button className="select-trigger w-full">
            <span>All Types</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="document-filters mt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="flex items-center date-range-picker">
                <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm">
                  {dateRange?.from
                    ? dateRange.to
                      ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                      : dateRange.from.toLocaleDateString()
                    : "Select date range"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="select-container w-40">
                <button className="select-trigger w-full">
                  <span>All Statuses</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 4.5L6 8L9.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created By
              </label>
              <div className="select-container w-40">
                <button className="select-trigger w-full">
                  <span>All Users</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 4.5L6 8L9.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <button
                className="button-secondary"
                onClick={() => setDateRange(undefined)}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentHeaderLight;
