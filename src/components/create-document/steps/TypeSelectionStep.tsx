
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DocumentType } from "@/models/document";
import { SubType } from "@/models/subType";

interface TypeSelectionStepProps {
  documentTypes: DocumentType[];
  subTypes: SubType[];
  selectedTypeId: number | null;
  selectedSubTypeId: number | null;
  documentAlias: string;
  onTypeChange: (value: string) => void;
  onSubTypeChange: (value: string) => void;
  onAliasChange: (value: string) => void;
  aliasError?: string;
  typeError?: string;
  subTypeError?: string;
}

export const TypeSelectionStep = ({
  documentTypes,
  subTypes,
  selectedTypeId,
  selectedSubTypeId,
  documentAlias,
  onTypeChange,
  onSubTypeChange,
  onAliasChange,
  aliasError,
  typeError,
  subTypeError
}: TypeSelectionStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="documentType" className="text-sm font-medium text-gray-200">Document Type*</Label>
        <Select 
          value={selectedTypeId?.toString() || ''} 
          onValueChange={onTypeChange}
        >
          <SelectTrigger 
            className={`h-12 text-base bg-gray-900 border-gray-800 text-white ${typeError ? 'border-red-500' : ''}`}
          >
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-800">
            {documentTypes.map(type => (
              <SelectItem key={type.id} value={type.id!.toString()} className="text-gray-200">
                {type.typeName} ({type.typeKey})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {typeError && <p className="text-sm text-red-500">{typeError}</p>}
      </div>

      {selectedTypeId && subTypes.length > 0 && (
        <div className="space-y-3">
          <Label htmlFor="subType" className="text-sm font-medium text-gray-200">Subtype*</Label>
          <Select 
            value={selectedSubTypeId?.toString() || ''} 
            onValueChange={onSubTypeChange}
          >
            <SelectTrigger 
              className={`h-12 text-base bg-gray-900 border-gray-800 text-white ${subTypeError ? 'border-red-500' : ''}`}
            >
              <SelectValue placeholder="Select subtype" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800">
              {subTypes.map(subType => (
                <SelectItem key={subType.id} value={subType.id.toString()} className="text-gray-200">
                  {subType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {subTypeError && <p className="text-sm text-red-500">{subTypeError}</p>}
          {selectedSubTypeId && (
            <p className="text-sm text-blue-400">
              Valid from {new Date(subTypes.find(st => st.id === selectedSubTypeId)?.startDate!).toLocaleDateString()} 
              to {new Date(subTypes.find(st => st.id === selectedSubTypeId)?.endDate!).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
