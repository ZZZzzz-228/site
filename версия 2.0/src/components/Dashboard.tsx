
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from './Header';
import FilterPanel from './FilterPanel';
import MapView from './MapView';
import OutagesList from './OutagesList';
import StatisticsPanel from './StatisticsPanel';
import OutageCharts from './OutageCharts';
import UsefulLinks from './UsefulLinks';
import { UtilityOutage, UtilityType } from '../types/utility';
import { mockOutages, districts as mockDistricts } from '../data/mockData';
import { Card, CardContent } from "@/components/ui/card";

const Dashboard: React.FC = () => {
  const [selectedTypes, setSelectedTypes] = useState<UtilityType[]>([]);
  const [districts, setDistricts] = useState(mockDistricts);
  const [showActive, setShowActive] = useState(true);
  const [showScheduled, setShowScheduled] = useState(true);
  const [showResolved, setShowResolved] = useState(false);
  const [selectedOutage, setSelectedOutage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('outages');
  const [filteredOutages, setFilteredOutages] = useState<UtilityOutage[]>(mockOutages);

  useEffect(() => {
    let filtered = [...mockOutages];
    
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(outage => selectedTypes.includes(outage.type));
    }
    
    const activeDistricts = districts.filter(d => d.active).map(d => d.name);
    if (activeDistricts.length > 0 && activeDistricts.length < districts.length) {
      filtered = filtered.filter(outage => activeDistricts.includes(outage.district));
    }
    
    const statusFilters: string[] = [];
    if (showActive) statusFilters.push('active');
    if (showScheduled) statusFilters.push('scheduled');
    if (showResolved) statusFilters.push('resolved');
    
    filtered = filtered.filter(outage => statusFilters.includes(outage.status));
    
    filtered.sort((a, b) => {
      const statusOrder: Record<string, number> = { active: 0, scheduled: 1, resolved: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });
    
    setFilteredOutages(filtered);
  }, [selectedTypes, districts, showActive, showScheduled, showResolved]);

  const handleTypeChange = (type: UtilityType) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleDistrictChange = (id: string) => {
    setDistricts(prev => 
      prev.map(district => 
        district.id === id 
          ? { ...district, active: !district.active } 
          : district
      )
    );
  };

  const handleStatusChange = (status: 'active' | 'scheduled' | 'resolved') => {
    switch (status) {
      case 'active':
        setShowActive(prev => !prev);
        break;
      case 'scheduled':
        setShowScheduled(prev => !prev);
        break;
      case 'resolved':
        setShowResolved(prev => !prev);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background transition-all duration-300 grid-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-8">
        <Tabs 
          defaultValue="outages" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-6"
        >
          <div className="flex justify-center">
            <TabsList className="neo-card p-1 rounded-full">
              <TabsTrigger 
                value="outages" 
                className="px-6 py-2 rounded-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300"
              >
                Отключения
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="px-6 py-2 rounded-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300"
              >
                Аналитика
              </TabsTrigger>
              <TabsTrigger 
                value="about" 
                className="px-6 py-2 rounded-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300"
              >
                О проекте
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="outages" className="space-y-8 mt-6 animate-float">
            <div className="transform transition-all duration-500 hover:scale-[1.01]">
              <StatisticsPanel outages={mockOutages} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="transform transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <FilterPanel 
                    selectedTypes={selectedTypes}
                    onTypeChange={handleTypeChange}
                    districts={districts}
                    onDistrictChange={handleDistrictChange}
                    showActive={showActive}
                    showScheduled={showScheduled}
                    showResolved={showResolved}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="neo-card rounded-2xl p-6">
                  <Tabs defaultValue="list" className="w-full">
                    <div className="flex justify-between items-center mb-4">
                      <TabsList className="neo-card rounded-full p-1">
                        <TabsTrigger value="list" className="rounded-full">Список</TabsTrigger>
                        <TabsTrigger value="map" className="rounded-full">Карта</TabsTrigger>
                      </TabsList>
                      
                      <div className="text-sm text-blue-400 animate-pulse-soft">
                        Найдено отключений: <span className="text-white font-semibold">{filteredOutages.length}</span>
                      </div>
                    </div>
                    
                    <TabsContent value="list" className="mt-2">
                      <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-custom">
                        <OutagesList 
                          outages={filteredOutages} 
                          selectedOutage={selectedOutage}
                          onOutageSelect={setSelectedOutage}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="map" className="mt-2">
                      <div className="h-[600px] rounded-xl overflow-hidden">
                        <MapView 
                          outages={filteredOutages} 
                          selectedOutage={selectedOutage}
                          onOutageSelect={setSelectedOutage}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-8 mt-6 animate-float">
            <div className="transform transition-all duration-500 hover:scale-[1.01]">
              <StatisticsPanel outages={mockOutages} />
            </div>
            <div className="neo-card rounded-2xl p-6">
              <OutageCharts outages={mockOutages} />
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="space-y-8 mt-6 animate-float">
            <div className="neo-card rounded-2xl p-6">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-3xl font-bold gradient-text">О проекте "Город без сюрпризов"</h2>
                <p className="text-gray-400 text-lg">
                  Платформа "Город без сюрпризов" создана, чтобы объединить всю важную информацию о городской инфраструктуре Красноярска в одном месте. 
                  Больше не нужно искать информацию об отключениях на разных сайтах — вся информация собрана здесь.
                </p>
                <div className="py-4">
                  <h3 className="text-xl font-semibold mb-4 gradient-text">Наши возможности:</h3>
                  <ul className="text-left list-disc list-inside space-y-3 text-gray-400">
                    <li className="transition-all hover:translate-x-2 hover:text-blue-300 duration-300">Карта всех текущих отключений в городе</li>
                    <li className="transition-all hover:translate-x-2 hover:text-blue-300 duration-300">Фильтрация по типам услуг и районам</li>
                    <li className="transition-all hover:translate-x-2 hover:text-blue-300 duration-300">Уведомления о новых отключениях</li>
                    <li className="transition-all hover:translate-x-2 hover:text-blue-300 duration-300">Аналитика по городской инфраструктуре</li>
                    <li className="transition-all hover:translate-x-2 hover:text-blue-300 duration-300">Интеграция с Telegram для мгновенных уведомлений</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <UsefulLinks />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="neo-card py-8 mt-12 border-t border-white/5">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <div className="gradient-text mb-2">Красноярск Мониторинг</div>
          © 2025 Система контроля отключений коммунальных услуг
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
