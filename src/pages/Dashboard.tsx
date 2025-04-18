
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import documentService from "@/services/documentService";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { CompletionRateCard } from "@/components/dashboard/CompletionRateCard";
import { ActivityScoreCard } from "@/components/dashboard/ActivityScoreCard";
import { DocumentActivityChart } from "@/components/dashboard/DocumentActivityChart";
import { WeeklyStatsChart } from "@/components/dashboard/WeeklyStatsChart";
import { RecentDocumentsCard } from "@/components/dashboard/RecentDocumentsCard";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { sampleChartData, sampleBarData } from "@/components/dashboard/chartData";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: recentDocuments } = useQuery({
    queryKey: ["recent-documents"],
    queryFn: () => documentService.getRecentDocuments(5),
    enabled: !!user,
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-sm text-blue-400/80">
        <span>Home</span>
        <span>/</span>
        <span className="text-blue-100">Dashboard</span>
      </div>
      
      {/* Stats cards row */}
      <DashboardStats documentsCount={recentDocuments?.length || 0} />
      
      {/* Cards row with welcome, completion rate and activity score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WelcomeCard user={user} />
        <CompletionRateCard />
        <ActivityScoreCard user={user} />
      </div>
      
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DocumentActivityChart data={sampleChartData} />
        <WeeklyStatsChart data={sampleBarData} />
      </div>
      
      {/* Recent documents section */}
      {recentDocuments && recentDocuments.length > 0 && (
        <RecentDocumentsCard documents={recentDocuments} />
      )}
    </div>
  );
}
