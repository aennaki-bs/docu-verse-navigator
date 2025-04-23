
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import documentTypeService from '@/services/documentTypeService';
import subTypeService from '@/services/subTypeService';
import SubTypesList from '@/components/document-types/table/subtypes/SubTypesList';
import SubTypeManagementHeader from '@/components/sub-types/components/SubTypeManagementHeader';
import SubTypeManagementLoading from '@/components/sub-types/components/SubTypeManagementLoading';
import SubTypeManagementError from '@/components/sub-types/components/SubTypeManagementError';
import { toast } from 'sonner';

export default function SubTypeManagementPage() {
  const { id } = useParams<{ id: string }>();
  const [documentType, setDocumentType] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          setError("No document type ID provided");
          setIsLoading(false);
          return;
        }
        
        setIsLoading(true);
        setError(null);
        
        console.log("Fetching document type data for ID:", id);
        
        // Use a simple approach to get document type info
        // We'll create a minimal document type object based on available info
        const docTypeId = parseInt(id);
        
        // Get just enough info about the document type for the header
        try {
          const docTypeData = await documentTypeService.getDocumentType(docTypeId);
          console.log("Document type data received:", docTypeData);
          setDocumentType(docTypeData);
        } catch (error) {
          console.error('Failed to fetch document type details:', error);
          // Even if we can't get detailed document type info, we can still show subtypes
          // Create a minimal document type object with just the ID
          setDocumentType({ id: docTypeId, typeName: `Document Type ${docTypeId}` });
          toast.error('Could not fetch complete document type details, but subtypes will still be available');
        }
      } catch (error) {
        console.error('Failed to initialize subtype management page:', error);
        setError('Failed to load document type data');
        toast.error('Failed to initialize subtype management page');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <SubTypeManagementLoading />;
  }

  if (error || !documentType) {
    return <SubTypeManagementError />;
  }

  return (
    <div className="p-6 space-y-6">
      <SubTypeManagementHeader documentType={documentType} />
      <SubTypesList documentTypeId={documentType.id} />
    </div>
  );
}
