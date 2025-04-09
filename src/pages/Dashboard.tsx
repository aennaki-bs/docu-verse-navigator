
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircuitNavigation } from "@/components/navigation/CircuitNavigation";
import { useQuery } from "@tanstack/react-query";
import documentService from "@/services/documentService";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch recent documents
  const { data: recentDocuments } = useQuery({
    queryKey: ["recent-documents"],
    queryFn: () => documentService.getRecentDocuments(5),
    enabled: !!user,
  });

  // Check if user has management permissions
  const hasManagementPermissions = user?.role === 'Admin' || user?.role === 'FullUser';

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        
        {hasManagementPermissions && (
          <Button onClick={() => navigate('/document-types')} className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Manage Document Types
          </Button>
        )}
      </div>
      
      <div className="grid gap-6">
        <section>
          <h2 className="text-xl font-medium mb-4">Document Workflows</h2>
          <CircuitNavigation />
        </section>
        
        {recentDocuments && recentDocuments.length > 0 && (
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Recently created or modified documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentDocuments.map(doc => (
                    <div 
                      key={doc.id} 
                      className="p-3 rounded-md border flex justify-between items-center hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/documents/${doc.id}`)}
                    >
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.documentType?.typeName || 'No document type'} • 
                          Last updated: {new Date(doc.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
