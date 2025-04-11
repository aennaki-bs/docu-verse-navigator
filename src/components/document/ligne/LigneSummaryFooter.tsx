
import { DollarSign } from 'lucide-react';
import { Ligne } from '@/models/document';

interface LigneSummaryFooterProps {
  lignes: Ligne[];
}

const LigneSummaryFooter = ({ lignes }: LigneSummaryFooterProps) => {
  const getTotalPrice = () => {
    return lignes.reduce((total, ligne) => total + ligne.prix, 0).toFixed(2);
  };

  return (
    <div className="bg-gradient-to-r from-gray-900/90 to-blue-900/80 p-4 border-t border-white/10 flex justify-between items-center sticky bottom-0 shadow-lg">
      <div className="text-blue-300">
        Total Lines: <span className="font-medium text-white">{lignes.length}</span>
      </div>
      <div className="text-lg font-medium flex items-center">
        Total: <span className="text-green-400 ml-2 flex items-center">
          <DollarSign className="h-4 w-4 mr-0.5" />
          {getTotalPrice()}
        </span>
      </div>
    </div>
  );
};

export default LigneSummaryFooter;
