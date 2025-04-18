
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const ReviewStep = () => {
  const { getValues } = useFormContext();
  const formValues = getValues();

  return (
    <div className="space-y-3">
      <Card className="border border-blue-900/30 bg-gradient-to-b from-[#0a1033] to-[#0d1541] shadow-md overflow-hidden rounded-lg">
        <CardContent className="p-3">
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-medium text-blue-400 mb-1.5 flex items-center">
                <Info className="h-3 w-3 mr-1 text-blue-500" /> 
                Review Document Type Information
              </h3>
              
              <div className="rounded-lg bg-[#0d1541]/70 p-2 border border-blue-900/30 space-y-2">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-blue-300">Type Name</div>
                  <div className="text-white text-xs bg-[#131d5a]/70 p-1.5 rounded-md border border-blue-900/20">
                    {formValues.typeName}
                  </div>
                </div>

                {formValues.typeAlias && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-blue-300">Type Alias</div>
                    <div className="text-white text-xs bg-[#131d5a]/70 p-1.5 rounded-md border border-blue-900/20">
                      {formValues.typeAlias}
                    </div>
                  </div>
                )}
                
                <div className="space-y-1">
                  <div className="text-xs font-medium text-blue-300">Description</div>
                  <div className="text-gray-300 text-xs whitespace-pre-wrap bg-[#131d5a]/70 p-1.5 rounded-md border border-blue-900/20 min-h-[40px]">
                    {formValues.typeAttr || 'No description provided'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 rounded-lg p-2 border border-blue-500/30 flex items-start">
              <CheckCircle className="h-3 w-3 text-blue-400 mt-0.5 mr-1 flex-shrink-0" />
              <p className="text-xs text-blue-300">
                Please review the information above before creating this document type.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
