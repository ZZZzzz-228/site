
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleAlert, Car, Construction } from 'lucide-react';

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  color?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ active, onClick, icon, label, color }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`
        ${color || "bg-muted/30 border-white/10 hover:bg-blue-900/30 hover:border-blue-500/50"}
        ${active ? "border-blue-400 bg-blue-900/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]" : ""}
      `}
    >
      {icon && icon}
      {label}
    </Button>
  );
};

interface TrafficFiltersProps {
  incidentType: string | null;
  setIncidentType: (type: string | null) => void;
  district: string | null;
  setDistrict: (district: string | null) => void;
}

const TrafficFilters: React.FC<TrafficFiltersProps> = ({
  incidentType,
  setIncidentType,
  district,
  setDistrict
}) => {
  return (
    <Card className="neo-card p-4 mb-6">
      <h2 className="text-xl font-medium text-blue-100 mb-4">Фильтры</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Тип происшествия</h3>
          <div className="flex flex-wrap gap-2">
            <FilterButton 
              active={incidentType === "accident"}
              onClick={() => setIncidentType(incidentType === "accident" ? null : "accident")}
              icon={<CircleAlert className="h-4 w-4" />}
              label="ДТП"
              color="bg-red-900/30 border-red-500/30 hover:bg-red-900/40 hover:border-red-500/50"
            />
            <FilterButton 
              active={incidentType === "traffic"}
              onClick={() => setIncidentType(incidentType === "traffic" ? null : "traffic")}
              icon={<Car className="h-4 w-4" />}
              label="Пробки"
              color="bg-amber-900/30 border-amber-500/30 hover:bg-amber-900/40 hover:border-amber-500/50"
            />
            <FilterButton 
              active={incidentType === "construction"}
              onClick={() => setIncidentType(incidentType === "construction" ? null : "construction")}
              icon={<Construction className="h-4 w-4" />}
              label="Ремонт"
              color="bg-blue-900/30 border-blue-500/30 hover:bg-blue-900/40 hover:border-blue-500/50"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Районы</h3>
          <div className="flex flex-wrap gap-2">
            {["Советский", "Центральный", "Октябрьский", "Железнодорожный"].map(d => (
              <FilterButton 
                key={d}
                active={district === d}
                onClick={() => setDistrict(district === d ? null : d)}
                label={d}
              />
            ))}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 bg-primary/20 border-primary/30 hover:bg-primary/30"
        >
          Определить мое местоположение
        </Button>
      </div>
    </Card>
  );
};

export default TrafficFilters;
