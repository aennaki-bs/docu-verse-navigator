import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import documentService from '@/services/documentService';
import { Document } from '@/models/document';
import { User } from '@/models/types';

interface UseDocumentsDataProps {
  initialDocuments?: Document[];
  initialLoading?: boolean;
  initialError?: string | null;
}

interface DocumentFilter {
  title?: string;
  typeId?: number;
  status?: number;
  docDateFrom?: string;
  docDateTo?: string;
}

export const useDocumentsData = ({
  initialDocuments = [],
  initialLoading = true,
  initialError = null,
}: UseDocumentsDataProps = {}) => {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<string | null>(initialError);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState<User | null>(null);

  const filters = {
    title: searchParams.get('title') || '',
    typeId: searchParams.get('typeId') ? parseInt(searchParams.get('typeId')!) : undefined,
    status: searchParams.get('status') ? parseInt(searchParams.get('status')!) : undefined,
    docDateFrom: searchParams.get('docDateFrom') || '',
    docDateTo: searchParams.get('docDateTo') || '',
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const page = parseInt(searchParams.get('page') || '1', 10);
        const size = parseInt(searchParams.get('size') || '10', 10);
        setCurrentPage(page);
        setPageSize(size);

        const response = await documentService.getAllDocuments({
          page: page,
          size: size,
          ...filters,
        });

        setDocuments(response.data);
        setTotalCount(response.totalCount);
      } catch (err: any) {
        setError(err.message || 'Failed to load documents');
        toast.error(err.message || 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const createDocument = async (newDocument: Omit<Document, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add the new document to the state
      setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
      toast.success('Document created successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to create document');
      toast.error(err.message || 'Failed to create document');
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (id: number, updatedDocument: Document) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the document in the state
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) => (doc.id === id ? updatedDocument : doc))
      );
      toast.success('Document updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update document');
      toast.error(err.message || 'Failed to update document');
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove the document from the state
      setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.id !== id));
      toast.success('Document deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to delete document');
      toast.error(err.message || 'Failed to delete document');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (newFilters: DocumentFilter) => {
    const newParams = new URLSearchParams();

    if (newFilters.title) {
      newParams.set('title', newFilters.title);
    }
    if (newFilters.typeId) {
      newParams.set('typeId', newFilters.typeId.toString());
    }
    if (newFilters.status) {
      newParams.set('status', newFilters.status.toString());
    }
    if (newFilters.docDateFrom) {
      newParams.set('docDateFrom', newFilters.docDateFrom);
    }
    if (newFilters.docDateTo) {
      newParams.set('docDateTo', newFilters.docDateTo);
    }

    setSearchParams(newParams);
  };

  const navigateToPage = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  // Sample data function - add isCircuitCompleted
  const getSampleData = () => [
    {
      id: 1,
      documentKey: 'DOC-001',
      title: 'Test Document 1',
      content: 'This is a test document.',
      docDate: '2023-01-01',
      status: 0,
      documentAlias: 'Test 1',
      isCircuitCompleted: false, // Add missing property
      documentType: {
        id: 1,
        typeName: 'Test Type',
      },
      createdBy: {
        id: 1,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'Admin',
      },
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
      createdByUserId: 1,
    },
    {
      id: 2,
      documentKey: 'DOC-002',
      title: 'Test Document 2',
      content: 'This is another test document.',
      docDate: '2023-02-01',
      status: 1,
      documentAlias: 'Test 2',
      isCircuitCompleted: true, // Add missing property
      documentType: {
        id: 2,
        typeName: 'Another Type',
      },
      createdBy: {
        id: 2,
        username: 'anotheruser',
        firstName: 'Another',
        lastName: 'User',
        email: 'another@example.com',
        role: 'SimpleUser',
      },
      createdAt: '2023-02-01',
      updatedAt: '2023-02-01',
      createdByUserId: 2,
    },
  ];

  return {
    documents,
    loading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    applyFilters,
    filters,
    totalCount,
    pageSize,
    currentPage,
    navigateToPage,
    user,
  };
};
