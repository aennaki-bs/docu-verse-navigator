
import { Card, CardContent } from "@/components/ui/card";

interface ReviewStepProps {
  typeName: string;
  typeAttr?: string;
  typeAlias?: string;
  isEditMode?: boolean;
}

export const ReviewStep = ({ 
  typeName, 
  typeAttr, 
  typeAlias,
  isEditMode = false
}: ReviewStepProps) => {
  return (
    <div className="space-y-4">
      <Card className="bg-[#0A0E2E]/60 border-blue-900/40">
        <CardContent className="p-4 space-y-3">
          <div>
            <h4 className="text-xs font-medium text-blue-100 mb-1">Type Name</h4>
            <p className="text-sm text-white">{typeName}</p>
          </div>
          
          {typeAttr && (
            <div>
              <h4 className="text-xs font-medium text-blue-100 mb-1">Description</h4>
              <p className="text-sm text-white break-words">{typeAttr}</p>
            </div>
          )}
          
          {typeAlias && (
            <div>
              <h4 className="text-xs font-medium text-blue-100 mb-1">Type Code</h4>
              <p className="text-sm text-white">{typeAlias}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="rounded-md bg-blue-900/20 p-3 border border-blue-500/30">
        <p className="text-xs text-blue-200">
          {isEditMode 
            ? "Please review your changes before updating this document type."
            : "Please review the information before creating this document type."}
        </p>
      </div>
    </div>
  );
};
