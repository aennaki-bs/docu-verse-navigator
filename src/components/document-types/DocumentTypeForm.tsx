import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Check } from 'lucide-react';
import { Form } from '@/components/ui/form';
import documentService from '@/services/documentService';
import { DocumentType } from '@/models/document';
import { TypeNameStep } from './steps/TypeNameStep';
import { TypeDetailsStep } from './steps/TypeDetailsStep';
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
        setStep(3);
      }
    }
  }, [documentType, isEditMode, form]);

  const validateTypeName = async (typeName: string) => {
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
    } else if (step === 2) {
      setStep(3);
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

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="space-y-4 w-full max-w-md">
        {step === 1 && !isEditMode && (
          <div className="flex items-center text-blue-400 text-sm mb-2 cursor-pointer" onClick={handleCancel}>
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            <span>Back</span>
          </div>
        )}
        
        {!isEditMode && <StepIndicator currentStep={step} totalSteps={3} />}

        <div className="mb-3">
          <h3 className="text-lg font-medium text-white">
            {isEditMode 
              ? 'Edit Document Type' 
              : step === 1 
                ? 'Type Name' 
                : step === 2
                  ? 'Type Details'
                  : 'Review'}
          </h3>
          <p className="text-xs text-blue-300 mt-1">
            {isEditMode 
              ? 'Update document type details'
              : step === 1 
                ? 'Create a unique name for this document type' 
                : step === 2
                  ? 'Add additional attributes for this document type'
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
                onTypeNameChange={() => setIsTypeNameValid(null)}
              />
            )}

            {step === 2 && (
              <>
                <TypeAliasStep control={form.control} />
                <TypeDetailsStep control={form.control} />
              </>
            )}

            {step === 3 && <ReviewStep />}
          </form>
        </Form>

        <FormActions
          step={step}
          totalSteps={3}
          isEditMode={isEditMode}
          onNext={nextStep}
          onPrev={prevStep}
          onSubmit={form.handleSubmit(onSubmit)}
          onCancel={handleCancel}
          isNextDisabled={!form.getValues("typeName") || form.getValues("typeName").length < 2}
          isValidating={isValidating}
        />
      </div>
    </div>
  );
};

export default DocumentTypeForm;
