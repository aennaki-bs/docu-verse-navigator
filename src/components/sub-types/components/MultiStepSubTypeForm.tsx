import { useSubTypeForm } from "./SubTypeFormProvider";
import { SubTypeFormProgress } from "./SubTypeFormProgress";
import { SubTypeBasicInfo } from "./SubTypeBasicInfo";
import { SubTypeDocType } from "./SubTypeDocType";
import { SubTypeDatesStatus } from "./SubTypeDatesStatus";
import { SubTypeFormActions } from "./SubTypeFormActions";

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
        return <SubTypeDocType />;
      case 3:
        return <SubTypeDatesStatus />;
      default:
        return <SubTypeBasicInfo />;
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col">
      <SubTypeFormProgress />

      <div className="mb-6 min-h-[260px] flex items-start justify-center">
        <div className="w-full animation-fade-in">{renderStepContent()}</div>
      </div>

      <SubTypeFormActions onCancel={onCancel} />
    </div>
  );
};
