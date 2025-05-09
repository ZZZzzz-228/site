
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ServiceFilterTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ServiceFilterTabs: React.FC<ServiceFilterTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList className="neo-card p-1 rounded-full">
          <TabsTrigger 
            value="all" 
            className="px-6 py-2 rounded-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300"
          >
            Все
          </TabsTrigger>
          <TabsTrigger 
            value="gas" 
            className="px-6 py-2 rounded-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300"
          >
            Заправки
          </TabsTrigger>
          <TabsTrigger 
            value="service" 
            className="px-6 py-2 rounded-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300"
          >
            Автосервисы
          </TabsTrigger>
          <TabsTrigger 
            value="wash" 
            className="px-6 py-2 rounded-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300"
          >
            Автомойки
          </TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  );
};

export default ServiceFilterTabs;
