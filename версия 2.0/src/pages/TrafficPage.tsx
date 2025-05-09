import React, { useState } from 'react';
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TrafficMapView from "@/components/TrafficMapView";
import TrafficStatistics from "@/components/traffic/TrafficStatistics";
import TrafficFilters from "@/components/traffic/TrafficFilters";
import TrafficIncidentsList from "@/components/traffic/TrafficIncidentsList";
import TrafficInfoCard from "@/components/traffic/TrafficInfoCard";

const incidents = [
  { 
    id: 1, 
    type: "accident", 
    title: "ДТП на Взлетной", 
    location: "ул. Взлетная, 20", 
    coordinates: [56.022410, 92.893868] as [number, number],
    time: "15:30", 
    description: "Столкновение двух автомобилей, затруднено движение в сторону центра." 
  },
  { 
    id: 2, 
    type: "traffic", 
    title: "Пробка на Копылова", 
    location: "ул. Копылова", 
    coordinates: [56.016034, 92.859193] as [number, number],
    time: "16:45", 
    description: "Затор из-за высокого трафика, скорость движения 5-10 км/ч." 
  },
  { 
    id: 3, 
    type: "construction", 
    title: "Ремонт дороги", 
    location: "пр. Свободный", 
    coordinates: [55.995517, 92.797756] as [number, number],
    time: "14:00", 
    description: "Дорожные работы, перекрыта одна полоса движения." 
  },
];

const TrafficPage = () => {
  const [incidentType, setIncidentType] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);
  
  const filteredIncidents = incidents.filter(incident => {
    if (incidentType && incident.type !== incidentType) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background transition-all duration-300 grid-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold gradient-text mb-6">Дорожная ситуация</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <TrafficFilters
              incidentType={incidentType}
              setIncidentType={setIncidentType}
              district={district}
              setDistrict={setDistrict}
            />
            <TrafficIncidentsList incidents={filteredIncidents} />
          </div>
          
          <div className="lg:col-span-3">
            <Card className="neo-card h-[70vh] overflow-hidden">
              <div className="h-full w-full relative">
                <TrafficMapView
                  incidents={filteredIncidents}
                  selectedIncident={selectedIncident}
                  onIncidentSelect={setSelectedIncident}
                />
              </div>
            </Card>
            
            <div className="mt-6">
              <Tabs defaultValue="info">
                <TabsList className="neo-card">
                  <TabsTrigger value="info">Информация о пробках</TabsTrigger>
                  <TabsTrigger value="stats">Статистика</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="mt-4">
                  <Card className="neo-card">
                    <div className="pt-6 px-6 pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TrafficInfoCard 
                          title="Текущая загруженность" 
                          value="6 баллов" 
                          color="text-amber-500"
                          description="Движение умеренно затруднено"
                        />
                        <TrafficInfoCard 
                          title="Средняя скорость" 
                          value="32 км/ч" 
                          color="text-blue-400"
                          description="На основных магистралях города"
                        />
                        <TrafficInfoCard 
                          title="Активных ДТП" 
                          value="8" 
                          color="text-red-500"
                          description="Требуется объезд мест аварий"
                        />
                      </div>
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="stats" className="mt-4">
                  <Card className="neo-card">
                    <div className="pt-6 px-6 pb-6">
                      <TrafficStatistics />
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="neo-card py-8 mt-12 border-t border-white/5">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <div className="gradient-text mb-2">Город без сюрпризов</div>
          © 2025 Система контроля отключений коммунальных услуг
        </div>
      </footer>
    </div>
  );
};

export default TrafficPage;
