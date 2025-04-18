
import DocumentTypesHeader from '@/components/document-types/DocumentTypesHeader';

interface DocumentTypesHeaderSectionProps {
  viewMode: 'table' | 'grid';
  onViewModeChange: (value: 'table' | 'grid') => void;
  onNewTypeClick: () => void;
}

const DocumentTypesHeaderSection = ({
  viewMode,
  onViewModeChange,
  onNewTypeClick
}: DocumentTypesHeaderSectionProps) => {
  return (
    <DocumentTypesHeader 
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      onNewTypeClick={onNewTypeClick}
    />
  );
};

export default DocumentTypesHeaderSection;
