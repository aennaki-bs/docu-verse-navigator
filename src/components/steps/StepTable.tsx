
import { Table, TableBody } from '@/components/ui/table';
import { StepTableHeader } from './table/StepTableHeader';
import { StepTableRow } from './table/StepTableRow';

interface StepTableProps {
  steps: Step[];
  selectedSteps: number[];
  onSelectStep: (id: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onDelete?: (step: Step) => void;
  onEdit?: (step: Step) => void;
  onDetails?: (step: Step) => void;
  circuits?: Circuit[];
  onSort?: (field: string) => void;
  sortField?: string | null;
  sortDirection?: 'asc' | 'desc';
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  filterOptions?: StepFilterOptions;
  setFilterOptions?: (options: StepFilterOptions) => void;
  resetFilters?: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const StepTable = ({
  steps,
  selectedSteps,
  onSelectStep,
  onSelectAll,
  onDelete,
  onEdit,
  onDetails,
  circuits = [],
  onSort,
  sortField = null,
  sortDirection = 'asc',
  searchQuery = '',
  onSearchChange,
  filterOptions = {},
  setFilterOptions,
  resetFilters,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}: StepTableProps) => {
  // Check if all eligible steps are selected
  const areAllEligibleSelected = steps.length > 0 && steps.length === selectedSteps.length;
  const hasEligibleSteps = steps.length > 0;

  // Get circuit names map
  const circuitNamesMap = circuits.reduce((map, circuit) => {
    map[circuit.id] = circuit.title;
    return map;
  }, {} as Record<number, string>);

  return (
    <div className="w-full">
      <div className="border rounded-md border-blue-900/30">
        <Table>
          <StepTableHeader
            onSelectAll={onSelectAll}
            areAllEligibleSelected={areAllEligibleSelected}
            hasEligibleSteps={hasEligibleSteps}
            onSort={onSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
          <TableBody>
            {steps.length === 0 ? (
              <tr>
                <td colSpan={8} className="h-24 text-center text-muted-foreground">
                  No steps found
                </td>
              </tr>
            ) : (
              steps.map((step) => (
                <StepTableRow
                  key={step.id}
                  step={step}
                  isSelected={selectedSteps.includes(step.id)}
                  onSelectStep={onSelectStep}
                  onDeleteStep={onDelete}
                  onEditStep={onEdit}
                  onViewDetails={onDetails}
                  circuitName={circuitNamesMap[step.circuitId]}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
