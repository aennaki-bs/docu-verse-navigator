
import { AlertCircle, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AddToCircuitButton from '@/components/circuits/AddToCircuitButton';

interface NoCircuitAssignedCardProps {
  documentId: string;
  navigateToDocument: () => void;
}

export const NoCircuitAssignedCard = ({ documentId, navigateToDocument }: NoCircuitAssignedCardProps) => {
  return (
    <Card className="bg-[#0a1033] border border-blue-900/30 shadow-lg">
      <CardContent className="p-8 text-center flex flex-col items-center">
        <AlertCircle className="w-16 h-16 text-blue-400/50 mb-4" />
        <h2 className="text-xl font-medium text-white mb-2">
          This document is not assigned to any circuit
        </h2>
        <p className="text-gray-400 mb-6">
          Assign this document to a circuit to track its progress through a workflow.
        </p>
        <AddToCircuitButton 
          documentId={Number(documentId)}
          documentTitle="Document"
          onSuccess={() => window.location.reload()}
          className="mt-2"
        />
      </CardContent>
    </Card>
  );
};
