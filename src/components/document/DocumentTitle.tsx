import { useState } from "react";
import { Copy, FileText, CheckCircle2 } from "lucide-react";
import { Document } from "@/models/document";
import DocumentStatusBadge from "./DocumentStatusBadge";
import { useSettings } from "@/context/SettingsContext";

interface DocumentTitleProps {
  document: Document | undefined;
  isLoading: boolean;
}

const DocumentTitle = ({ document, isLoading }: DocumentTitleProps) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const { theme } = useSettings();
  const isLightMode = theme === "light";

  const copyDocumentKey = () => {
    if (!document) return;

    navigator.clipboard
      .writeText(document.documentKey)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  if (isLoading) {
    return (
      <div>
        <div
          className={`h-8 ${
            isLightMode ? "bg-gray-300" : "bg-blue-800/30"
          } rounded w-48 animate-pulse mb-2`}
        ></div>
        <div
          className={`h-5 ${
            isLightMode ? "bg-gray-200" : "bg-blue-800/20"
          } rounded w-36 animate-pulse`}
        ></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div>
        <h1
          className={`text-2xl font-bold ${
            isLightMode ? "text-gray-700" : "text-gray-400"
          }`}
        >
          Document not found
        </h1>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <h1
          className={`text-2xl font-bold ${
            isLightMode ? "text-gray-900" : "text-white"
          }`}
        >
          {document.title}
        </h1>
        {document.status !== undefined && (
          <DocumentStatusBadge status={document.status} />
        )}
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 ${
            isLightMode
              ? "text-gray-800 font-medium bg-blue-50 px-2 py-1 rounded border border-blue-200"
              : "text-blue-300"
          }`}
        >
          <FileText
            className={`h-4 w-4 ${isLightMode ? "text-blue-700" : ""}`}
          />
          <span
            className={`text-sm font-mono ${
              isLightMode ? "font-semibold" : ""
            }`}
          >
            {document.documentKey}
          </span>
        </div>

        <button
          onClick={copyDocumentKey}
          className={`p-1.5 rounded-full ${
            isLightMode
              ? "hover:bg-blue-100 text-gray-700 hover:text-blue-700 border border-gray-300"
              : "hover:bg-blue-800/30 text-blue-300 hover:text-white"
          } 
            transition-colors`}
          title="Copy document key"
        >
          {copySuccess ? (
            <CheckCircle2
              className={`h-4 w-4 ${
                isLightMode ? "text-green-700" : "text-green-400"
              }`}
            />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default DocumentTitle;
