// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { YANDEX_MAPS_API_KEY } from '../lib/config';
import { MapIcon } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface TrafficIncident {
  id: number;
  type: string;
  title: string;
  location: string;
  coordinates: [number, number];
  time: string;
  description: string;
}

interface TrafficMapViewProps {
  incidents: TrafficIncident[];
  selectedIncident: number | null;
  onIncidentSelect: (id: number) => void;
}

const TrafficMapView: React.FC<TrafficMapViewProps> = ({
  incidents,
  selectedIncident,
  onIncidentSelect
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const isMapLoaded = useRef<boolean>(false);
  const isMapCreating = useRef<boolean>(false);

  const loadYandexMaps = () => {
    if ((window as any).ymaps) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_MAPS_API_KEY}&lang=ru_RU&load=package.full`;
      script.async = true;
      script.onload = () => {
        (window as any).ymaps.ready(() => {
          isMapLoaded.current = true;
          resolve();
        });
      };
      document.body.appendChild(script);
    });
  };

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapInstance.current) {
            mapInstance.current.setCenter([latitude, longitude], 14);
            try {
              const userPlacemark = new (window as any).ymaps.Placemark(
                [latitude, longitude],
                {
                  hintContent: 'Вы здесь',
                  balloonContent: 'Ваше текущее местоположение'
                },
                {
                  preset: 'islands#geolocationIcon',
                  iconColor: '#3b82f6'
                }
              );
              mapInstance.current.geoObjects.add(userPlacemark);
            } catch (error) {
              console.error(error);
            }
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  };

  const initializeMap = async () => {
    if (!mapRef.current || !(window as any).ymaps || isMapCreating.current) return;
    isMapCreating.current = true;
    try {
      const krasnoyarskCoords: [number, number] = [56.010563, 92.852572];
      mapInstance.current = new (window as any).ymaps.Map(
        mapRef.current,
        { center: krasnoyarskCoords, zoom: 11 },
        {
          controls: ['zoomControl', 'geolocationControl'],
          type: 'yandex#map',
          darkMode: true
        }
      );
      // apply dark theme via CSS filters
      const eventsPane = mapInstance.current.panes.get('events').getElement();
      const groundPane = mapInstance.current.panes.get('ground').getElement();
      eventsPane.style.filter = 'invert(100%) hue-rotate(180deg)';
      groundPane.style.filter = 'invert(100%) hue-rotate(180deg) brightness(0.7)';
      getUserLocation();
      updateMarkers();
      isMapLoaded.current = true;
    } catch (error) {
      console.error(error);
    } finally {
      isMapCreating.current = false;
    }
  };

  const updateMarkers = () => {
    if (!mapInstance.current || !(window as any).ymaps) return;
    markersRef.current.forEach((m) => mapInstance.current.geoObjects.remove(m));
    markersRef.current = [];
    incidents.forEach((incident) => {
      if (!incident.coordinates) return;
      const colors: Record<string, string> = {
        accident: '#dc2626',
        traffic: '#ffc107',
        construction: '#4ade80'
      };
      const icons: Record<string, string> = {
        accident: '🚨',
        traffic: '🚗',
        construction: '🚧'
      };
      try {
        const P = (window as any).ymaps.Placemark;
        const placemark = new P(
          incident.coordinates,
          {
            balloonContentHeader: `${icons[incident.type]} ${incident.title}`,
            balloonContentBody: `
              <div>
                <p><strong>Место:</strong> ${incident.location}</p>
                <p><strong>Время:</strong> ${incident.time}</p>
                <p>${incident.description}</p>
              </div>
            `,
            hintContent: incident.title,
            iconContent: icons[incident.type]
          },
          {
            preset: 'islands#circleDotIcon',
            iconColor: colors[incident.type]
          }
        );
        placemark.events.add('click', () => onIncidentSelect(incident.id));
        mapInstance.current.geoObjects.add(placemark);
        markersRef.current.push(placemark);
      } catch (error) {
        console.error(error);
      }
    });
  };

  useEffect(() => {
    loadYandexMaps()
      .then(initializeMap)
      .catch(console.error);
    return () => {
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (isMapLoaded.current) {
      updateMarkers();
    }
  }, [incidents]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/10">
      <div ref={mapRef} className="absolute inset-0" />
      {!isMapLoaded.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center p-8 neo-card bg-black/50 backdrop-blur-lg rounded-2xl max-w-2xl mx-auto">
            <div className="mb-6 text-6xl animate-pulse">
              <MapIcon size={64} />
            </div>
            <h3 className="text-xl font-semibold mb-3 gradient-text">
              Загрузка карты пробок...
            </h3>
            <Skeleton className="h-2 w-1/2 mx-auto bg-blue-500/30" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrafficMapView;
