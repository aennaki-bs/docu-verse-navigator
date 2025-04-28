import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { DocumentType } from "@/models/document";

interface SubTypeFormData {
  name: string;
  description: string;
  documentTypeId: number | null;
  startDate: Date | undefined;
  endDate: Date | undefined;
  isActive: boolean;
}

interface SubTypeFormContextType {
  currentStep: number;
  formData: SubTypeFormData;
  setFormData: (data: Partial<SubTypeFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
  submitForm: () => void;
  isSubmitting: boolean;
  totalSteps: number;
  validateCurrentStep: () => boolean;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  documentTypes: DocumentType[];
}

const initialFormData: SubTypeFormData = {
  name: "",
  description: "",
  documentTypeId: null,
  startDate: new Date(),
  endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  isActive: true,
};

const SubTypeFormContext = createContext<SubTypeFormContextType | undefined>(
  undefined
);

export const useSubTypeForm = () => {
  const context = useContext(SubTypeFormContext);
  if (!context) {
    throw new Error("useSubTypeForm must be used within a SubTypeFormProvider");
  }
  return context;
};

interface SubTypeFormProviderProps {
  children: React.ReactNode;
  onSubmit: (data: any) => void;
  documentTypes: DocumentType[];
  onClose: () => void;
}

export const SubTypeFormProvider: React.FC<SubTypeFormProviderProps> = ({
  children,
  onSubmit,
  documentTypes,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormDataState] =
    useState<SubTypeFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // We have a 3-step process
  const totalSteps = 3;

  const setFormData = (data: Partial<SubTypeFormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  const resetForm = () => {
    setCurrentStep(1);
    setFormDataState(initialFormData);
    setErrors({});
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }
    } else if (currentStep === 2) {
      if (!formData.documentTypeId) {
        newErrors.documentTypeId = "Document type is required";
      }
    } else if (currentStep === 3) {
      if (!formData.startDate) {
        newErrors.startDate = "Start date is required";
      }
      if (!formData.endDate) {
        newErrors.endDate = "End date is required";
      }
      if (
        formData.startDate &&
        formData.endDate &&
        formData.startDate >= formData.endDate
      ) {
        newErrors.dateRange = "Start date must be before end date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async () => {
    if (validateCurrentStep()) {
      setIsSubmitting(true);
      try {
        onSubmit({
          name: formData.name,
          description: formData.description,
          documentTypeId: formData.documentTypeId,
          startDate: formData.startDate?.toISOString(),
          endDate: formData.endDate?.toISOString(),
          isActive: formData.isActive,
        });
        resetForm();
        onClose();
        toast.success("Subtype created successfully");
      } catch (error) {
        console.error("Error creating subtype:", error);
        toast.error("Failed to create subtype");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <SubTypeFormContext.Provider
      value={{
        currentStep,
        formData,
        setFormData,
        nextStep,
        prevStep,
        resetForm,
        submitForm,
        isSubmitting,
        totalSteps,
        validateCurrentStep,
        errors,
        setErrors,
        documentTypes,
      }}
    >
      {children}
    </SubTypeFormContext.Provider>
  );
};
