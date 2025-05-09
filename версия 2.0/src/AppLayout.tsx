// src/AppLayout.tsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 flex gap-4">
        <NavLink to="/"    className="hover:underline">Главная</NavLink>
        <NavLink to="/map" className="hover:underline">Карта отключений</NavLink>
        <NavLink to="/traffic" className="hover:underline">Пробки</NavLink>
        {/* и т.д. */}
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
