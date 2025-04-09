
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/models/auth";

interface ActivityScoreCardProps {
  user: User | null;
}

export function ActivityScoreCard({ user }: ActivityScoreCardProps) {
  return (
    <Card className="bg-[#0f1642] border-blue-900/30">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-white">Activity Score</h3>
            <p className="text-xs text-blue-300/80">{user?.lastName}'s Team</p>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-300">Active Users</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
            
            <div className="relative h-16 w-16 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#0f172a" 
                  strokeWidth="8" 
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="8" 
                  strokeDasharray="283"
                  strokeDashoffset="57" // ~80% activity (283 * 0.2)
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <span className="absolute text-xl font-bold text-white">8.7</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
