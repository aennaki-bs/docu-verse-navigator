import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/models/auth";
import { useQuery } from "@tanstack/react-query";
import dashboardService from "@/services/dashboardService";
import { Users, FileCheck, GitBranch } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ActivityScoreCardProps {
  user: User | null;
}

export function ActivityScoreCard({ user }: ActivityScoreCardProps) {
  const { data: activityScore } = useQuery({
    queryKey: ["activity-score"],
    queryFn: () => dashboardService.getActivityScore(),
    enabled: !!user,
  });

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-blue-400";
    if (score >= 4) return "text-yellow-400";
    return "text-red-400";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="bg-[#0f1642] border-blue-900/30">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-white">Activity Score</h3>
              <p className="text-xs text-blue-300/80">{user?.lastName}'s Team</p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${activityScore ? getScoreColor(activityScore.score) : 'text-gray-400'}`}>
                {activityScore ? activityScore.score.toFixed(1) : '-'}/10
              </p>
              <p className="text-xs text-blue-300/80">Overall Score</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* User Engagement */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-300">User Engagement</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {activityScore ? Math.round(activityScore.userEngagement) : 0}%
                </span>
              </div>
              <Progress 
                value={activityScore?.userEngagement || 0} 
                className="h-1.5 bg-blue-950"
              >
                <div className={`h-full ${getProgressColor(activityScore?.userEngagement || 0)}`} />
              </Progress>
              <p className="text-xs text-blue-300/80">
                {activityScore?.activeUsers || 0} active out of {activityScore?.totalUsers || 0} users
              </p>
            </div>

            {/* Processing Efficiency */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-blue-300">Processing Efficiency</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {activityScore ? Math.round(activityScore.processingEfficiency) : 0}%
                </span>
              </div>
              <Progress 
                value={activityScore?.processingEfficiency || 0} 
                className="h-1.5 bg-blue-950"
              >
                <div className={`h-full ${getProgressColor(activityScore?.processingEfficiency || 0)}`} />
              </Progress>
              <p className="text-xs text-blue-300/80">
                {activityScore?.documentsProcessed || 0} processed out of {activityScore?.totalDocuments || 0} documents
              </p>
            </div>

            {/* Workflow Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-blue-300">Workflow Progress</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {activityScore ? Math.round(activityScore.workflowProgress) : 0}%
                </span>
              </div>
              <Progress 
                value={activityScore?.workflowProgress || 0} 
                className="h-1.5 bg-blue-950"
              >
                <div className={`h-full ${getProgressColor(activityScore?.workflowProgress || 0)}`} />
              </Progress>
              <p className="text-xs text-blue-300/80">
                {activityScore?.activeCircuits || 0} active out of {activityScore?.totalCircuits || 0} circuits
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
