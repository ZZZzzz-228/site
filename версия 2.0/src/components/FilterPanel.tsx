
import React from 'react';
import { Button } from "@/components/ui/button";
import { District, UtilityType } from '../types/utility';
import { utilityTypeLabels } from '../data/mockData';

interface FilterPanelProps {
  selectedTypes: UtilityType[];
  onTypeChange: (type: UtilityType) => void;
  districts: District[];
  onDistrictChange: (id: string) => void;
  showActive: boolean;
  showScheduled: boolean;
  showResolved: boolean;
  onStatusChange: (status: 'active' | 'scheduled' | 'resolved') => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedTypes,
  onTypeChange,
  districts,
  onDistrictChange,
  showActive,
  showScheduled,
  showResolved,
  onStatusChange
}) => {
  return (
    <div className="neo-card rounded-2xl p-5 border border-white/5">
      <h2 className="font-semibold text-lg mb-4 gradient-text">Фильтры</h2>
      
      <div className="mb-5">
        <h3 className="text-sm font-medium text-blue-300 mb-3">Тип услуги:</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(utilityTypeLabels) as UtilityType[]).map(type => (
            <Button
              key={type}
              variant={selectedTypes.includes(type) ? "default" : "outline"}
              className={`
                text-xs px-3 py-1 h-auto rounded-full
                ${selectedTypes.includes(type) ? 
                  `bg-utility-${type}/70 hover:bg-utility-${type}/90 border border-utility-${type}` : 
                  'bg-muted/50 border border-white/10'}
              `}
              onClick={() => onTypeChange(type)}
            >
              {type === 'water' && '💧'} 
              {type === 'electricity' && '⚡'} 
              {type === 'heating' && '🔥'} 
              {type === 'gas' && '🔵'} 
              {type === 'internet' && '📶'} 
              {utilityTypeLabels[type]}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-sm font-medium text-blue-300 mb-3">Статус:</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={showActive ? "default" : "outline"}
            size="sm"
            className={showActive ? 
              "bg-red-900/70 hover:bg-red-900/90 text-red-200 border border-red-800" : 
              "bg-muted/50 border border-white/10"}
            onClick={() => onStatusChange('active')}
          >
            Активные
          </Button>
          <Button
            variant={showScheduled ? "default" : "outline"}
            size="sm"
            className={showScheduled ? 
              "bg-amber-900/70 hover:bg-amber-900/90 text-amber-200 border border-amber-800" : 
              "bg-muted/50 border border-white/10"}
            onClick={() => onStatusChange('scheduled')}
          >
            Запланированные
          </Button>
          <Button
            variant={showResolved ? "default" : "outline"}
            size="sm"
            className={showResolved ? 
              "bg-green-900/70 hover:bg-green-900/90 text-green-200 border border-green-800" : 
              "bg-muted/50 border border-white/10"}
            onClick={() => onStatusChange('resolved')}
          >
            Завершенные
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-blue-300 mb-3">Район:</h3>
        <div className="flex flex-wrap gap-2">
          {districts.map(district => (
            <Button
              key={district.id}
              variant={district.active ? "default" : "outline"}
              size="sm"
              className={district.active ? 
                "bg-blue-900/70 hover:bg-blue-900/90 text-blue-200 border border-blue-800" : 
                "bg-muted/50 border border-white/10"}
              onClick={() => onDistrictChange(district.id)}
            >
              {district.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
