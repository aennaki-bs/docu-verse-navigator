
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";

interface TypeDetailsStepProps {
  control: Control<any>;
}

export const TypeDetailsStep = ({ control }: TypeDetailsStepProps) => {
  return (
    <FormField
      control={control}
      name="typeAttr"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs text-blue-100">Description (Optional)</FormLabel>
          <FormControl>
            <Textarea 
              {...field} 
              placeholder="Enter description (optional)" 
              className="min-h-[100px] text-xs bg-[#0A0E2E] border-blue-900/40 focus:border-blue-500"
            />
          </FormControl>
          <FormDescription className="text-xs text-blue-300/70">
            Additional description for this document type
          </FormDescription>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
