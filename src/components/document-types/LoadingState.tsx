import { Card, CardContent } from '@/components/ui/card';
import { useSettings } from '@/context/SettingsContext';

const LoadingState = () => {
  const { theme } = useSettings();

  // Theme-specific styles
  const cardClass = theme === 'dark' 
    ? 'bg-[#0f1642] border-blue-900/30' 
    : 'bg-white border-gray-200';
  
  const primaryPulseClass = theme === 'dark' 
    ? 'bg-gray-700' 
    : 'bg-gray-200';
  
  const secondaryPulseClass = theme === 'dark' 
    ? 'bg-gray-800' 
    : 'bg-gray-100';

  return (
    <div className="flex-1 overflow-hidden px-3 md:px-6 py-3">
      <Card className={`${cardClass} shadow-xl h-full`}>
        <CardContent className="p-6">
          <div className="space-y-6 animate-pulse">
            <div className={`h-10 ${primaryPulseClass} rounded`}></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className={`h-16 ${secondaryPulseClass} rounded`}></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingState;
