import { Loader2 } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

const DocumentLoadingState = () => {
  const { theme } = useSettings();
  const isLightMode = theme === "light";

  return (
    <div
      className={`rounded-lg ${
        isLightMode
          ? "bg-white border border-gray-300 shadow-md"
          : "bg-blue-950/20 border border-blue-900/30"
      } p-6 flex flex-col items-center justify-center min-h-[300px] transition-colors duration-300`}
    >
      <Loader2
        className={`h-12 w-12 ${
          isLightMode ? "text-blue-700" : "text-blue-400"
        } animate-spin mb-4`}
      />
      <p
        className={`text-lg font-medium ${
          isLightMode ? "text-gray-900" : "text-blue-200"
        }`}
      >
        Loading document...
      </p>
      <p
        className={`text-sm ${
          isLightMode ? "text-gray-700" : "text-blue-300/70"
        } mt-1`}
      >
        Please wait while we retrieve your document data
      </p>

      <div className={`grid grid-cols-3 gap-4 w-full max-w-md mt-8`}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`h-3 ${
              isLightMode ? "bg-gray-300" : "bg-blue-800/30"
            } rounded animate-pulse`}
          ></div>
        ))}
        {[...Array(2)].map((_, i) => (
          <div
            key={i + 3}
            className={`h-3 ${
              isLightMode ? "bg-gray-200" : "bg-blue-800/20"
            } rounded animate-pulse col-span-${i === 0 ? "2" : "1"}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default DocumentLoadingState;
