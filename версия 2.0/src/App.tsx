// src/App.tsx

////////////////////////////////////////////////////////////////
// Патчим console.warn, чтобы молчать только о powerPreference
////////////////////////////////////////////////////////////////

const _origWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('The powerPreference option is currently ignored')
  ) {
    return; // глушим только это предупреждение
  }
  _origWarn.apply(console, args); // все остальные варнинги – как обычно
};

import React from 'react';
import { Outlet } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

export default function App() {
  return (
    <TooltipProvider>
      {/* Системные тосты */}
      <Toaster />
      <Sonner />

      {/* Тут будут меняться страницы через <Outlet /> */}
      <Outlet />
    </TooltipProvider>
  );
}
