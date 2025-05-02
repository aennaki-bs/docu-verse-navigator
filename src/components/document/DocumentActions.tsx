import { Edit, GitBranch, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document } from "@/models/document";
import { Link } from "react-router-dom";
import { useSettings } from "@/context/SettingsContext";

interface DocumentActionsProps {
  document: Document;
  canManageDocuments: boolean;
  onDelete: () => void;
  onDocumentFlow: () => void;
}

const DocumentActions = ({
  document,
  canManageDocuments,
  onDelete,
  onDocumentFlow,
}: DocumentActionsProps) => {
  const { theme } = useSettings();
  const isLightMode = theme === "light";

  return (
    <div className="flex gap-2 flex-wrap justify-end">
      {canManageDocuments && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onDocumentFlow}
            className={
              isLightMode
                ? "border-blue-400 bg-blue-50 text-blue-800 hover:bg-blue-100 hover:text-blue-900 hover:border-blue-500 font-medium"
                : "border-blue-800 text-blue-300 hover:bg-blue-900/30 hover:text-blue-100"
            }
          >
            <GitBranch className="h-4 w-4 mr-2" />
            Document Flow
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className={
              isLightMode
                ? "border-amber-400 bg-amber-50 text-amber-800 hover:bg-amber-100 hover:text-amber-900 hover:border-amber-500 font-medium"
                : "border-amber-800/60 text-amber-300 hover:bg-amber-900/30 hover:text-amber-100"
            }
          >
            <Link to={`/documents/${document.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className={
              isLightMode
                ? "border-red-400 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 hover:border-red-500 font-medium"
                : "border-red-900/60 text-red-300 hover:bg-red-900/30 hover:text-red-200"
            }
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </>
      )}
    </div>
  );
};

export default DocumentActions;
