
import { useStepsManagement } from '@/hooks/useStepsManagement';
import { StepsManagementHeader } from '@/components/steps-management/StepsManagementHeader';
import { StepsManagementContent } from '@/components/steps-management/StepsManagementContent';
import { StepsManagementDialogs } from '@/components/steps-management/StepsManagementDialogs';
import { BulkActionBar } from '@/components/steps/BulkActionBar';

const StepsManagement = () => {
  const {
    steps,
    allSteps,
    circuits,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedSteps,
    handleSelectStep,
    handleSelectAll,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    filterOptions,
    setFilterOptions,
    resetFilters,
    isFormDialogOpen,
    setIsFormDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    stepToDelete,
    bulkDeleteDialogOpen,
    setBulkDeleteDialogOpen,
    currentStep,
    viewMode,
    setViewMode,
    openDeleteDialog,
    handleDelete,
    handleEditStep,
    handleBulkDelete,
    handleAddStep,
    handleFormSuccess,
    refetch
  } = useStepsManagement();

  return (
    <div className="h-full flex flex-col bg-[#070b28]">
      <div className="px-4 py-6 md:px-6 md:py-8">
        <StepsManagementHeader
          onAddStep={handleAddStep}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <StepsManagementContent
          isLoading={isLoading}
          allSteps={allSteps}
          steps={steps}
          circuits={circuits}
          viewMode={viewMode}
          selectedSteps={selectedSteps}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectStep={handleSelectStep}
          onSelectAll={handleSelectAll}
          onDeleteStep={openDeleteDialog}
          onEditStep={handleEditStep}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          resetFilters={resetFilters}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onAddStep={handleAddStep}
        />
      </div>

      <StepsManagementDialogs
        isFormDialogOpen={isFormDialogOpen}
        setIsFormDialogOpen={setIsFormDialogOpen}
        onFormSuccess={handleFormSuccess}
        currentStep={currentStep}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        onDeleteConfirm={handleDelete}
        stepToDelete={stepToDelete}
        bulkDeleteDialogOpen={bulkDeleteDialogOpen}
        setBulkDeleteDialogOpen={setBulkDeleteDialogOpen}
        onBulkDeleteConfirm={handleBulkDelete}
        selectedStepsCount={selectedSteps.length}
        onRefetch={refetch}
      />

      <BulkActionBar
        selectedCount={selectedSteps.length}
        onBulkDelete={() => setBulkDeleteDialogOpen(true)}
      />
    </div>
  );
};

export default StepsManagement;
