import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/context/SettingsContext";

interface DocumentStatusBadgeProps {
  status: number;
}

const DocumentStatusBadge = ({ status }: DocumentStatusBadgeProps) => {
  const { theme } = useSettings();
  const isLightMode = theme === "light";

  switch (status) {
    case 0:
      return (
        <Badge
          className={
            isLightMode
              ? "bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-400 font-medium px-3 py-1"
              : "bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border-amber-500/30"
          }
        >
          Draft
        </Badge>
      );
    case 1:
      return (
        <Badge
          className={
            isLightMode
              ? "bg-green-100 text-green-900 hover:bg-green-200 border border-green-400 font-medium px-3 py-1"
              : "bg-green-500/20 text-green-200 hover:bg-green-500/30 border-green-500/30"
          }
        >
          Active
        </Badge>
      );
    case 2:
      return (
        <Badge
          className={
            isLightMode
              ? "bg-purple-100 text-purple-900 hover:bg-purple-200 border border-purple-400 font-medium px-3 py-1"
              : "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 border-purple-500/30"
          }
        >
          Archived
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className={
            isLightMode ? "text-gray-800 border-gray-400 font-medium" : ""
          }
        >
          Unknown
        </Badge>
      );
  }
};

export default DocumentStatusBadge;
