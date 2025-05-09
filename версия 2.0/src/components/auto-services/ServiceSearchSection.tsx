import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ServiceSearchSectionProps {
  onSearch: (query: string) => void;
}

const ServiceSearchSection: React.FC<ServiceSearchSectionProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Card className="neo-card p-6 max-w-xl w-full">
      <h2 className="text-2xl font-bold gradient-text mb-4">Ищете конкретное место?</h2>
      <p className="text-gray-400 mb-4">
        Введите адрес или район, чтобы найти ближайшие автосервисы, заправки и автомойки.
      </p>
      <div className="flex gap-2">
        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите адрес или район..." 
          className="flex-1 bg-muted/50 border-white/10"
        />
        <Button onClick={handleSubmit}>Найти</Button>
      </div>
    </Card>
  );
};

export default ServiceSearchSection;
