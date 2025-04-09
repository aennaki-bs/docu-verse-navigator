
import { Card, CardContent } from "@/components/ui/card";

export function CompletionRateCard() {
  return (
    <Card className="bg-[#0f1642] border-blue-900/30">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-white">Completion Rate</h3>
            <p className="text-xs text-blue-300/80">From all documents</p>
          </div>
          
          <div className="flex justify-center py-4">
            <div className="relative h-32 w-32 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#1e3a8a" 
                  strokeWidth="8" 
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="8" 
                  strokeDasharray="283"
                  strokeDashoffset="62" // ~78% completion (283 * 0.22)
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-white">78%</span>
                <span className="text-xs text-blue-300">(Based on tasks)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
