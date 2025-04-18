
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import documentService from '@/services/documentService';
import { DocumentType } from '@/models/document';
import { TypeNameStep } from './steps/TypeNameStep';
import { StepIndicator } from './steps/StepIndicator';
import { FormActions } from './steps/FormActions';
import { TypeAliasStep } from './steps/TypeAliasStep';
import { ReviewStep } from './steps/ReviewStep';

const typeSchema = z.object({
  typeName: z.string().min(2, "Type name must be at least 2 characters."),
  typeAlias: z.string().optional(),
  typeAttr: z.string().optional(),
});

type DocumentTypeFormProps = {
  documentType?: DocumentType | null;
  isEditMode?: boolean;
  onSuccess: () => void;
  onCancel: () => void;
};

export const DocumentTypeForm = ({ 
  documentType, 
  isEditMode = false, 
  onSuccess, 
  onCancel 
}: DocumentTypeFormProps) => {
  const [step, setStep] = useState(1);
  const [isTypeNameValid, setIsTypeNameValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [nameValidationDone, setNameValidationDone] = useState(false);

  const form = useForm<z.infer<typeof typeSchema>>({
    resolver: zodResolver(typeSchema),
    defaultValues: {
      typeName: documentType?.typeName || "",
      typeAttr: documentType?.typeAttr || "",
      typeAlias: documentType?.typeKey || "",
    },
  });

  useEffect(() => {
    if (documentType && isEditMode) {
      form.reset({
        typeName: documentType.typeName || "",
        typeAttr: documentType.typeAttr || "",
        typeAlias: documentType.typeKey || "",
      });
      
      if (isEditMode) {
        setStep(4);
      }
    }
  }, [documentType, isEditMode, form]);

  const validateTypeName = async (typeName: string) => {
    if (isEditMode && typeName === documentType?.typeName) {
      setIsTypeNameValid(true);
      setNameValidationDone(true);
      return true;
    }
    
    if (typeName.length < 2) {
      setIsTypeNameValid(false);
      setNameValidationDone(true);
      return false;
    }
    
    setIsValidating(true);
    try {
      const exists = await documentService.validateTypeName(typeName);
      setIsTypeNameValid(!exists);
      setNameValidationDone(true);
      return !exists;
    } catch (error) {
      console.error('Error validating type name:', error);
      setIsTypeNameValid(false);
      setNameValidationDone(true);
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
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleCancel = () => {
    setStep(1);
    form.reset();
    onCancel();
  };

  const onSubmit = async (data: z.infer<typeof typeSchema>) => {
    try {
      if (isEditMode && documentType?.id) {
        await documentService.updateDocumentType(documentType.id, {
          typeName: data.typeName,
          typeAttr: data.typeAttr || undefined,
          typeKey: data.typeAlias,
          documentCounter: documentType.documentCounter
        });
      } else {
        await documentService.createDocumentType({
          typeName: data.typeName,
          typeAttr: data.typeAttr || undefined,
          typeKey: data.typeAlias
        });
      }
      form.reset();
      setStep(1);
      onSuccess();
    } catch (error) {
      console.error(isEditMode ? 'Failed to update document type:' : 'Failed to create document type:', error);
    }
  };

  // Check if Next button should be disabled for current step
  const isNextDisabled = () => {
    if (step === 1) {
      const typeName = form.getValues("typeName");
      return !typeName || typeName.length < 2 || (isTypeNameValid === false && nameValidationDone);
    }
    return false;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="space-y-4 w-full max-w-md">
        {step === 1 && !isEditMode && (
          <div className="flex items-center text-blue-400 text-sm mb-2 cursor-pointer" onClick={handleCancel}>
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            <span>Back</span>
          </div>
        )}
        
        {!isEditMode && <StepIndicator currentStep={step} totalSteps={4} />}

        <div className="mb-3">
          <h3 className="text-lg font-medium text-white">
            {isEditMode 
              ? 'Edit Document Type' 
              : step === 1 
                ? 'Type Name' 
                : step === 2
                  ? 'Type Description'
                  : step === 3
                    ? 'Type Code'
                    : 'Review'}
          </h3>
          <p className="text-xs text-blue-300 mt-1">
            {isEditMode 
              ? 'Update document type details'
              : step === 1 
                ? 'Create a unique name for this document type' 
                : step === 2
                  ? 'Add a description for this document type (optional)'
                  : step === 3
                    ? 'Add a code for this document type (optional)'
                    : 'Review your document type before creating it'}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 && (
              <TypeNameStep
                control={form.control}
                isTypeNameValid={isTypeNameValid}
                isValidating={isValidating}
                onTypeNameChange={() => {
                  setIsTypeNameValid(null);
                  setNameValidationDone(false);
                }}
              />
            )}

            {step === 2 && (
              <FormField
                control={form.control}
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
            )}

            {step === 3 && <TypeAliasStep control={form.control} />}

            {step === 4 && <ReviewStep />}
          </form>
        </Form>

        <FormActions
          step={step}
          totalSteps={4}
          isEditMode={isEditMode}
          onNext={nextStep}
          onPrev={prevStep}
          onSubmit={form.handleSubmit(onSubmit)}
          onCancel={handleCancel}
          isNextDisabled={isNextDisabled()}
          isValidating={isValidating}
        />
      </div>
    </div>
  );
};

export default DocumentTypeForm;
