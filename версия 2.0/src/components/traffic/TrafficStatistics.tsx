
import React from 'react';
import { Card } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { time: '06:00', load: 3, accidents: 1 },
  { time: '08:00', load: 8, accidents: 3 },
  { time: '10:00', load: 5, accidents: 2 },
  { time: '12:00', load: 4, accidents: 1 },
  { time: '14:00', load: 6, accidents: 2 },
  { time: '16:00', load: 9, accidents: 4 },
  { time: '18:00', load: 7, accidents: 3 },
  { time: '20:00', load: 4, accidents: 1 },
  { time: '22:00', load: 2, accidents: 0 },
];

const TrafficStatistics = () => {
  return (
    <div className="space-y-6">
      {/* Daily Traffic Load Chart */}
      <Card className="p-6 neo-card">
        <h3 className="text-lg font-medium text-blue-100 mb-4">Дневная загруженность дорог</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="time"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8' }}
              />
              <YAxis 
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8' }}
                label={{ 
                  value: 'Баллы', 
                  angle: -90, 
                  position: 'insideLeft',
                  fill: '#94a3b8'
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar 
                dataKey="load" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                name="Загруженность"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Traffic Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 neo-card">
          <h4 className="text-sm font-medium text-gray-400">Средняя загруженность</h4>
          <div className="text-2xl font-bold text-blue-400 mt-2">5.3 балла</div>
          <p className="text-xs text-gray-500 mt-1">За последние 24 часа</p>
        </Card>
        
        <Card className="p-4 neo-card">
          <h4 className="text-sm font-medium text-gray-400">Пиковые часы</h4>
          <div className="text-2xl font-bold text-amber-400 mt-2">16:00 - 18:00</div>
          <p className="text-xs text-gray-500 mt-1">Максимальная загрузка</p>
        </Card>
        
        <Card className="p-4 neo-card">
          <h4 className="text-sm font-medium text-gray-400">Всего ДТП сегодня</h4>
          <div className="text-2xl font-bold text-red-400 mt-2">17</div>
          <p className="text-xs text-gray-500 mt-1">На основных магистралях</p>
        </Card>
      </div>
    </div>
  );
};

export default TrafficStatistics;
