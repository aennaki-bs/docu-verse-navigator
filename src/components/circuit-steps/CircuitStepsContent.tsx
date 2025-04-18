
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StepHeader } from '@/components/steps/StepHeader';
import { StepTable } from '@/components/steps/StepTable';
import { StepEmptyState } from '@/components/steps/StepEmptyState';

interface CircuitStepsContentProps {
  steps: Step[];
  selectedSteps: number[];
  onSelectStep: (id: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onEdit: (step: Step) => void;
  onDelete: (step: Step) => void;
  onDetails: (step: Step) => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  onAddStep: () => void;
  isSimpleUser: boolean;
  circuitId: string;
}

export const CircuitStepsContent = ({
  steps,
  selectedSteps,
  onSelectStep,
  onSelectAll,
  onEdit,
  onDelete,
  onDetails,
  viewMode,
  onViewModeChange,
  onAddStep,
  isSimpleUser,
  circuitId
}: CircuitStepsContentProps) => {
  return (
    <Card className="w-full shadow-md bg-[#111633]/70 border-blue-900/30">
      <CardHeader className="flex flex-row items-center justify-between border-b border-blue-900/30 bg-blue-900/20">
        <CardTitle className="text-xl text-blue-100">Steps in Circuit</CardTitle>
        <StepHeader 
          onAddStep={onAddStep} 
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </CardHeader>
      <CardContent className="p-0">
        {steps.length > 0 ? (
          viewMode === 'table' ? (
            <StepTable 
              steps={steps}
              selectedSteps={selectedSteps}
              onSelectStep={onSelectStep}
              onSelectAll={onSelectAll}
              onEdit={onEdit}
              onDelete={onDelete}
              onDetails={onDetails}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {steps.map(step => (
                <div 
                  key={step.id}
                  className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 hover:bg-blue-900/30 transition-colors"
                  onClick={() => window.location.href = `/circuits/${circuitId}/steps/${step.id}/statuses`}
                >
                  <h3 className="text-lg font-medium text-blue-200">{step.title}</h3>
                  <p className="text-blue-300/70 text-sm mt-1 line-clamp-2">{step.descriptif || 'No description'}</p>
                  <div className="text-xs font-mono text-blue-400 mt-2">{step.stepKey}</div>
                  <div className="flex justify-between items-center mt-3">
                    <div>Step {step.orderIndex + 1}</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-blue-400 hover:text-blue-600 hover:bg-blue-100/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(step);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <StepEmptyState 
            onAddStep={onAddStep}
            showAddButton={!isSimpleUser}
          />
        )}
      </CardContent>
    </Card>
  );
};
