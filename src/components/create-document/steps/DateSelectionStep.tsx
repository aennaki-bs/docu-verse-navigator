
import { Label } from "@/components/ui/label";
import { DatePickerInput } from "@/components/document/DatePickerInput";

interface DateSelectionStepProps {
  docDate: string;
  dateError: string | null;
  onDateChange: (date: Date | undefined) => void;
}

export const DateSelectionStep = ({ docDate, dateError, onDateChange }: DateSelectionStepProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="docDate" className="text-sm font-medium text-gray-200">Document Date*</Label>
      <DatePickerInput 
        date={new Date(docDate)} 
        onDateChange={onDateChange}
        error={!!dateError}
      />
      {dateError && (
        <p className="text-sm text-red-500">{dateError}</p>
      )}
    </div>
  );
};
