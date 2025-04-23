
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
    },
  });

  useEffect(() => {
    if (documentType && isEditMode) {
      form.reset({
        typeName: documentType.typeName || "",
        typeAttr: documentType.typeAttr || "",
      });
      
      if (isEditMode) {
        setStep(2);
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
    }
  };

  const prevStep = () => {
    setStep(1);
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
    <div className="space-y-4 w-full max-w-md mx-auto">
      {step === 1 && !isEditMode && (
        <div className="flex items-center text-blue-400 text-sm mb-2 cursor-pointer" onClick={handleCancel}>
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          <span>Back</span>
        </div>
      )}
      
      {!isEditMode && <StepIndicator currentStep={step} />}

      <div className="mb-3">
        <h3 className="text-lg font-medium text-white">
          {isEditMode 
            ? 'Edit Document Type' 
            : step === 1 
              ? 'Type Name' 
              : 'Type Details'}
        </h3>
        <p className="text-xs text-blue-300 mt-1">
          {isEditMode 
            ? 'Update document type details'
            : step === 1 
              ? 'Create a unique name for this document type' 
              : 'Add additional attributes for this document type'}
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

          {step === 2 && <TypeDetailsStep control={form.control} />}
        </form>
      </Form>

      <FormActions
        step={step}
        isEditMode={isEditMode}
        onNext={nextStep}
        onPrev={prevStep}
        onSubmit={form.handleSubmit(onSubmit)}
        onCancel={handleCancel}
        isNextDisabled={!form.getValues("typeName") || form.getValues("typeName").length < 2}
        isValidating={isValidating}
      />
    </div>
  );
};

export default DocumentTypeForm;
