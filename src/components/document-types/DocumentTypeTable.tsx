
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { DocumentType } from '@/models/document';
import { DocumentTypeTableHeader } from './table/DocumentTypeTableHeader';
import { DocumentTypeTableRow } from './table/DocumentTypeTableRow';
import { DocumentTypeSearchBar } from './table/DocumentTypeSearchBar';

interface DocumentTypeTableProps {
  types: DocumentType[];
  selectedTypes: number[];
  onSelectType: (id: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onDeleteType: (id: number) => void;
  onEditType: (type: DocumentType) => void;
  onSort: (field: string) => void;
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleFilters?: () => void;
  showFilters?: boolean;
}

const DocumentTypeTable = ({
  types,
  selectedTypes,
  onSelectType,
  onSelectAll,
  onDeleteType,
  onEditType,
  onSort,
  sortField,
  sortDirection,
  searchQuery,
  onSearchChange,
  onToggleFilters,
  showFilters
}: DocumentTypeTableProps) => {
  const areAllEligibleSelected = types.length > 0 && 
    types.filter(type => type.documentCounter === 0).length === selectedTypes.length;
  const hasEligibleTypes = types.some(t => t.documentCounter === 0);

  return (
    <div className="w-full">
      <DocumentTypeSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onToggleFilters={onToggleFilters}
        showFilters={showFilters}
      />

      <div className="border-t border-blue-900/20">
        <Table>
          <DocumentTypeTableHeader
            onSelectAll={onSelectAll}
            areAllEligibleSelected={areAllEligibleSelected}
            hasEligibleTypes={hasEligibleTypes}
            onSort={onSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
          <TableBody>
            {types.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-blue-400">
                  No document types found
                </TableCell>
              </TableRow>
            ) : (
              types.map((type) => (
                <DocumentTypeTableRow
                  key={type.id}
                  type={type}
                  isSelected={selectedTypes.includes(type.id!)}
                  onSelectType={onSelectType}
                  onDeleteType={onDeleteType}
                  onEditType={onEditType}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DocumentTypeTable;
