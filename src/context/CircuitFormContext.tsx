
import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import circuitService from '@/services/circuitService';
import { Circuit, Step } from '@/models/circuit';

// Define a separate interface for the form data
interface CircuitFormData {
  circuitKey: string;
  title: string;
  descriptif: string;
  isActive: boolean;
  hasOrderedFlow: boolean;
  allowBacktrack: boolean;
  crdCounter: number;
  steps: Partial<Step>[];
}

interface CircuitFormContextProps {
  formData: CircuitFormData;
  currentStep: number;
  isSubmitting: boolean;
  formError: string | null;
  setCircuitData: (data: Partial<CircuitFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  addStep: (step: Partial<Step>) => void;
  updateStep: (index: number, step: Partial<Step>) => void;
  removeStep: (index: number) => void;
  submitForm: () => Promise<boolean>;
}

const CircuitFormContext = createContext<CircuitFormContextProps | undefined>(undefined);

interface CircuitFormProviderProps {
  children: React.ReactNode;
}

export const CircuitFormProvider: React.FC<CircuitFormProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CircuitFormData>({
    circuitKey: '',
    title: '',
    descriptif: '',
    isActive: true,
    hasOrderedFlow: true,
    allowBacktrack: false,
    crdCounter: 0,
    steps: [],
  });

  const setCircuitData = useCallback((data: Partial<CircuitFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const addStep = useCallback((step: Partial<Step>) => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, step],
    }));
  }, []);

  const updateStep = useCallback((index: number, step: Partial<Step>) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps[index] = step;
      return { ...prev, steps: newSteps };
    });
  }, []);

  const removeStep = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  }, []);

  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setFormData({
      circuitKey: '',
      title: '',
      descriptif: '',
      isActive: true,
      hasOrderedFlow: true,
      allowBacktrack: false,
      crdCounter: 0,
      steps: [],
    });
  }, []);

  const submitCircuit = async () => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      // First create the circuit
      const newCircuit = await circuitService.createCircuit({
        title: formData.title,
        descriptif: formData.descriptif || '',
        isActive: formData.isActive,
        hasOrderedFlow: formData.hasOrderedFlow,
        allowBacktrack: formData.allowBacktrack,
      });

      // Then create the steps if any
      if (formData.steps && formData.steps.length > 0) {
        await Promise.all(
          formData.steps.map((step, index) =>
            circuitService.createStep({
              circuitId: newCircuit.id,
              title: step.title || '',
              descriptif: step.descriptif || '',
              orderIndex: index,
              isFinalStep: index === formData.steps.length - 1,
            })
          )
        );
      }

      toast.success(`Circuit "${formData.title}" created successfully`);
      resetForm();
      navigate('/circuits');
      return true;
    } catch (error) {
      console.error('Error creating circuit:', error);
      setFormError('Failed to create circuit. Please try again.');
      toast.error('Failed to create circuit');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const value = {
    formData,
    currentStep,
    isSubmitting,
    formError,
    setCircuitData,
    nextStep,
    prevStep,
    addStep,
    updateStep,
    removeStep,
    submitForm: submitCircuit,
  };

  return (
    <CircuitFormContext.Provider value={value}>
      {children}
    </CircuitFormContext.Provider>
  );
};

export const useCircuitForm = () => {
  const context = useContext(CircuitFormContext);
  if (context === undefined) {
    throw new Error('useCircuitForm must be used within a CircuitFormProvider');
  }
  return context;
};
