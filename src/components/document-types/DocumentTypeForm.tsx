
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, ChevronRight } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import documentService from '@/services/documentService';
import { DocumentType } from '@/models/document';

const typeSchema = z.object({
  typeName: z.string().min(2, "Type name must be at least 2 characters."),
  typeAttr: z.string().optional(),
});

type DocumentTypeFormProps = {
  documentType?: DocumentType | null;
  isEditMode?: boolean;
  onSuccess: () => void;
  onCancel: () => void;
};

export const DocumentTypeForm = ({ documentType, isEditMode = false, onSuccess, onCancel }: DocumentTypeFormProps) => {
  const [step, setStep] = useState(1);
  const [isTypeNameValid, setIsTypeNameValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const form = useForm<z.infer<typeof typeSchema>>({
    resolver: zodResolver(typeSchema),
    defaultValues: {
      typeName: documentType?.typeName || "",
      typeAttr: documentType?.typeAttr || "",
    },
  });

  // Update form values when documentType changes (for edit mode)
  useEffect(() => {
    if (documentType && isEditMode) {
      form.reset({
        typeName: documentType.typeName || "",
        typeAttr: documentType.typeAttr || "",
      });
      
      // Skip to step 2 in edit mode since we're not validating the name
      if (isEditMode) {
        setStep(2);
      }
    }
  }, [documentType, isEditMode, form]);

  const validateTypeName = async (typeName: string) => {
    // If we're in edit mode and the name hasn't changed, it's valid
    if (isEditMode && typeName === documentType?.typeName) {
      return true;
    }
    
    if (typeName.length < 2) return false;
    
    setIsValidating(true);
    try {
      const exists = await documentService.validateTypeName(typeName);
      setIsTypeNameValid(!exists);
      return !exists;
    } catch (error) {
      console.error('Error validating type name:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      const typeName = form.getValues("typeName");
      const isValid = await validateTypeName(typeName);
      
      if (isValid) {
        setStep(2);
      } else {
        form.setError("typeName", { 
          type: "manual", 
          message: "This type name already exists." 
        });
      }
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const onSubmit = async (data: z.infer<typeof typeSchema>) => {
    try {
      if (isEditMode && documentType?.id) {
        await documentService.updateDocumentType(documentType.id, {
          typeName: data.typeName,
          typeAttr: data.typeAttr || undefined,
          // Maintain other properties
          typeKey: documentType.typeKey,
          documentCounter: documentType.documentCounter
        });
      } else {
        await documentService.createDocumentType({
          typeName: data.typeName,
          typeAttr: data.typeAttr || undefined
        });
      }
      form.reset();
      setStep(1);
      onSuccess();
    } catch (error) {
      console.error(isEditMode ? 'Failed to update document type:' : 'Failed to create document type:', error);
    }
  };

  return (
    <div className="space-y-6">
      {!isEditMode && (
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center 
              ${step === 1 ? "bg-blue-600 text-white" : "bg-green-500 text-white"}`}>
              {step === 1 ? "1" : <Check className="h-4 w-4"/>}
            </div>
            <div className={`h-0.5 w-12 ${step > 1 ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center 
              ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}>
              2
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {step === 1 && (
            <FormField
              control={form.control}
              name="typeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-blue-100">Type Name*</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter document type name" 
                      className="h-10 text-base bg-[#0A0E2E] border-blue-900/40"
                      onChange={(e) => {
                        field.onChange(e);
                        setIsTypeNameValid(null);
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-blue-300/70">
                    This name must be unique and at least 2 characters long
                  </FormDescription>
                  {isTypeNameValid === false && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <span className="inline-block w-4 h-4 rounded-full bg-red-100 text-red-600 text-center mr-1.5 text-xs font-bold">!</span>
                      This type name already exists
                    </p>
                  )}
                  {isTypeNameValid === true && (
                    <p className="text-sm text-green-500 flex items-center mt-1">
                      <span className="inline-block w-4 h-4 rounded-full bg-green-100 text-green-600 text-center mr-1.5 text-xs">✓</span>
                      Type name is available
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="typeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-blue-100">Type Name*</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter document type name" 
                        className="h-10 text-base bg-[#0A0E2E] border-blue-900/40"
                      />
                    </FormControl>
                    <FormDescription className="text-blue-300/70">
                      This name must be unique and at least 2 characters long
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
              <FormField
                control={form.control}
                name="typeAttr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-blue-100">Type Attributes (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter attributes (optional)" 
                        className="h-10 text-base bg-[#0A0E2E] border-blue-900/40"
                      />
                    </FormControl>
                    <FormDescription className="text-blue-300/70">
                      Additional attributes for this document type
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </form>
      </Form>

      <div className="mt-6">
        {step === 1 && !isEditMode ? (
          <Button 
            onClick={nextStep}
            disabled={!form.getValues("typeName") || form.getValues("typeName").length < 2 || isValidating}
            className="w-full h-10 text-base"
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            <Button onClick={form.handleSubmit(onSubmit)} className="w-full h-10 text-base bg-green-600 hover:bg-green-700">
              {isEditMode ? 'Update Type' : 'Create Type'}
            </Button>
            {!isEditMode && (
              <Button variant="outline" onClick={prevStep} className="w-full h-10 text-base border-blue-800/50 bg-blue-900/10">
                Back
              </Button>
            )}
          </div>
        )}
        <Button variant="outline" onClick={() => {
          setStep(1);
          form.reset();
          onCancel();
        }} className="w-full h-9 text-sm mt-2 border-blue-800/50 bg-blue-900/10">Cancel</Button>
      </div>
    </div>
  );
};

export default DocumentTypeForm;
