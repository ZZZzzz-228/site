// src/components/MapView.tsx

import React, { useEffect, useRef, useState } from 'react';
import { load } from '@2gis/mapgl';
import { MapPinOff } from 'lucide-react';

interface MapViewProps {
  // если понадобятся маркеры — можно вернуть этот пропс
  markers?: {
    id: string;
    lat: number;
    lon: number;
    popupText?: string;
  }[];
}

const API_KEY = '6a154f69-df63-4a54-b8da-0daf6e9c3746';
// Координаты Красноярска: долгота, широта
const KRASNOYARSK_CENTER: [number, number] = [92.852572, 56.010563];

const MapView: React.FC<MapViewProps> = ({ markers = [] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    load()
      .then((mapgl) => {
        if (cancelled || !containerRef.current) return;

        // создаём карту, центрируемся на Красноярск
        mapRef.current = new mapgl.Map(containerRef.current, {
          key: API_KEY,
          center: KRASNOYARSK_CENTER,
          zoom: 11,
          zoomControl: true,
          scaleControl: true,
          trafficControl: false, // убираем кнопку «пробки»
        });

        // на всякий случай принудительно центрируем ещё раз
        mapRef.current.setCenter(KRASNOYARSK_CENTER, 11);

        setLoading(false);
      })
      .catch((err) => {
        console.error('2GIS MapGL загрузка не удалась:', err);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/10">
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ minHeight: '300px' }}
      />

      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="neo-card bg-black/60 text-white p-6 rounded-2xl text-center animate-pulse-soft">
            <MapPinOff size={48} className="mx-auto mb-4" />
            <div className="text-lg font-medium">Загрузка карты…</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
