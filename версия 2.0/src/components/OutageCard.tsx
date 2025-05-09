import React from 'react';
import { UtilityOutage } from '../types/utility';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { utilityTypeLabels, utilityTypeIcons } from '../data/mockData';

interface OutageCardProps {
  outage: UtilityOutage;
  isSelected: boolean;
  onClick: () => void;
}

const OutageCard: React.FC<OutageCardProps> = ({ outage, isSelected, onClick }) => {
  // Форматирование даты
  const formatDate = (date: Date) => {
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Определение цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-900/30 text-red-400 border-red-800';
      case 'scheduled': return 'bg-amber-900/30 text-amber-400 border-amber-800';
      case 'resolved': return 'bg-green-900/30 text-green-400 border-green-800';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-800';
    }
  };

  // Форматирование текста статуса
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активно';
      case 'scheduled': return 'Запланировано';
      case 'resolved': return 'Завершено';
      default: return status;
    }
  };

  const getUtilityColor = (type: string) => {
    switch (type) {
      case 'water': return 'border-utility-water shadow-[0_0_10px_rgba(26,115,232,0.2)]';
      case 'electricity': return 'border-utility-electricity shadow-[0_0_10px_rgba(251,188,5,0.2)]';
      case 'heating': return 'border-utility-heating shadow-[0_0_10px_rgba(234,67,53,0.2)]';
      case 'gas': return 'border-utility-gas shadow-[0_0_10px_rgba(52,168,83,0.2)]';
      case 'internet': return 'border-utility-internet shadow-[0_0_10px_rgba(156,39,176,0.2)]';
      default: return 'border-gray-700';
    }
  };

  return (
    <Card 
      className={`
        transition-all duration-300 cursor-pointer border-l-4 ${getUtilityColor(outage.type)}
        ${isSelected ? 'ring-2 ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]'}
        bg-card/60 backdrop-blur-sm
      `}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{utilityTypeIcons[outage.type]}</span>
            <h3 className="font-medium text-blue-100">{utilityTypeLabels[outage.type]}</h3>
          </div>
          <Badge className={getStatusColor(outage.status)}>
            {getStatusText(outage.status)}
          </Badge>
        </div>
        
        <p className="text-sm mb-1 font-medium text-blue-50">{outage.address}</p>
        <p className="text-xs text-gray-400 mb-3">{outage.description}</p>
        
        <div className="flex justify-between text-xs text-gray-500">
          <div>
            <div>Начало: <span className="text-gray-400">{formatDate(outage.startTime)}</span></div>
            <div>{outage.endTime ? `Окончание: ${formatDate(outage.endTime)}` : 'Время окончания неизвестно'}</div>
          </div>
          <div className="text-right">
            <div>Район: <span className="text-gray-400">{outage.district}</span></div>
            <div>Домов: <span className="text-gray-400">{outage.affectedHouses || 'н/д'}</span></div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-3 px-6 text-xs text-gray-600">
        Источник: <span className="text-gray-500">{outage.source}</span>
      </CardFooter>
    </Card>
  );
};

export default OutageCard;
