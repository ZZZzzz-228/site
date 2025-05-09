
import React, { useEffect, useRef } from 'react';
import { YANDEX_MAPS_API_KEY } from '../lib/config';
import { MapIcon } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface AutoService {
  id: number;
  type: string;
  name: string;
  address: string;
  coordinates: [number, number];
  phone: string;
  rating: number;
}

interface AutoServicesMapViewProps {
  services: AutoService[];
  selectedService: number | null;
  onServiceSelect: (id: number) => void;
}

const AutoServicesMapView: React.FC<AutoServicesMapViewProps> = ({
  services,
  selectedService,
  onServiceSelect
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const isMapLoaded = useRef<boolean>(false);
  const isMapCreating = useRef<boolean>(false);

  const loadYandexMaps = () => {
    if (window.ymaps) {
      return Promise.resolve();
    }
    
    return new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_MAPS_API_KEY}&lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(() => {
          console.log('Yandex Maps API loaded for auto services');
          isMapLoaded.current = true;
          resolve();
        });
      };
      document.body.appendChild(script);
    });
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapInstance.current) {
            mapInstance.current.setCenter([latitude, longitude], 14);
            
            if (window.ymaps) {
              try {
                const userPlacemark = new window.ymaps.Placemark(
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
                console.error('Ошибка при создании метки пользователя:', error);
              }
            }
          }
        },
        (error) => {
          console.error('Ошибка получения геолокации:', error);
        }
      );
    }
  };

  const initializeMap = async () => {
    if (!mapRef.current || !window.ymaps || isMapCreating.current) return;
    
    isMapCreating.current = true;
    try {
      const krasnoyarskCoords = [56.010563, 92.852572];
      
      mapInstance.current = new window.ymaps.Map(mapRef.current, {
        center: krasnoyarskCoords,
        zoom: 11,
        controls: ['zoomControl', 'geolocationControl'],
        type: 'yandex#map',
        options: {
          darkMode: true
        }
      });
      
      // Применяем темную тему после инициализации
      if (mapInstance.current) {
        // Устанавливаем темную тему
        mapInstance.current.panes.get('events').getElement().style.filter = 'invert(100%) hue-rotate(180deg)';
        mapInstance.current.panes.get('ground').getElement().style.filter = 'invert(100%) hue-rotate(180deg) brightness(0.7)';
      }
      
      console.log('Auto services map initialized with dark theme');
      
      getUserLocation();
      updateMarkers();
      isMapLoaded.current = true;
    } catch (error) {
      console.error('Error initializing auto services map:', error);
    } finally {
      isMapCreating.current = false;
    }
  };

  const updateMarkers = () => {
    if (!mapInstance.current || !window.ymaps || !services) return;
    
    try {
      markersRef.current.forEach(marker => {
        mapInstance.current?.geoObjects.remove(marker);
      });
      markersRef.current = [];

      services.forEach(service => {
        const colors = {
          gas: '#ffc107',
          service: '#4ade80',
          wash: '#2563eb'
        };
        
        const icon = {
          gas: '⛽',
          service: '🔧',
          wash: '🚿'
        };

        try {
          const placemark = new window.ymaps.Placemark(
            service.coordinates,
            {
              balloonContentHeader: `${icon[service.type as keyof typeof icon]} ${service.name}`,
              balloonContentBody: `
                <div>
                  <p><strong>Адрес:</strong> ${service.address}</p>
                  <p><strong>Телефон:</strong> ${service.phone}</p>
                  <p><strong>Рейтинг:</strong> ${service.rating} ⭐</p>
                </div>
              `,
              hintContent: service.name,
              iconContent: icon[service.type as keyof typeof icon]
            },
            {
              preset: 'islands#circleDotIcon',
              iconColor: colors[service.type as keyof typeof colors]
            }
          );
          
          placemark.events.add('click', () => {
            onServiceSelect(service.id);
          });
          
          mapInstance.current.geoObjects.add(placemark);
          markersRef.current.push(placemark);
        } catch (error) {
          console.error('Ошибка при создании метки:', error);
        }
      });

      console.log("Auto services map markers updated with", services.length, "services");
    } catch (error) {
      console.error('Ошибка при обновлении меток:', error);
    }
  };

  useEffect(() => {
    loadYandexMaps().then(() => {
      initializeMap();
    }).catch(err => {
      console.error('Failed to load Yandex Maps:', err);
    });
    
    return () => {
      if (mapInstance.current) {
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isMapLoaded.current && mapInstance.current) {
      updateMarkers();
    }
  }, [services]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/10">
      <div 
        ref={mapRef} 
        className="absolute inset-0"
      />
      {!isMapLoaded.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center p-8 neo-card bg-black/50 backdrop-blur-lg rounded-2xl max-w-2xl mx-auto">
            <div className="mb-6 text-6xl animate-pulse"><MapIcon size={64} /></div>
            <h3 className="text-xl font-semibold mb-3 gradient-text">Загрузка карты автосервисов...</h3>
            <Skeleton className="h-2 w-1/2 mx-auto bg-blue-500/30" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoServicesMapView;