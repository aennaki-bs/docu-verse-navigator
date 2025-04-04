
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { ArrowLeft, LogOut, UserCog, Save } from 'lucide-react';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import documentService from '@/services/documentService';
import { Document, DocumentType, UpdateDocumentRequest } from '@/models/document';

const EditDocument = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [documentAlias, setDocumentAlias] = useState('');
  const [docDate, setDocDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!id) {
      toast.error('Invalid document ID');
      navigate('/documents');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [documentData, typesData] = await Promise.all([
          documentService.getDocumentById(Number(id)),
          documentService.getAllDocumentTypes()
        ]);
        
        setDocument(documentData);
        setDocumentTypes(typesData);
        
        // Initialize form with document data
        setSelectedTypeId(documentData.typeId);
        setTitle(documentData.title);
        setDocumentAlias(documentData.documentAlias);
        setDocDate(new Date(documentData.docDate).toISOString().split('T')[0]);
        setContent(documentData.content);
      } catch (error) {
        console.error(`Failed to fetch document data:`, error);
        toast.error('Failed to load document data');
        navigate('/documents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleLogout = () => {
    logout(navigate);
  };

  const getInitials = () => {
    return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;
  };

  const validateForm = () => {
    if (!selectedTypeId) {
      toast.error('Please select a document type');
      return false;
    }
    if (!title.trim()) {
      toast.error('Please enter a document title');
      return false;
    }
    if (!docDate) {
      toast.error('Please select a document date');
      return false;
    }
    if (!content.trim()) {
      toast.error('Please enter document content');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !id) return;

    try {
      setIsSubmitting(true);
      const documentData: UpdateDocumentRequest = {
        title,
        content,
        typeId: selectedTypeId,
        documentAlias,
        docDate,
      };

      await documentService.updateDocument(Number(id), documentData);
      toast.success('Document updated successfully');
      navigate(`/documents/${id}`);
    } catch (error) {
      console.error('Failed to update document:', error);
      toast.error('Failed to update document');
    } finally {
      setIsSubmitting(false);
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center">
          <Button variant="outline" size="sm" onClick={() => navigate(`/documents/${id}`)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Document
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Document
          </h1>
        </div>

        {isLoading ? (
          <Card className="animate-pulse">
            <CardContent className="p-6 space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ) : document ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="documentType">Document Type*</Label>
                    <Select 
                      value={selectedTypeId?.toString() || ''} 
                      onValueChange={(value) => setSelectedTypeId(Number(value))}
                    >
                      <SelectTrigger>
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
                  
                  <div>
                    <Label htmlFor="documentAlias">Document Alias</Label>
                    <Input 
                      id="documentAlias" 
                      value={documentAlias} 
                      onChange={e => setDocumentAlias(e.target.value)}
                      placeholder="e.g., INV for Invoice"
                      maxLength={10}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {document.documentKey.includes(documentAlias) ? 
                        'Current document key contains this alias' : 
                        'Changing this will update the document key'}
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Document Title*</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter document title"
                  />
                </div>

                <div>
                  <Label htmlFor="docDate">Document Date*</Label>
                  <Input 
                    id="docDate" 
                    type="date" 
                    value={docDate} 
                    onChange={e => setDocDate(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Document Content*</Label>
                  <Textarea 
                    id="content" 
                    value={content} 
                    onChange={e => setContent(e.target.value)}
                    placeholder="Enter document content"
                    rows={10}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => navigate(`/documents/${id}`)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="mr-2 h-4 w-4" /> 
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p>Document not found or you don't have permission to edit it.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default EditDocument;
