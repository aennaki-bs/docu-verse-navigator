
import { useEffect } from 'react';
import { useSubTypes } from '@/hooks/useSubTypes';
import { SubTypesTable } from './SubTypesTable';
import SubTypeListHeader from './SubTypeListHeader';
import SubTypeDialogs from './SubTypeDialogs';
import { ErrorMessage } from '@/components/document-flow/ErrorMessage';

interface SubTypesListProps {
  documentTypeId: number;
}

export default function SubTypesList({ documentTypeId }: SubTypesListProps) {
  const {
    subTypes,
    isLoading,
    error,
    createDialogOpen,
    setCreateDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedSubType,
    setSelectedSubType,
    fetchSubTypes,
    handleCreate,
    handleEdit,
    handleDelete
  } = useSubTypes(documentTypeId);

  useEffect(() => {
    console.log("SubTypesList: Fetching subtypes for document type ID:", documentTypeId);
    fetchSubTypes();
  }, [documentTypeId, fetchSubTypes]);

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleEditClick = (subType: any) => {
    setSelectedSubType(subType);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (subType: any) => {
    setSelectedSubType(subType);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <SubTypeListHeader 
        documentTypeName={`Document Type ${documentTypeId}`}
        onCreateClick={handleCreateClick}
      />

      {error && <ErrorMessage error={error} />}

      <SubTypesTable
        subTypes={subTypes}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <SubTypeDialogs
        createDialogOpen={createDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        selectedSubType={selectedSubType}
        documentTypeId={documentTypeId}
        onCreateSubmit={handleCreate}
        onEditSubmit={handleEdit}
        onDeleteConfirm={handleDelete}
      />
    </div>
  );
}
