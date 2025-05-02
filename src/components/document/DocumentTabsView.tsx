import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Document, Ligne } from "@/models/document";
import DocumentDetailsTab from "./DocumentDetailsTab";
import DocumentLinesTab from "./DocumentLinesTab";
import { useSettings } from "@/context/SettingsContext";

interface DocumentTabsViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  document: Document;
  lignes: Ligne[];
  canManageDocuments: boolean;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
}

const DocumentTabsView = ({
  activeTab,
  setActiveTab,
  document,
  lignes,
  canManageDocuments,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
}: DocumentTabsViewProps) => {
  const { theme } = useSettings();
  const isLightMode = theme === "light";

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList
        className={`${
          isLightMode
            ? "bg-white border border-gray-300 shadow-md"
            : "bg-white/5 backdrop-blur-md border border-white/10"
        } w-full grid grid-cols-2 p-1 h-auto rounded-t-lg`}
      >
        <TabsTrigger
          value="details"
          className={`py-2.5 ${
            isLightMode
              ? "data-[state=active]:bg-blue-700 data-[state=active]:text-white hover:bg-gray-100 data-[state=inactive]:text-gray-800"
              : "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-indigo-600/80 data-[state=active]:text-white"
          }`}
        >
          <FileText className="h-4 w-4 mr-2" />
          Document Details
        </TabsTrigger>
        <TabsTrigger
          value="lignes"
          className={`py-2.5 ${
            isLightMode
              ? "data-[state=active]:bg-blue-700 data-[state=active]:text-white hover:bg-gray-100 data-[state=inactive]:text-gray-800"
              : "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-indigo-600/80 data-[state=active]:text-white"
          }`}
        >
          <Layers className="h-4 w-4 mr-2" />
          Lines
          <Badge
            variant="secondary"
            className={`ml-2 ${
              isLightMode
                ? "bg-blue-200 text-blue-800 border border-blue-300"
                : "bg-blue-900/50 text-blue-200"
            }`}
          >
            {document.lignesCount || lignes.length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="mt-0">
        <DocumentDetailsTab document={document} />
      </TabsContent>

      <TabsContent value="lignes" className="mt-0">
        <DocumentLinesTab
          document={document}
          lignes={lignes}
          canManageDocuments={canManageDocuments}
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DocumentTabsView;
