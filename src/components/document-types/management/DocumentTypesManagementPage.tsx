import { useState, useEffect, useRef, useCallback } from 'react';
import { useDocumentTypes } from '@/hooks/useDocumentTypes';
import DocumentTypesHeaderSection from './DocumentTypesHeaderSection';
import DocumentTypesContent from './DocumentTypesContent';
import DocumentTypeDrawer from './DocumentTypeDrawer';
import DeleteConfirmDialog from '@/components/document-types/DeleteConfirmDialog';
import BottomActionBar from '@/components/document-types/BottomActionBar';
import DocumentTypeFilters from '@/components/document-types/DocumentTypeFilters';
import { DocumentType } from '@/models/document';
import { toast } from 'sonner';
import documentService from '@/services/documentService';
import { useSettings } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DocumentTypesManagementPage = () => {
  const { theme } = useSettings();
  const { isAuthenticated, isLoading: authLoading, refreshUserInfo } = useAuth();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentType, setCurrentType] = useState<DocumentType | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const initComplete = useRef(false);
  const initStarted = useRef(false);
  const lastFetchTime = useRef(0);

  const {
    types,
    isLoading,
    selectedTypes,
    handleSelectType,
    handleSelectAll,
    fetchTypes,
    searchQuery,
    setSearchQuery,
    // We still have access to all other properties from useDocumentTypes
    // but we're only explicitly listing the ones we use in this component
    ...documentTypesProps
  } = useDocumentTypes();

  // Debounced fetchTypes to prevent multiple rapid calls
  const debouncedFetch = useCallback(async () => {
    const now = Date.now();
    // Only fetch if it's been more than 2 seconds since the last fetch
    if (now - lastFetchTime.current > 2000) {
      lastFetchTime.current = now;
      try {
        await fetchTypes();
      } catch (error) {
        console.error('Error fetching document types:', error);
      }
    }
  }, [fetchTypes]);

  // Single useEffect to handle component initialization
  useEffect(() => {
    // Prevent multiple initializations
    if (initStarted.current) {
      return;
    }
    
    const initializeComponent = async () => {
      // Set flag to prevent multiple initializations
      initStarted.current = true;
      
      try {
        // If not authenticated and not currently loading auth, redirect to login
        if (!authLoading && !isAuthenticated) {
          navigate('/login');
          return;
        }
        
        // Wait for authentication to complete before proceeding
        if (authLoading) {
          return;
        }
        
        // If authenticated and not yet initialized, fetch data
        if (isAuthenticated && !initComplete.current) {
          // Set the initialization flag immediately to prevent subsequent calls
          initComplete.current = true;
          
          // First load existing data to show something to the user
          await debouncedFetch();
          
          // No need to refresh user info here as it's handled by AuthContext
        }
      } catch (error) {
        console.error('Initialization failed:', error);
        toast.error('Error loading data', {
          description: 'Please try again or contact support'
        });
      }
    };

    initializeComponent();
  }, [authLoading, isAuthenticated, navigate, debouncedFetch]);

  const openDeleteDialog = (id: number) => {
    setTypeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (typeToDelete) {
        await documentService.deleteDocumentType(typeToDelete);
        toast.success('Document type deleted successfully');
        debouncedFetch();
      }
    } catch (error) {
      console.error('Failed to delete document type:', error);
      toast.error('Failed to delete document type');
    } finally {
      setDeleteDialogOpen(false);
      setTypeToDelete(null);
    }
  };

  const handleEditType = (type: DocumentType) => {
    setCurrentType(type);
    setIsEditMode(true);
    openDrawer();
  };

  const handleBulkDelete = async () => {
    try {
      await documentService.deleteMultipleDocumentTypes(selectedTypes);
      toast.success(`Successfully deleted ${selectedTypes.length} document types`);
      debouncedFetch();
    } catch (error) {
      console.error('Failed to delete document types in bulk:', error);
      toast.error('Failed to delete some or all document types');
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setCurrentType(null);
    setIsEditMode(false);
  };

  const handleViewModeChange = (value: 'table' | 'grid') => {
    if (value) setViewMode(value);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (filters: any) => {
    setAppliedFilters(filters);
    // The actual filtering logic would be implemented in the useDocumentTypes hook
  };

  const openDrawer = () => {
    try {
      console.log("Opening document type drawer...");
      setIsDrawerOpen(true);
      console.log("Drawer state set to open:", isDrawerOpen);
    } catch (error) {
      console.error("Error opening document type drawer:", error);
      // Fall back to a simpler approach if the drawer has issues
      toast.error("There was a problem opening the form. Please try again.");
    }
  };

  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show error state if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-[#070b28]' : 'bg-gray-50'}`}>
      <DocumentTypesHeaderSection 
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onNewTypeClick={openDrawer}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={handleToggleFilters}
      />

      {showFilters && (
        <div className="px-6 py-2">
          <DocumentTypeFilters 
            onFilterChange={handleFilterChange}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}

      <DocumentTypesContent 
        isLoading={isLoading}
        types={types}
        viewMode={viewMode}
        selectedTypes={selectedTypes}
        onDeleteType={openDeleteDialog}
        onEditType={handleEditType}
        onSelectType={handleSelectType}
        onSelectAll={handleSelectAll}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewTypeClick={openDrawer}
        {...documentTypesProps}
      />

      <DocumentTypeDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        documentType={currentType}
        isEditMode={isEditMode}
        onSuccess={() => {
          handleCloseDrawer();
          debouncedFetch();
          toast.success(isEditMode 
            ? 'Document type updated successfully' 
            : 'Document type created successfully');
        }}
        onCancel={handleCloseDrawer}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />

      <DeleteConfirmDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={handleBulkDelete}
        isBulk={true}
        count={selectedTypes.length}
      />

      <BottomActionBar
        selectedCount={selectedTypes.length}
        onBulkDelete={() => setBulkDeleteDialogOpen(true)}
      />
    </div>
  );
};

export default DocumentTypesManagementPage;
