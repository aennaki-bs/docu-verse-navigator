
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { File, FolderPlus, LogOut, Plus, UserCog } from 'lucide-react';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import documentService from '@/services/documentService';
import { Document } from '@/models/document';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has permissions to create/edit documents
  const canManageDocuments = user?.role === 'Admin' || user?.role === 'FullUser';

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documents = await documentService.getAllDocuments();
        // Sort by created date and take the most recent 5
        const sortedDocuments = documents
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        setRecentDocuments(sortedDocuments);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
        toast.error('Failed to load recent documents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleLogout = () => {
    logout(navigate);
  };

  const getFileIcon = (type: string) => {
    // This is a placeholder - you would have real document type detection here
    switch (type) {
      case 'document':
        return <File className="text-blue-500" />;
      case 'spreadsheet':
        return <File className="text-green-500" />;
      case 'pdf':
        return <File className="text-red-500" />;
      default:
        return <File className="text-gray-500" />;
    }
  };

  const getInitials = () => {
    return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;
  };

  const getDocumentTypeColor = (typeName: string) => {
    // Hash the type name to get a consistent color
    let hash = 0;
    for (let i = 0; i < typeName.length; i++) {
      hash = typeName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate a hue between 0 and 360
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <DocuVerseLogo className="h-10 w-auto" />
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
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    {user?.role && (
                      <Badge variant={user.role === "Admin" ? "success" : user.role === "FullUser" ? "info" : "outline"}>
                        {user.role}
                      </Badge>
                    )}
                  </div>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          {canManageDocuments ? (
            <>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link to="/documents/create">
                  <Plus className="mr-2 h-4 w-4" /> Create Document
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/documents">
                  <File className="mr-2 h-4 w-4" /> View All Documents
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/document-types">
                  <FolderPlus className="mr-2 h-4 w-4" /> Manage Document Types
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" disabled className="cursor-not-allowed opacity-60">
                <Plus className="mr-2 h-4 w-4" /> Create Document
              </Button>
              <Button variant="outline" asChild>
                <Link to="/documents">
                  <File className="mr-2 h-4 w-4" /> View All Documents
                </Link>
              </Button>
              <Button variant="outline" disabled className="cursor-not-allowed opacity-60">
                <FolderPlus className="mr-2 h-4 w-4" /> Manage Document Types
              </Button>
            </>
          )}
        </div>

        {/* Recent Documents */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Documents</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="h-24 animate-pulse">
                <CardContent className="p-4">
                  <div className="h-full bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentDocuments.map((doc) => (
              <Link to={`/documents/${doc.id}`} key={doc.id}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 flex items-center h-full">
                    <div className="mr-3" style={{ color: getDocumentTypeColor(doc.documentType.typeName) }}>
                      <File />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {doc.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {doc.documentKey}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(doc.docDate).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <File className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No documents</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new document
            </p>
            <div className="mt-6">
              {canManageDocuments ? (
                <Button asChild>
                  <Link to="/documents/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Document
                  </Link>
                </Button>
              ) : (
                <Button disabled className="cursor-not-allowed opacity-60">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Document
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
