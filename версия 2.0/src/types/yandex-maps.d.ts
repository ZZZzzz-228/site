declare namespace ymaps {
    interface Map {
      geoObjects: any;
      setCenter(coords: number[], zoom: number): void;
    }
  
    interface Placemark {
      events: {
        add(event: string, callback: () => void): void;
      };
    }
  
    function ready(callback: () => void): void;
    function Map(element: HTMLElement, options: MapOptions): Map;
    function Placemark(
      coords: number[],
      properties: any,
      options: any
    ): Placemark;
  
    interface MapOptions {
      center: number[];
      zoom: number;
      controls?: string[];
    }
  }
  