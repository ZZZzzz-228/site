
import React from 'react';
import { Card } from "@/components/ui/card";
import { CircleAlert, Car, Construction } from 'lucide-react';

interface TrafficIncident {
  id: number;
  type: string;
  title: string;
  location: string;
  coordinates: [number, number];
  time: string;
  description: string;
}

interface TrafficIncidentsListProps {
  incidents: TrafficIncident[];
}

const TrafficIncidentsList: React.FC<TrafficIncidentsListProps> = ({ incidents }) => {
  const getIncidentIcon = (type: string) => {
    switch (type) {
      case "accident": return <CircleAlert className="h-5 w-5 text-red-500" />;
      case "traffic": return <Car className="h-5 w-5 text-amber-500" />;
      case "construction": return <Construction className="h-5 w-5 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <Card className="neo-card p-4">
      <h2 className="text-xl font-medium text-blue-100 mb-4">Происшествия</h2>
      <div className="space-y-3">
        {incidents.map(incident => (
          <div 
            key={incident.id}
            className="p-3 neo-card bg-blue-900/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:translate-x-1"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{getIncidentIcon(incident.type)}</div>
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-blue-100">{incident.title}</h3>
                  <span className="text-xs text-gray-400">{incident.time}</span>
                </div>
                <p className="text-sm text-gray-300 mt-0.5">{incident.location}</p>
                <p className="text-xs text-gray-400 mt-1">{incident.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-sm text-blue-400">
        Найдено происшествий: <span className="text-white font-semibold">{incidents.length}</span>
      </div>
    </Card>
  );
};

export default TrafficIncidentsList;
