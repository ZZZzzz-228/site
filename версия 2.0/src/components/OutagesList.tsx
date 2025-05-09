
import React from 'react';
import { UtilityOutage } from '../types/utility';
import OutageCard from './OutageCard';

interface OutagesListProps {
  outages: UtilityOutage[];
  selectedOutage: string | null;
  onOutageSelect: (id: string) => void;
}

const OutagesList: React.FC<OutagesListProps> = ({ outages, selectedOutage, onOutageSelect }) => {
  if (outages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg p-6 text-center">
        <div>
          <div className="text-4xl mb-2">🔍</div>
          <h3 className="text-lg font-medium text-gray-700">Отключений не найдено</h3>
          <p className="text-sm text-gray-500">Попробуйте изменить параметры поиска или фильтры</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto">
      {outages.map(outage => (
        <OutageCard
          key={outage.id}
          outage={outage}
          isSelected={outage.id === selectedOutage}
          onClick={() => onOutageSelect(outage.id)}
        />
      ))}
    </div>
  );
};

export default OutagesList;
