
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarFront, Wrench, Fuel } from 'lucide-react';

interface Service {
  id: number;
  type: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
}

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
}

const getServiceIcon = (type: string) => {
  switch (type) {
    case "gas": return <Fuel className="h-5 w-5 text-utility-electricity" />;
    case "service": return <Wrench className="h-5 w-5 text-utility-gas" />;
    case "wash": return <CarFront className="h-5 w-5 text-utility-water" />;
    default: return null;
  }
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  return (
    <Card className="neo-card hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          {getServiceIcon(service.type)}
          <h3 className="font-medium text-blue-100">{service.name}</h3>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm text-gray-400">
            <span>Адрес:</span>
            <span className="text-gray-300">{service.address}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-400">
            <span>Телефон:</span>
            <a href={`tel:${service.phone}`} className="text-blue-400 hover:text-blue-300 transition-colors">
              {service.phone}
            </a>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-400">
            <span>Рейтинг:</span>
            <div className="text-yellow-500 font-medium">
              {service.rating} ★
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button 
            variant="outline" 
            className="bg-blue-900/20 border-blue-500/30 hover:bg-blue-900/40 hover:border-blue-500/50"
            asChild
          >
            <a href={`tel:${service.phone}`}>
              Позвонить
            </a>
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none"
            onClick={() => onBook(service)}
          >
            Записаться
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
