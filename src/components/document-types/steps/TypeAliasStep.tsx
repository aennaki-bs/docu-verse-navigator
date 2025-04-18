
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";

interface TypeAliasStepProps {
  control: Control<any>;
}

export const TypeAliasStep = ({ control }: TypeAliasStepProps) => {
  return (
    <FormField
      control={control}
      name="typeAlias"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs text-blue-100">Type Code (Optional)</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              placeholder="Enter type code" 
              className="h-8 text-xs bg-[#0A0E2E] border-blue-900/40 focus:border-blue-500"
            />
          </FormControl>
          <FormDescription className="text-xs text-blue-300/70">
            A short identifier code for this document type
          </FormDescription>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
