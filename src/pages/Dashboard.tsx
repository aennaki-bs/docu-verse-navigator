
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircuitNavigation } from "@/components/navigation/CircuitNavigation";
import { useQuery } from "@tanstack/react-query";
import documentService from "@/services/documentService";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch recent documents
  const { data: recentDocuments } = useQuery({
    queryKey: ["recent-documents"],
    queryFn: () => documentService.getRecentDocuments(5),
    enabled: !!user,
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      
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
