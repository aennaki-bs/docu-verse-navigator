
import { useState, useEffect } from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';
import documentTypeService from '@/services/documents/documentTypeService';

interface TypeAliasStepProps {
  control: Control<any>;
}

export const TypeAliasStep = ({ control }: TypeAliasStepProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isTypeKeyValid, setIsTypeKeyValid] = useState<boolean | null>(null);

  const validateTypeKey = async (value: string) => {
    if (!value || value.length < 2) {
      return true; // It's optional, so empty value is valid
    }
    
    if (value.length > 3) {
      setIsTypeKeyValid(false);
      return false;
    }

    setIsValidating(true);
    try {
      const isValid = await documentTypeService.validateTypeKey(value.toUpperCase());
      setIsTypeKeyValid(isValid);
      return isValid;
    } catch (error) {
      console.error('Type key validation error:', error);
      setIsTypeKeyValid(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <FormField
      control={control}
      name="typeAlias"
      rules={{
        maxLength: {
          value: 3,
          message: "Type code must be maximum 3 characters"
        },
        minLength: {
          value: 2,
          message: "Type code must be at least 2 characters"
        },
        validate: validateTypeKey
      }}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="text-xs text-blue-100">Type Code (Optional)</FormLabel>
          <div className="relative">
            <FormControl>
              <Input 
                {...field} 
                placeholder="Enter type code (2-3 characters)"
                className="h-8 text-xs border-blue-900/40 focus:border-blue-500 pr-8"
                maxLength={3}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  field.onChange(value);
                  if (value.length >= 2) {
                    validateTypeKey(value);
                  } else {
                    setIsTypeKeyValid(null);
                  }
                }}
              />
            </FormControl>
            {isValidating && (
              <Loader2 className="absolute right-2 top-2 h-4 w-4 animate-spin text-blue-500" />
            )}
          </div>
          {isTypeKeyValid === false && !isValidating && (
            <FormMessage className="text-xs">This type code already exists</FormMessage>
          )}
          {fieldState.error && (
            <FormMessage className="text-xs">{fieldState.error.message}</FormMessage>
          )}
          <FormDescription className="text-xs text-blue-300/70">
            Enter a unique 2-3 character code for this document type
          </FormDescription>
        </FormItem>
      )}
    />
  );
};
