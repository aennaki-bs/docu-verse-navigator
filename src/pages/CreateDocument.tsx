
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, FileText, Check, Save } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import documentService from '@/services/documentService';
import { DocumentType, CreateDocumentRequest, SubType } from '@/models/document';
import { DatePickerInput } from '@/components/document/DatePickerInput';

export default function CreateDocument() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [subtypes, setSubtypes] = useState<SubType[]>([]);
  const [availableSubtypes, setAvailableSubtypes] = useState<SubType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSubtypes, setIsLoadingSubtypes] = useState(false);
  
  // Form data
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedSubTypeId, setSelectedSubTypeId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [documentAlias, setDocumentAlias] = useState('');
  const [docDate, setDocDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        setIsLoading(true);
        const types = await documentService.getAllDocumentTypes();
        setDocumentTypes(types);
      } catch (error) {
        console.error('Failed to fetch document types:', error);
        toast.error('Failed to load document types');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentTypes();
  }, []);

  useEffect(() => {
    const fetchSubtypes = async () => {
      if (selectedTypeId) {
        try {
          setIsLoadingSubtypes(true);
          const fetchedSubtypes = await documentService.getSubTypesByDocumentTypeId(selectedTypeId);
          setSubtypes(fetchedSubtypes);
          
          if (docDate) {
            const validSubtypes = fetchedSubtypes.filter(
              st => new Date(docDate) >= new Date(st.startDate) && 
                    new Date(docDate) <= new Date(st.endDate) &&
                    st.isActive
            );
            setAvailableSubtypes(validSubtypes);
          } else {
            setAvailableSubtypes(fetchedSubtypes.filter(st => st.isActive));
          }
        } catch (error) {
          console.error('Failed to fetch subtypes:', error);
          toast.error('Failed to load subtypes');
        } finally {
          setIsLoadingSubtypes(false);
        }
      } else {
        setSubtypes([]);
        setAvailableSubtypes([]);
      }
    };

    fetchSubtypes();
  }, [selectedTypeId, docDate]);

  const handleLogout = () => {
    logout(navigate);
  };

  const getInitials = () => {
    return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setStep(prevStep => prevStep + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        if (!selectedTypeId) {
          toast.error('Please select a document type');
          return false;
        }
        return true;
      case 2:
        if (!title.trim()) {
          toast.error('Please enter a document title');
          return false;
        }
        return true;
      case 3:
        if (!docDate) {
          toast.error('Please select a document date');
          return false;
        }
        
        if (selectedSubTypeId && availableSubtypes.length > 0) {
          const selectedSubtype = availableSubtypes.find(st => st.id === selectedSubTypeId);
          if (!selectedSubtype) {
            toast.error('Selected subtype is not valid for the chosen date');
            return false;
          }
          
          const documentDate = new Date(docDate);
          const startDate = new Date(selectedSubtype.startDate);
          const endDate = new Date(selectedSubtype.endDate);
          
          if (documentDate < startDate || documentDate > endDate) {
            setDateError(`Document date must be between ${startDate.toLocaleDateString()} and ${endDate.toLocaleDateString()}`);
            return false;
          }
        }
        
        setDateError('');
        return true;
      case 4:
        if (!content.trim()) {
          toast.error('Please enter document content');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    if (!selectedTypeId) {
      toast.error('Document type is required');
      setStep(1);
      return;
    }

    try {
      setIsSubmitting(true);
      const documentData: CreateDocumentRequest = {
        title,
        content,
        typeId: selectedTypeId,
        documentAlias,
        docDate,
        subTypeId: selectedSubTypeId || undefined,
      };

      const createdDocument = await documentService.createDocument(documentData);
      toast.success('Document created successfully');
      navigate(`/documents/${createdDocument.id}`);
    } catch (error: any) {
      console.error('Failed to create document:', error);
      toast.error(error?.response?.data || 'Failed to create document');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      const dateString = newDate.toISOString().split('T')[0];
      setDocDate(dateString);
      setDateError('');
      
      if (selectedTypeId && subtypes.length > 0) {
        const validSubtypes = subtypes.filter(
          st => newDate >= new Date(st.startDate) && 
                newDate <= new Date(st.endDate) &&
                st.isActive
        );
        setAvailableSubtypes(validSubtypes);
        
        if (selectedSubTypeId) {
          const isStillValid = validSubtypes.some(st => st.id === selectedSubTypeId);
          if (!isStillValid) {
            setSelectedSubTypeId(null);
            toast.warning('Selected subtype is no longer valid for the new date');
          }
        }
      }
    }
  };

  const handleTypeChange = (typeId: string) => {
    setSelectedTypeId(Number(typeId));
    setSelectedSubTypeId(null); // Reset subtype when type changes
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="documentType" className="text-sm font-medium text-gray-200">Document Type*</Label>
              <Select 
                value={selectedTypeId?.toString() || ''} 
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="h-12 text-base bg-gray-900 border-gray-800 text-white">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  {documentTypes.map(type => (
                    <SelectItem key={type.id} value={type.id!.toString()} className="text-gray-200">
                      {type.typeName} ({type.typeKey})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label htmlFor="documentAlias" className="text-sm font-medium text-gray-200">Document Alias (Optional)</Label>
              <Input 
                id="documentAlias" 
                value={documentAlias} 
                onChange={e => setDocumentAlias(e.target.value)}
                placeholder="e.g., INV for Invoice"
                maxLength={10}
                className="h-12 text-base bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
              <p className="text-sm text-gray-500">
                Short code to include in document key (e.g., INV for Invoice)
              </p>
            </div>
            <div className="flex justify-between pt-6">
              <Button variant="outline" className="border-gray-700 hover:bg-gray-800" onClick={() => navigate('/documents')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNextStep}>
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-medium text-gray-200">Document Title*</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter document title"
                className="h-12 text-base bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="flex justify-between pt-6">
              <Button variant="outline" className="border-gray-700 hover:bg-gray-800" onClick={handlePrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNextStep}>
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="docDate" className="text-sm font-medium text-gray-200">Document Date*</Label>
              <DatePickerInput 
                date={new Date(docDate)} 
                onDateChange={handleDateChange}
              />
              {dateError && (
                <p className="text-sm text-red-500">{dateError}</p>
              )}
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="subType" className="text-sm font-medium text-gray-200">Document SubType</Label>
              <Select 
                value={selectedSubTypeId?.toString() || ''} 
                onValueChange={(id) => setSelectedSubTypeId(Number(id))}
                disabled={isLoadingSubtypes || availableSubtypes.length === 0}
              >
                <SelectTrigger className="h-12 text-base bg-gray-900 border-gray-800 text-white">
                  <SelectValue placeholder={
                    isLoadingSubtypes 
                      ? "Loading subtypes..." 
                      : availableSubtypes.length === 0 
                        ? "No valid subtypes for selected date" 
                        : "Select document subtype"
                  } />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="" className="text-gray-400">None</SelectItem>
                  {availableSubtypes.map(subtype => (
                    <SelectItem key={subtype.id} value={subtype.id.toString()} className="text-gray-200">
                      {subtype.name} ({new Date(subtype.startDate).toLocaleDateString()} - {new Date(subtype.endDate).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                {selectedSubTypeId 
                  ? `Selected subtype valid from ${new Date(availableSubtypes.find(st => st.id === selectedSubTypeId)?.startDate || '').toLocaleDateString()} to ${new Date(availableSubtypes.find(st => st.id === selectedSubTypeId)?.endDate || '').toLocaleDateString()}`
                  : "Optional: Select a subtype for this document"}
              </p>
            </div>
            
            <div className="flex justify-between pt-6">
              <Button variant="outline" className="border-gray-700 hover:bg-gray-800" onClick={handlePrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNextStep}>
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="content" className="text-sm font-medium text-gray-200">Document Content*</Label>
              <Textarea 
                id="content" 
                value={content} 
                onChange={e => setContent(e.target.value)}
                placeholder="Enter document content"
                rows={8}
                className="text-base resize-y bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="flex justify-between pt-6">
              <Button variant="outline" className="border-gray-700 hover:bg-gray-800" onClick={handlePrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNextStep}>
                Review
                <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 5:
        const selectedType = documentTypes.find(t => t.id === selectedTypeId);
        const selectedSubType = subtypes.find(st => st.id === selectedSubTypeId);
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Document Summary</h3>
            
            <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Document Type</p>
                  <p className="text-base font-medium text-white">{selectedType?.typeName}</p>
                </div>
                {documentAlias && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Document Alias</p>
                    <p className="text-base font-medium text-white">{documentAlias}</p>
                  </div>
                )}
                {selectedSubType && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Document SubType</p>
                    <p className="text-base font-medium text-white">{selectedSubType.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Valid from {new Date(selectedSubType.startDate).toLocaleDateString()} to {new Date(selectedSubType.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Title</p>
                  <p className="text-base font-medium text-white">{title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date</p>
                  <p className="text-base font-medium text-white">{new Date(docDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Content</p>
                <p className="text-base whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-md text-white">{content}</p>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="outline" className="border-gray-700 hover:bg-gray-800" onClick={handlePrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="mr-2 h-5 w-5" /> 
                {isSubmitting ? 'Creating...' : 'Create Document'}
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Step indicator component
  const StepIndicator = ({ currentStep }: { currentStep: number }) => {
    const steps = [
      { number: 1, title: "Type" },
      { number: 2, title: "Title" },
      { number: 3, title: "Date & SubType" },
      { number: 4, title: "Content" },
      { number: 5, title: "Review" }
    ];

    return (
      <div className="flex justify-center space-x-2 mb-8 overflow-x-auto">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${step.number === currentStep
                  ? 'bg-blue-600 text-white ring-4 ring-blue-600/20'
                  : step.number < currentStep
                  ? 'bg-blue-600/20 text-blue-600 border-2 border-blue-600'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}
            >
              {step.number < currentStep ? '✓' : step.number}
            </div>
            {step.number < 5 && (
              <div
                className={`h-[2px] w-12 transition-colors
                  ${step.number < currentStep ? 'bg-blue-600' : 'bg-gray-700'}`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-6 w-6 text-blue-500" />
          <h1 className="text-3xl font-semibold text-white">Create Document</h1>
        </div>
        <p className="text-gray-400">Create a new document in simple steps</p>
      </div>

      <Card className="w-full max-w-3xl mx-auto border-gray-800 bg-[#0d1117]">
        <div className="p-6 space-y-6">
          <StepIndicator currentStep={step} />
          
          <div className="border-b border-gray-800 pb-4">
            <h2 className="text-xl font-semibold text-center text-white">
              {step === 1 && "Select Document Type"}
              {step === 2 && "Document Title"}
              {step === 3 && "Document Date & SubType"}
              {step === 4 && "Document Content"}
              {step === 5 && "Review Document"}
            </h2>
          </div>

          <div className="space-y-6">
            {renderStepContent()}
          </div>
        </div>
      </Card>
    </div>
  );
}
