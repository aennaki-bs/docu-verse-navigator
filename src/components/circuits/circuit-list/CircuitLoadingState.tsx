import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCw } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface CircuitLoadingStateProps {
  message?: string;
}

export function CircuitLoadingState({ message = "Loading circuits..." }: CircuitLoadingStateProps) {
  const { theme } = useSettings();
  
  return (
    <Card 
      className={`w-full shadow-md ${
        theme === "dark"
          ? "bg-[#111633]/70 border-blue-900/30"
          : "bg-white border-blue-200/60"
      }`}
    >
      <CardHeader
        className={`flex flex-row items-center justify-between ${
          theme === "dark"
            ? "border-b border-blue-900/30 bg-blue-900/20"
            : "border-b border-blue-100 bg-blue-50/50"
        }`}
      >
        <CardTitle
          className={`text-xl ${
            theme === "dark" ? "text-blue-100" : "text-blue-700"
          }`}
        >
          Circuits
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="flex flex-col justify-center items-center h-24 space-y-4">
          <RotateCw className={`h-8 w-8 animate-spin ${
            theme === "dark" ? "text-blue-400" : "text-blue-600"
          }`} />
          <p className={`text-sm ${
            theme === "dark" ? "text-blue-300" : "text-blue-600"
          }`}>
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
