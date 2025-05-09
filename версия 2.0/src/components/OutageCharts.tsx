
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { UtilityOutage } from '../types/utility';
import { utilityTypeLabels } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OutageChartsProps {
  outages: UtilityOutage[];
}

const OutageCharts: React.FC<OutageChartsProps> = ({ outages }) => {
  // Подготовка данных для диаграммы по типам
  const typeData = Object.entries(utilityTypeLabels).map(([type, label]) => {
    const count = outages.filter(o => o.type === type && (o.status === 'active' || o.status === 'scheduled')).length;
    return {
      name: label,
      value: count,
      type: type
    };
  }).filter(item => item.value > 0);
  
  // Подготовка данных для диаграммы по статусам
  const statusData = [
    { name: 'Активные', value: outages.filter(o => o.status === 'active').length, color: '#EF4444' },
    { name: 'Запланированные', value: outages.filter(o => o.status === 'scheduled').length, color: '#F59E0B' },
    { name: 'Завершённые', value: outages.filter(o => o.status === 'resolved').length, color: '#10B981' }
  ].filter(item => item.value > 0);
  
  // Цвета для диаграммы типов отключений
  const UTILITY_COLORS = {
    water: '#1A73E8',
    electricity: '#FBBC05',
    heating: '#EA4335',
    gas: '#34A853',
    internet: '#9C27B0'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="neo-card bg-blue-900/5">
        <CardHeader>
          <CardTitle className="text-lg gradient-text">Отключения по типам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={typeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70}
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  formatter={(value) => [`${value} отключений`, 'Количество']}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(59, 130, 246, 0.5)', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="value" name="Количество">
                  {typeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={UTILITY_COLORS[entry.type as keyof typeof UTILITY_COLORS] || '#8884d8'} 
                      opacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="neo-card bg-blue-900/5">
        <CardHeader>
          <CardTitle className="text-lg gradient-text">Отключения по статусам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} отключений`, 'Количество']}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(59, 130, 246, 0.5)', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend 
                  formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutageCharts;
