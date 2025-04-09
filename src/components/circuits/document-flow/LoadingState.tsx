
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export const LoadingState = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {[1, 2, 3].map(i => (
        <Card key={i} className="bg-[#0a1033] border border-blue-900/30 animate-pulse shadow-lg">
          <CardHeader className="pb-3">
            <div className="h-6 bg-blue-900/30 rounded w-3/4"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-20 bg-blue-900/30 rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
