
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import { ArrowLeft, LogOut, UserCog, Save } from 'lucide-react';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import documentService from '@/services/documentService';
import { Document, DocumentType, UpdateDocumentRequest } from '@/models/document';
import { Badge } from '@/components/ui/badge';

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
  
  // Track which fields have been edited
  const [editedFields, setEditedFields] = useState<Record<string, boolean>>({
    typeId: false,
    title: false,
    documentAlias: false,
    docDate: false,
    content: false
  });

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

  const handleTypeIdChange = (value: string) => {
    const numValue = Number(value);
    setSelectedTypeId(numValue);
    setEditedFields({...editedFields, typeId: numValue !== document?.typeId});
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTitle(newValue);
    setEditedFields({...editedFields, title: newValue !== document?.title});
  };

  const handleDocumentAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDocumentAlias(newValue);
    setEditedFields({...editedFields, documentAlias: newValue !== document?.documentAlias});
  };

  const handleDocDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDocDate(newValue);
    const originalDate = document?.docDate ? new Date(document.docDate).toISOString().split('T')[0] : '';
    setEditedFields({...editedFields, docDate: newValue !== originalDate});
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    setEditedFields({...editedFields, content: newValue !== document?.content});
  };

  const validateForm = () => {
    // Check if at least one field has been edited
    if (!Object.values(editedFields).some(edited => edited)) {
      toast.info('No changes detected');
      return false;
    }
    
    if (editedFields.typeId && !selectedTypeId) {
      toast.error('Please select a document type');
      return false;
    }
    if (editedFields.title && !title.trim()) {
      toast.error('Please enter a document title');
      return false;
    }
    if (editedFields.docDate && !docDate) {
      toast.error('Please select a document date');
      return false;
    }
    if (editedFields.content && !content.trim()) {
      toast.error('Please enter document content');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !id) return;

    try {
      setIsSubmitting(true);
      
      // Only include fields that have been edited
      const documentData: UpdateDocumentRequest = {};
      
      if (editedFields.typeId) documentData.typeId = selectedTypeId || undefined;
      if (editedFields.title) documentData.title = title;
      if (editedFields.documentAlias) documentData.documentAlias = documentAlias;
      if (editedFields.docDate) documentData.docDate = docDate;
      if (editedFields.content) documentData.content = content;

      console.log('Updating document with data:', documentData);
      
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
        <div className="mb-8 flex items-center">
          <Button variant="outline" size="lg" onClick={() => navigate(`/documents/${id}`)} className="mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Document
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Document
            </h1>
            {document && (
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="font-mono text-sm mr-3">
                  {document.documentKey}
                </Badge>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {new Date(document.updatedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <Card className="animate-pulse">
            <CardContent className="p-6 space-y-6">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ) : document ? (
          <Card className="shadow-lg border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl">Edit Document Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="documentType" className="text-base font-medium">Document Type*</Label>
                    <Select 
                      value={selectedTypeId?.toString() || ''} 
                      onValueChange={handleTypeIdChange}
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
                    {editedFields.typeId && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        ⚠️ Changing the document type may update the document key
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="documentAlias" className="text-base font-medium">Document Alias</Label>
                    <Input 
                      id="documentAlias" 
                      value={documentAlias} 
                      onChange={handleDocumentAliasChange}
                      placeholder="e.g., INV for Invoice"
                      maxLength={10}
                      className="h-12 text-base"
                    />
                    <p className={`text-xs ${
                      editedFields.documentAlias 
                        ? "text-yellow-600 dark:text-yellow-400" 
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {document.documentKey.includes(documentAlias) ? 
                        'Current document key contains this alias' : 
                        '⚠️ Changing this will update the document key'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="title" className="text-base font-medium">Document Title*</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={handleTitleChange}
                    placeholder="Enter document title"
                    className="h-12 text-base"
                  />
                  {editedFields.title && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      ℹ️ Title has been modified
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="docDate" className="text-base font-medium">Document Date*</Label>
                  <Input 
                    id="docDate" 
                    type="date" 
                    value={docDate} 
                    onChange={handleDocDateChange}
                    className="h-12 text-base"
                  />
                  {editedFields.docDate && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      ℹ️ Date has been modified
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="content" className="text-base font-medium">Document Content*</Label>
                  <Textarea 
                    id="content" 
                    value={content} 
                    onChange={handleContentChange}
                    placeholder="Enter document content"
                    rows={10}
                    className="text-base resize-y"
                  />
                  {editedFields.content && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      ℹ️ Content has been modified
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button variant="outline" size="lg" onClick={() => navigate(`/documents/${id}`)} className="px-6">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting || !Object.values(editedFields).some(edited => edited)}
                    size="lg"
                    className={`px-6 ${
                      Object.values(editedFields).some(edited => edited) 
                        ? "bg-green-600 hover:bg-green-700" 
                        : ""
                    }`}
                  >
                    <Save className="mr-2 h-5 w-5" /> 
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">Document not found or you don't have permission to edit it.</p>
              <Button 
                onClick={() => navigate('/documents')} 
                className="mt-4"
                variant="outline"
                size="lg"
              >
                Back to Documents
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default EditDocument;
