
import React from 'react';
import { UtilityOutage } from '../types/utility';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { utilityTypeLabels } from '../data/mockData';

interface StatisticsPanelProps {
  outages: UtilityOutage[];
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ outages }) => {
  // Расчет статистики
  const activeOutages = outages.filter(o => o.status === 'active').length;
  const scheduledOutages = outages.filter(o => o.status === 'scheduled').length;
  const resolvedOutages = outages.filter(o => o.status === 'resolved').length;
  
  // Расчет статистики по типам
  const outagesByType: Record<string, number> = {};
  outages.forEach(outage => {
    if (outage.status === 'active' || outage.status === 'scheduled') {
      outagesByType[outage.type] = (outagesByType[outage.type] || 0) + 1;
    }
  });

  // Расчет затронутых домов
  const affectedHouses = outages
    .filter(o => o.status === 'active' && o.affectedHouses)
    .reduce((total, current) => total + (current.affectedHouses || 0), 0);

  const getUtilityCardStyle = (type: string) => {
    switch (type) {
      case 'water': return 'border-l-4 border-utility-water bg-utility-water/5';
      case 'electricity': return 'border-l-4 border-utility-electricity bg-utility-electricity/5';
      case 'heating': return 'border-l-4 border-utility-heating bg-utility-heating/5';
      case 'gas': return 'border-l-4 border-utility-gas bg-utility-gas/5';
      case 'internet': return 'border-l-4 border-utility-internet bg-utility-internet/5';
      default: return 'border-l-4 border-blue-500 bg-blue-500/5';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card className="neo-card bg-red-900/10 border-l-4 border-red-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-red-300">Активных отключений</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-400">{activeOutages}</div>
        </CardContent>
      </Card>
      
      <Card className="neo-card bg-amber-900/10 border-l-4 border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-amber-300">Запланировано</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-400">{scheduledOutages}</div>
        </CardContent>
      </Card>
      
      <Card className="neo-card bg-blue-900/10 border-l-4 border-blue-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-blue-300">Затронуто домов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-400">{affectedHouses}</div>
        </CardContent>
      </Card>
      
      <Card className="neo-card bg-green-900/10 border-l-4 border-green-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-green-300">Завершено за сутки</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-400">{resolvedOutages}</div>
        </CardContent>
      </Card>

      {/* Статистика по типам услуг */}
      {Object.entries(outagesByType).map(([type, count]) => (
        <Card key={type} className={`neo-card sm:col-span-1 ${getUtilityCardStyle(type)}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
              <span className="text-base">
                {type === 'water' && '💧'}
                {type === 'electricity' && '⚡'}
                {type === 'heating' && '🔥'}
                {type === 'gas' && '🔵'}
                {type === 'internet' && '📶'}
              </span>
              {utilityTypeLabels[type]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-300">{count}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatisticsPanel;
