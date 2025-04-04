
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { File, FolderPlus, LogOut, Plus, Upload, UserCog, User } from 'lucide-react';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Business Plan.docx', type: 'document', date: '2023-06-12' },
    { id: 2, name: 'Financial Report.xlsx', type: 'spreadsheet', date: '2023-07-05' },
    { id: 3, name: 'Project Proposal.pdf', type: 'pdf', date: '2023-07-15' },
    { id: 4, name: 'Meeting Notes.docx', type: 'document', date: '2023-07-21' },
  ]);

  const getFileIcon = (type: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <DocuVerseLogo className="h-10 w-auto" />
            <h1 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
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
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Button className="bg-docuBlue hover:bg-docuBlue-700">
            <Upload className="mr-2 h-4 w-4" /> Upload File
          </Button>
          <Button variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" /> New Folder
          </Button>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Create Document
          </Button>
        </div>

        {/* Recent Files */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center">
                <div className="mr-3">
                  {getFileIcon(doc.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(doc.date).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
