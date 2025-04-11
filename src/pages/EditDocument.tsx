import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { DocumentEditForm } from '@/components/document/edit/DocumentEditForm';
import { Document, UpdateDocumentRequest } from '@/models/document';
import documentService from '@/services/documentService';
import documentTypeService from '@/services/documentTypeService';
import { toast } from 'sonner';

export default function EditDocument() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadDocument = async () => {
      setIsLoading(true);
      try {
        const doc = await documentService.getDocumentById(Number(id));
        setDocument(doc);
      } catch (error) {
        console.error('Failed to load document:', error);
        toast.error('Failed to load document');
        navigate('/documents');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadDocument();
    }
  }, [id, navigate]);

  const handleSubmit = async (documentData: UpdateDocumentRequest) => {
    setIsSubmitting(true);
    try {
      if (document) {
        await documentService.updateDocument(document.id, documentData);
        toast.success('Document updated successfully');
        navigate(`/documents/${id}`);
      }
    } catch (error) {
      console.error('Failed to update document:', error);
      toast.error('Failed to update document');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/documents/${id}`);
  };
  
  const renderForm = () => {
    if (!document) return null;
    
    return (
      <DocumentEditForm
        document={document}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  };
  
  return (
    <div>
      {renderForm()}
    </div>
  );
}
