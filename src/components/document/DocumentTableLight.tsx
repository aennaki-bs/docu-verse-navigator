import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  Check,
  MoreVertical,
  File,
} from "lucide-react";
import { format } from "date-fns";
import { Document } from "@/models/document";

interface DocumentTableLightProps {
  documents: Document[];
  selectedDocuments: number[];
  canManageDocuments: boolean;
  handleSelectDocument: (id: number) => void;
  handleSelectAll: () => void;
  onView: (document: Document) => void;
  onEdit: (document: Document) => void;
  onDelete: (id: number) => void;
  sortConfig: { key: string; direction: "ascending" | "descending" } | null;
  requestSort: (key: string) => void;
  page: number;
  pageSize: number;
}

export const DocumentTableLight: React.FC<DocumentTableLightProps> = ({
  documents,
  selectedDocuments,
  canManageDocuments,
  handleSelectDocument,
  handleSelectAll,
  onView,
  onEdit,
  onDelete,
  sortConfig,
  requestSort,
  page,
  pageSize,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const toggleDropdown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" />;
    }

    return sortConfig.direction === "ascending" ? (
      <ArrowUpDown className="h-4 w-4 ml-1 text-blue-600" />
    ) : (
      <ArrowUpDown className="h-4 w-4 ml-1 text-blue-600 transform rotate-180" />
    );
  };

  const renderSortableHeader = (label: string, key: string) => (
    <div
      className="flex items-center cursor-pointer group"
      onClick={() => requestSort(key)}
    >
      <span className="group-hover:text-blue-700">{label}</span>
      {getSortIcon(key)}
    </div>
  );

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <span className="status-badge draft">Draft</span>;
      case 1:
        return <span className="status-badge in-progress">In Progress</span>;
      case 2:
        return <span className="status-badge completed">Completed</span>;
      default:
        return <span className="status-badge review">Under Review</span>;
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="table-container">
      <table className="document-table">
        <thead>
          <tr>
            <th className="w-12">
              {canManageDocuments ? (
                <div
                  className={`checkbox ${
                    selectedDocuments.length === documents.length &&
                    documents.length > 0
                      ? "bg-blue-600 border-blue-600 text-white"
                      : ""
                  }`}
                  onClick={handleSelectAll}
                >
                  {selectedDocuments.length === documents.length &&
                    documents.length > 0 && <Check className="h-3 w-3" />}
                </div>
              ) : (
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  #
                </span>
              )}
            </th>
            <th className="w-40">
              {renderSortableHeader("Document Code", "documentKey")}
            </th>
            <th>{renderSortableHeader("Title", "title")}</th>
            <th className="w-32">
              {renderSortableHeader("Type", "documentType.typeName")}
            </th>
            <th className="w-32">{renderSortableHeader("Status", "status")}</th>
            <th className="w-40">{renderSortableHeader("Date", "docDate")}</th>
            <th className="w-44">
              {renderSortableHeader("Created By", "createdBy.username")}
            </th>
            <th className="w-20 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document, index) => (
            <tr
              key={document.id}
              className={
                selectedDocuments.includes(document.id) ? "selected" : ""
              }
            >
              <td>
                {canManageDocuments ? (
                  <div
                    className={`checkbox ${
                      selectedDocuments.includes(document.id)
                        ? "bg-blue-600 border-blue-600 text-white"
                        : ""
                    }`}
                    onClick={() => handleSelectDocument(document.id)}
                  >
                    {selectedDocuments.includes(document.id) && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 font-medium">
                    {index + 1 + (page - 1) * pageSize}
                  </span>
                )}
              </td>
              <td>
                <div className="document-code flex items-center">
                  <File className="h-3.5 w-3.5 mr-2 text-blue-500" />
                  {document.documentKey}
                </div>
              </td>
              <td>
                <Link
                  to={`/documents/${document.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors flex items-center gap-2"
                >
                  {document.title}
                </Link>
              </td>
              <td>
                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                  {document.documentType?.typeName || "Unknown"}
                </span>
              </td>
              <td>{getStatusBadge(document.status)}</td>
              <td>
                <span className="text-sm text-gray-700">
                  {format(new Date(document.docDate), "MMM dd, yyyy")}
                </span>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <div className="avatar">
                    <div className="avatar-fallback">
                      {document.createdBy?.firstName?.charAt(0) || ""}
                      {document.createdBy?.lastName?.charAt(0) || ""}
                    </div>
                  </div>
                  <span className="text-sm font-medium">
                    {document.createdBy?.firstName}{" "}
                    {document.createdBy?.lastName}
                  </span>
                </div>
              </td>
              <td>
                <div className="relative">
                  <button
                    onClick={(e) => toggleDropdown(document.id, e)}
                    className="document-action-button rounded-full p-2 hover:bg-gray-100"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-600" />
                  </button>

                  {activeDropdown === document.id && (
                    <div className="action-dropdown absolute right-0 z-10 mt-1 w-40 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                      <button
                        onClick={() => onView(document)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>

                      {canManageDocuments && (
                        <>
                          <button
                            onClick={() => onEdit(document)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => {
                              onDelete(document.id);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTableLight;
