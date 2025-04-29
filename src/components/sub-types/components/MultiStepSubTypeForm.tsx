import { useSubTypeForm } from "./SubTypeFormProvider";
import { SubTypeFormProgress } from "./SubTypeFormProgress";
import { SubTypeBasicInfo } from "./SubTypeBasicInfo";
import { SubTypeDates } from "../components/SubTypeDates";
import { SubTypeReview } from "../components/SubTypeReview";
import { SubTypeFormActions } from "./SubTypeFormActions";
import { AnimatePresence, motion } from "framer-motion";

interface MultiStepSubTypeFormProps {
  onCancel: () => void;
}

export const MultiStepSubTypeForm = ({
  onCancel,
}: MultiStepSubTypeFormProps) => {
  const { currentStep } = useSubTypeForm();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SubTypeBasicInfo />;
      case 2:
        return <SubTypeDates />;
      case 3:
        return <SubTypeReview />;
      default:
        return <SubTypeBasicInfo />;
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col h-[450px] max-h-[80vh]">
      <div className="flex-shrink-0">
        <SubTypeFormProgress />
      </div>

      <div
        className="flex-grow overflow-auto mb-1 px-1"
        style={{ minHeight: "250px", maxHeight: "320px" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex-shrink-0">
        <SubTypeFormActions onCancel={onCancel} />
      </div>
    </div>
  );
};
