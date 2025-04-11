
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ArrowLeft, ArrowRight, LogOut, UserCog, Save, Check } from 'lucide-react';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import documentService from '@/services/documentService';
import { DocumentType, CreateDocumentRequest } from '@/models/document';

const CreateDocument = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [documentAlias, setDocumentAlias] = useState('');
  const [docDate, setDocDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');

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
      };

      const createdDocument = await documentService.createDocument(documentData);
      toast.success('Document created successfully');
      navigate(`/documents/${createdDocument.id}`);
    } catch (error) {
      console.error('Failed to create document:', error);
      toast.error('Failed to create document');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="documentType" className="text-base font-medium">Document Type*</Label>
              <Select 
                value={selectedTypeId?.toString() || ''} 
                onValueChange={(value) => setSelectedTypeId(Number(value))}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map(type => (
                    <SelectItem key={type.id} value={type.id!.toString()}>
                      {type.typeName} ({type.typeKey})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label htmlFor="documentAlias" className="text-base font-medium">Document Alias (Optional)</Label>
              <Input 
                id="documentAlias" 
                value={documentAlias} 
                onChange={e => setDocumentAlias(e.target.value)}
                placeholder="e.g., INV for Invoice"
                maxLength={10}
                className="h-12 text-base"
              />
              <p className="text-sm text-gray-500 mt-1">
                Short code to include in document key (e.g., INV for Invoice)
              </p>
            </div>
            <div className="flex justify-between pt-6">
              <Button variant="outline" size="lg" onClick={() => navigate('/documents')} className="px-6">Cancel</Button>
              <Button size="lg" onClick={handleNextStep} className="px-6">
                Next <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-base font-medium">Document Title*</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter document title"
                className="h-12 text-base"
              />
            </div>
            <div className="flex justify-between pt-6">
              <Button variant="outline" size="lg" onClick={handlePrevStep} className="px-6">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back
              </Button>
              <Button size="lg" onClick={handleNextStep} className="px-6">
                Next <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="docDate" className="text-base font-medium">Document Date*</Label>
              <Input 
                id="docDate" 
                type="date" 
                value={docDate} 
                onChange={e => setDocDate(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <div className="flex justify-between pt-6">
              <Button variant="outline" size="lg" onClick={handlePrevStep} className="px-6">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back
              </Button>
              <Button size="lg" onClick={handleNextStep} className="px-6">
                Next <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="content" className="text-base font-medium">Document Content*</Label>
              <Textarea 
                id="content" 
                value={content} 
                onChange={e => setContent(e.target.value)}
                placeholder="Enter document content"
                rows={8}
                className="text-base resize-y"
              />
            </div>
            <div className="flex justify-between pt-6">
              <Button variant="outline" size="lg" onClick={handlePrevStep} className="px-6">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back
              </Button>
              <Button size="lg" onClick={handleNextStep} className="px-6">
                Review <Check className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        );
      case 5:
        const selectedType = documentTypes.find(t => t.id === selectedTypeId);
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Document Summary</h3>
            
            <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Document Type</p>
                  <p className="text-base font-medium">{selectedType?.typeName}</p>
                </div>
                {documentAlias && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Document Alias</p>
                    <p className="text-base font-medium">{documentAlias}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Title</p>
                  <p className="text-base font-medium">{title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date</p>
                  <p className="text-base font-medium">{new Date(docDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Content</p>
                <p className="text-base whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-md">{content}</p>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="outline" size="lg" onClick={handlePrevStep} className="px-6">
                <ArrowLeft className="mr-2 h-5 w-5" /> Edit
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                size="lg"
                className="bg-green-600 hover:bg-green-700 px-6"
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

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Step 1: Select Document Type";
      case 2: return "Step 2: Document Title";
      case 3: return "Step 3: Document Date";
      case 4: return "Step 4: Document Content";
      case 5: return "Step 5: Review & Create";
      default: return "Create Document";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard">
              <DocuVerseLogo className="h-10 w-auto" />
            </Link>
            <h1 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">DocApp</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && user.role === 'Admin' && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            )}
            <Link to="/profile">
              <div className="flex items-center space-x-3 cursor-pointer">
                <Avatar className="h-9 w-9">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt="Profile" />
                  ) : (
                    <AvatarFallback className="text-sm">{getInitials()}</AvatarFallback>
                  )}
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Document</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{getStepTitle()}</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex flex-col items-center relative">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    s < step ? "bg-green-500 text-white shadow-md" : 
                    s === step ? "bg-blue-600 text-white shadow-md" : 
                    "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  } transition-all duration-200`}
                >
                  {s < step ? <Check className="h-5 w-5" /> : s}
                </div>
                <p className={`mt-2 text-sm ${
                  s === step ? "font-medium text-blue-600 dark:text-blue-400" :
                  s < step ? "font-medium text-green-600 dark:text-green-400" :
                  "text-gray-500 dark:text-gray-400"
                }`}>
                  {s === 1 ? "Type" : 
                   s === 2 ? "Title" : 
                   s === 3 ? "Date" : 
                   s === 4 ? "Content" : "Review"}
                </p>
                {s < 5 && (
                  <div className={`absolute top-6 left-12 h-1 w-[calc(100%-3rem)] ${
                    s < step ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-center">{getStepTitle()}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : (
              renderStepContent()
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateDocument;
