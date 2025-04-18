
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import DocumentTypeForm from '@/components/document-types/DocumentTypeForm';
import { DocumentType } from '@/models/document';

interface DocumentTypeDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  documentType: DocumentType | null;
  isEditMode: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const DocumentTypeDrawer = ({
  isOpen,
  onOpenChange,
  documentType,
  isEditMode,
  onSuccess,
  onCancel
}: DocumentTypeDrawerProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-[#111633] p-4 sm:p-6 max-w-md mx-auto rounded-t-xl">
        <DrawerHeader className="text-center pb-4 px-0">
          <DrawerTitle className="text-xl font-bold text-white">
            {isEditMode ? 'Edit Document Type' : 'Create Document Type'}
          </DrawerTitle>
          <DrawerDescription className="text-sm text-blue-300">
            {isEditMode 
              ? 'Modify an existing document type' 
              : 'Create a new document type for your organization'}
          </DrawerDescription>
        </DrawerHeader>
    
        <div className="px-0">
          <DocumentTypeForm
            documentType={documentType}
            isEditMode={isEditMode}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DocumentTypeDrawer;
