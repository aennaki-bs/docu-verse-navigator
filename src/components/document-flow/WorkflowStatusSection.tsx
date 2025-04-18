
import { DocumentWorkflowStatus } from '@/models/documentCircuit';
import { DocumentStatusCard } from './DocumentStatusCard';
import { StepRequirementsCard } from './StepRequirementsCard';

interface WorkflowStatusSectionProps {
  workflowStatus: DocumentWorkflowStatus | null | undefined;
}

export function WorkflowStatusSection({ workflowStatus }: WorkflowStatusSectionProps) {
  if (!workflowStatus) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      <div className="w-full lg:col-span-1">
        <DocumentStatusCard workflowStatus={workflowStatus} />
      </div>
      <div className="w-full lg:col-span-1">
        <StepRequirementsCard 
          statuses={workflowStatus.statuses} 
          workflowStatus={workflowStatus}
        />
      </div>
    </div>
  );
}
