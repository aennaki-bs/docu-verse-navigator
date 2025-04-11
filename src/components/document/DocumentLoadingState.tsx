
import { Loader2 } from "lucide-react";

export const DocumentLoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
      <p className="text-lg text-gray-500">Loading documents...</p>
    </div>
  );
};
