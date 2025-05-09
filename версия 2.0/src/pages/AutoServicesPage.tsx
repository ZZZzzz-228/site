import React, { useState, useMemo, useEffect } from 'react';
import Header from "@/components/Header";
import ServiceCard from "@/components/auto-services/ServiceCard";
import ServiceFilterTabs from "@/components/auto-services/ServiceFilterTabs";
import ServiceBookingDialog from "@/components/auto-services/ServiceBookingDialog";
import ServiceSearchSection from "@/components/auto-services/ServiceSearchSection";
import AutoServicesMapView from "@/components/AutoServicesMapView";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";

const services = [
  {
    id: 1,
    type: "gas",
    name: "АЗС Газпромнефть",
    address: "ул. Авиаторов, 54",
    phone: "+7 (391) 255-55-55",
    rating: 4.7
  },
  {
    id: 2,
    type: "service",
    name: "Автосервис 'ДрайвМастер'",
    address: "ул. Красноярский рабочий, 122",
    phone: "+7 (391) 234-56-78",
    rating: 4.5
  },
  {
    id: 3,
    type: "wash",
    name: "Автомойка 'Аква'",
    address: "пр. Мира, 30",
    phone: "+7 (391) 222-33-44",
    rating: 4.8
  },
  {
    id: 4,
    type: "gas",
    name: "АЗС Лукойл",
    address: "ул. 9 мая, 77",
    phone: "+7 (391) 211-22-33",
    rating: 4.4
  },
  {
    id: 5,
    type: "service",
    name: "Техцентр 'Енисей'",
    address: "ул. Ленина, 45",
    phone: "+7 (391) 266-77-88",
    rating: 4.6
  },
  {
    id: 6,
    type: "wash",
    name: "Детейлинг центр 'Pro Wash'",
    address: "ул. Взлетная, 12",
    phone: "+7 (391) 298-76-54",
    rating: 4.9
  }
];

const AutoServicesPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }

    const handleHeaderSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSearchQuery(customEvent.detail);
    };

    window.addEventListener('headerSearch', handleHeaderSearch);

    return () => {
      window.removeEventListener('headerSearch', handleHeaderSearch);
    };
  }, [location.search]);

  const filteredServices = useMemo(() => {
    const typeFiltered = activeTab === "all"
      ? services
      : services.filter(service => service.type === activeTab);

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      return typeFiltered.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.address.toLowerCase().includes(query)
      );
    }

    return typeFiltered;
  }, [activeTab, searchQuery]);

  const handleBook = (service: any) => {
    setSelectedService(service.id);
    setBookingDialogOpen(true);
  };

  const handleServiceSelect = (id: number) => {
    const service = services.find(s => s.id === id);
    if (service) {
      setSelectedService(id);
      setBookingDialogOpen(true);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('search', query);
      window.history.pushState({}, '', url.toString());
      toast({
        title: "Поиск выполнен",
        description: `Результаты поиска для: ${query}`,
      });
    } else {
      url.searchParams.delete('search');
      window.history.pushState({}, '', url.toString());
    }
  };

  const selectedServiceObject = selectedService !== null
    ? services.find(s => s.id === selectedService) || null
    : null;

  return (
    <div className="min-h-screen bg-background transition-all duration-300 grid-bg">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold gradient-text mb-6">Автосервисы, заправки и автомойки</h1>

        <div className="mb-8">
          <ServiceFilterTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className="mb-8 flex justify-center">
          <ServiceSearchSection onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={handleBook}
              />
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <div className="mb-4 text-5xl">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Нет результатов</h3>
              <p className="text-gray-400">
                По запросу "{searchQuery}" ничего не найдено. Попробуйте изменить запрос.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12">
          <Card className="neo-card overflow-hidden h-[50vh]">
            <div className="h-full w-full relative">
              <AutoServicesMapView
                services={services.map(service => ({
                  ...service,
                  coordinates: [56.010563 + (Math.random() - 0.5) * 0.05, 92.852572 + (Math.random() - 0.5) * 0.05] as [number, number]
                }))}
                selectedService={selectedService}
                onServiceSelect={handleServiceSelect}
              />
            </div>
          </Card>
        </div>
      </main>

      <ServiceBookingDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        selectedService={selectedServiceObject}
      />

      <footer className="neo-card py-8 mt-12 border-t border-white/5">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <div className="gradient-text mb-2">Город без сюрпризов</div>
          © 2025 Система контроля отключений коммунальных услуг
        </div>
      </footer>
    </div>
  );
};

export default AutoServicesPage;
