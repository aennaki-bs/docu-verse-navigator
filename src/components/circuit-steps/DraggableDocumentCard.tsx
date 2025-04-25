import { ReactNode } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DocumentCircuitHistory } from '@/models/documentCircuit';
import { CircuitStepCard } from './CircuitStepCard';

interface DraggableDocumentCardProps {
  detail: any;
  currentStepId: number | null;
  historyForStep: DocumentCircuitHistory[];
  isSimpleUser: boolean;
  onMoveClick: () => void;
  onProcessClick: () => void;
  onDeleteStep: () => void;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  children?: ReactNode;
}

export const DraggableDocumentCard = ({
  detail,
  currentStepId,
  historyForStep,
  isSimpleUser,
  onMoveClick,
  onProcessClick,
  onDeleteStep,
  index,
  moveCard,
  children
}: DraggableDocumentCardProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'STEP',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'STEP',
    hover: (item: { index: number }) => {
      if (item.index === index) {
        return;
      }
      moveCard(item.index, index);
      item.index = index;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="mb-4"
    >
      <CircuitStepCard
        detail={detail}
        currentStepId={currentStepId}
        historyForStep={historyForStep}
        isSimpleUser={isSimpleUser}
        onMoveClick={onMoveClick}
        onProcessClick={onProcessClick}
        onDeleteStep={onDeleteStep}
        isDraggedOver={isOver}
      >
        {children}
      </CircuitStepCard>
    </div>
  );
}; 