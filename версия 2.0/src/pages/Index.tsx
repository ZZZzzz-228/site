// src/index.tsx

// Патчим console.warn, чтобы молчать только о powerPreference
const _warn = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('The powerPreference option is currently ignored')
  ) {
    return; // глушим только это предупреждение
  }
  _warn.apply(console, args); // все остальные варнинги – как обычно
};

import React from 'react';
import Header from "@/components/Header";
import HomePage from "@/components/HomePage";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background transition-all duration-300 grid-bg">
      <Header />
      <HomePage />
      
      <footer className="neo-card py-8 mt-12 border-t border-white/5">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <div className="gradient-text mb-2">Город без сюрпризов</div>
          © 2025 Система контроля отключений коммунальных услуг
        </div>
      </footer>
    </div>
  );
};

export default Index;
