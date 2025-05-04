import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DocumentType } from '@/models/document';
import DocumentTypeTable from '@/components/document-types/DocumentTypeTable';
import DocumentTypeGrid from '@/components/document-types/DocumentTypeGrid';
import EmptyState from '@/components/document-types/EmptyState';
import LoadingState from '@/components/document-types/LoadingState';
import DocumentTypesPagination from '@/components/document-types/DocumentTypesPagination';
import { useSettings } from '@/context/SettingsContext';

interface DocumentTypesContentProps {
  isLoading: boolean;
  types: DocumentType[];
  viewMode: 'table' | 'grid';
  selectedTypes: number[];
  onDeleteType: (id: number) => void;
  onEditType: (type: DocumentType) => void;
  onSelectType: (id: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  filteredAndSortedTypes: DocumentType[];
  onNewTypeClick?: () => void;
}

const DocumentTypesContent = ({
  isLoading,
  types,
  viewMode,
  selectedTypes,
  onDeleteType,
  onEditType,
  onSelectType,
  onSelectAll,
  sortField,
  sortDirection,
  handleSort,
  currentPage,
  setCurrentPage,
  totalPages,
  filteredAndSortedTypes,
  onNewTypeClick
}: DocumentTypesContentProps) => {
  const { theme } = useSettings();

  // Define conditional styles based on theme
  const cardBgClass = theme === 'dark' 
    ? 'bg-[#0f1642] border-blue-900/30' 
    : 'bg-white border-gray-200';
  
  const cardTitleClass = theme === 'dark' 
    ? 'text-white' 
    : 'text-gray-800';
  
  const cardDescClass = theme === 'dark' 
    ? 'text-blue-300' 
    : 'text-gray-500';
  
  const borderClass = theme === 'dark' 
    ? 'border-blue-900/30' 
    : 'border-gray-200';

  if (isLoading) {
    return <LoadingState />;
  }

  if (types.length === 0) {
    return <EmptyState onAddType={onNewTypeClick || (() => {})} />;
  }

  return (
    <div className="flex-1 overflow-hidden px-3 md:px-6 py-3">
      <Card className={`${cardBgClass} shadow-xl h-full flex flex-col`}>
        <CardHeader className="py-3 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className={`text-lg ${cardTitleClass}`}>Document Types</CardTitle>
              <CardDescription className={`text-sm ${cardDescClass}`}>
                {filteredAndSortedTypes.length} {filteredAndSortedTypes.length === 1 ? 'type' : 'types'} {filteredAndSortedTypes.length !== types.length ? 'found' : 'available'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="h-[calc(100vh-230px)] w-full flex-1 overflow-auto">
            <div className="min-w-full">
              {viewMode === 'table' ? (
                <DocumentTypeTable 
                  types={filteredAndSortedTypes}
                  selectedTypes={selectedTypes}
                  onSelectType={onSelectType}
                  onSelectAll={onSelectAll}
                  onDeleteType={onDeleteType}
                  onEditType={onEditType}
                  onSort={handleSort}
                  sortField={sortField}
                  sortDirection={sortDirection}
                />
              ) : (
                <DocumentTypeGrid
                  types={filteredAndSortedTypes}
                  onDeleteType={onDeleteType}
                  onEditType={onEditType}
                />
              )}
            </div>
          </ScrollArea>
          
          <div className={`mt-auto border-t ${borderClass}`}>
            <DocumentTypesPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentTypesContent;
