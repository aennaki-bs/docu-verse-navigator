import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Action, AssignActionToStepDto, StatusEffectDto } from '@/models/action';
import stepService from '@/services/stepService';
import { actionService } from '@/services/actionService';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const assignActionSchema = z.object({
  stepId: z.string().min(1, 'Please select a step'),
  statusEffects: z.array(z.object({
    statusId: z.number(),
    setsComplete: z.boolean()
  })).optional()
});

interface AssignActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: Action | null;
  theme?: string;
  skipStepsFetch?: boolean;
}

export function AssignActionDialog({ 
  open, 
  onOpenChange, 
  action,
  theme = "dark",
  skipStepsFetch = false 
}: AssignActionDialogProps) {
  const [loading, setLoading] = useState(false);

  // Theme-specific classes
  const dialogContentClass = theme === "dark" 
    ? "bg-[#0f1642] border-blue-900/30 text-white" 
    : "bg-white border-gray-200 text-gray-900";

  const dialogTitleClass = theme === "dark" 
    ? "text-white" 
    : "text-gray-900";

  const dialogDescriptionClass = theme === "dark" 
    ? "text-blue-300" 
    : "text-gray-500";

  const labelClass = theme === "dark" 
    ? "text-blue-200" 
    : "text-gray-700";

  const selectTriggerClass = theme === "dark" 
    ? "bg-blue-950/50 border-blue-900/50 text-white" 
    : "bg-white border-gray-200 text-gray-900";

  const selectContentClass = theme === "dark" 
    ? "bg-[#0a1033] border-blue-900/30 text-white" 
    : "bg-white border-gray-200 text-gray-900";

  const selectItemHoverClass = theme === "dark" 
    ? "hover:bg-blue-900/20" 
    : "hover:bg-gray-100";

  const cancelButtonClass = theme === "dark" 
    ? "bg-blue-950/50 border-blue-900/50 text-blue-400 hover:text-white hover:bg-blue-900/30" 
    : "bg-white border-gray-200 text-blue-500 hover:text-blue-600 hover:bg-gray-50";

  const submitButtonClass = theme === "dark" 
    ? "bg-blue-600 hover:bg-blue-700" 
    : "bg-blue-500 hover:bg-blue-600";

  const alertClass = theme === "dark"
    ? "bg-blue-900/20 border-blue-800/30 text-blue-200"
    : "bg-blue-50 border-blue-100 text-blue-800";

  // Only fetch steps if not skipping
  const { data: steps = [], isLoading: stepsLoading, isError: stepsError } = useQuery({
    queryKey: ['steps'],
    queryFn: stepService.getAllSteps,
    enabled: !skipStepsFetch && open, // Only fetch when dialog is open and not skipping
  });

  const form = useForm({
    resolver: zodResolver(assignActionSchema),
    defaultValues: {
      stepId: '',
      statusEffects: []
    }
  });

  const handleSubmit = async (values: z.infer<typeof assignActionSchema>) => {
    if (!action) return;

    setLoading(true);
    try {
      const data: AssignActionToStepDto = {
        stepId: parseInt(values.stepId),
        actionId: action.actionId,
        statusEffects: values.statusEffects
      };

      await actionService.assignToStep(data);
      toast({
        title: "Success",
        description: "Action assigned to step successfully",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign action to step",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!action) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[425px] ${dialogContentClass}`}>
        <DialogHeader>
          <DialogTitle className={dialogTitleClass}>Assign Action to Step</DialogTitle>
          <DialogDescription className={dialogDescriptionClass}>
            Select a step to assign the action "{action.title}" to.
          </DialogDescription>
        </DialogHeader>

        {skipStepsFetch && (
          <Alert className={alertClass}>
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Steps fetching is disabled</AlertTitle>
            <AlertDescription>
              Please use the Step Management page to assign actions to steps.
            </AlertDescription>
          </Alert>
        )}

        {!skipStepsFetch && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="stepId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Step</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={selectTriggerClass}>
                          <SelectValue placeholder="Select a step" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className={selectContentClass}>
                        {stepsLoading ? (
                          <SelectItem value="loading" disabled className={selectItemHoverClass}>
                            Loading steps...
                          </SelectItem>
                        ) : stepsError ? (
                          <SelectItem value="error" disabled className={selectItemHoverClass}>
                            Error loading steps
                          </SelectItem>
                        ) : steps.length === 0 ? (
                          <SelectItem value="empty" disabled className={selectItemHoverClass}>
                            No steps available
                          </SelectItem>
                        ) : (
                          steps.map((step) => (
                            <SelectItem 
                              key={step.id} 
                              value={step.id.toString()} 
                              className={selectItemHoverClass}
                            >
                              {step.title}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                  className={cancelButtonClass}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || stepsLoading || stepsError || steps.length === 0}
                  className={submitButtonClass}
                >
                  {loading ? "Assigning..." : "Assign"}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {!skipStepsFetch && (
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className={cancelButtonClass}
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 