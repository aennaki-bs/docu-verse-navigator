
import PendingDocumentsList from '@/components/circuits/PendingDocumentsList';

export default function PendingApprovalsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Pending Approvals</h1>
        <p className="text-gray-500">
          Documents waiting for your approval or action
        </p>
      </div>
      
      <PendingDocumentsList />
    </div>
  );
}
