
import { 
  FileText, 
  GitBranch, 
  CircleCheck, 
  Users
} from "lucide-react";
import { StatsCard } from "./StatsCard";

interface DashboardStatsProps {
  documentsCount: number;
}

export function DashboardStats({ documentsCount }: DashboardStatsProps) {
  const stats = [
    { 
      id: 1, 
      name: "Total Documents", 
      value: documentsCount || 0, 
      change: "+5%",
      icon: FileText,
      color: "bg-blue-600",
      iconBg: "bg-blue-500/20 text-blue-500",
      link: "/documents"
    },
    { 
      id: 2, 
      name: "Active Circuits", 
      value: "5", 
      change: "+12%",
      icon: GitBranch,
      color: "bg-purple-600",
      iconBg: "bg-purple-500/20 text-purple-500",
      link: "/circuits"
    },
    { 
      id: 3, 
      name: "Pending Approvals", 
      value: "3", 
      change: "-8%",
      icon: CircleCheck,
      color: "bg-green-600",
      iconBg: "bg-green-500/20 text-green-500",
      link: "/pending-approvals"
    },
    { 
      id: 4, 
      name: "Team Members", 
      value: "12", 
      change: "+16%",
      icon: Users,
      color: "bg-amber-600",
      iconBg: "bg-amber-500/20 text-amber-500",
      link: "/admin"
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.id} {...stat} />
      ))}
    </div>
  );
}
