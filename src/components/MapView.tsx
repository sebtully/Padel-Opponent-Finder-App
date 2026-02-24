import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import type { Court } from '../App';

declare global {
  interface Window {
    L: any;
  }
}

interface MapViewProps {
  courts: Court[];
  onCourtSelect: (court: Court) => void;
  selectedCourt: Court | null;
}

function createCustomIcon(L: any, isSelected: boolean, activePlayers: number) {
  const color = isSelected ? '#16a34a' : '#22c55e';
  const size = isSelected ? 40 : 35;
  const playersLabel = activePlayers > 99 ? '99+' : String(activePlayers);
  const badgeColor = activePlayers > 0 ? '#ef4444' : '#6b7280';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px;">
        ${activePlayers > 0 ? `
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            background: rgba(34, 197, 94, 0.4);
            border-radius: 50%;
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
        ` : ''}
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); position: relative; z-index: 10;">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
        <div style="
          position: absolute;
          top: -6px;
          right: -8px;
          background: ${badgeColor};
          color: white;
          border-radius: 9999px;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 20;
        ">${playersLabel}</div>
      </div>
      <style>
        @keyframes ping {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          75%, 100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
      </style>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function createPopupHtml(court: Court) {
  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px;">
      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">${court.name}</h3>
      <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">${court.address}</p>
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">${court.city}</p>
      <div style="display: flex; gap: 8px; margin-bottom: 12px; font-size: 13px;">
        <span style="color: #22c55e; font-weight: 500;">Looking for opponents: ${court.activePlayers}</span>
        <span style="color: #9ca3af;">*</span>
        <span style="color: #6b7280;">${court.courts} courts</span>
      </div>
      <button class="find-players-btn" style="width: 100%; background: #22c55e; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; margin-bottom: 8px;">
        Find players
      </button>
      <a href="${court.bookingUrl}" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; background: #f3f4f6; color: #374151; border: none; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; text-align: center; text-decoration: none; box-sizing: border-box;">
        Book court
      </a>
    </div>
  `;
}

export function MapView({ courts, onCourtSelect, selectedCourt }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Array<{ marker: any; courtId: string }>>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (window.L) {
      setMapLoaded(true);
      return;
    }

    if (!document.querySelector('link[data-leaflet-css="true"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.setAttribute('data-leaflet-css', 'true');
      document.head.appendChild(link);
    }

    const scriptSrc = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    let script = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement | null;
    const onReady = () => setMapLoaded(true);

    if (!script) {
      script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.onload = onReady;
      document.head.appendChild(script);
    } else if (window.L) {
      setMapLoaded(true);
    } else {
      script.addEventListener('load', onReady);
    }

    return () => {
      if (script) {
        script.removeEventListener('load', onReady);
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;
    const map = L.map(mapRef.current, {
      center: [56.2639, 9.5018],
      zoom: 7,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    mapInstanceRef.current = map;
  }, [mapLoaded]);

  useEffect(() => {
    if (!mapInstanceRef.current || !mapRef.current) return;

    const map = mapInstanceRef.current;
    const refreshSize = () => {
      try {
        map.invalidateSize();
      } catch {
        // ignore
      }
    };

    const initial = window.setTimeout(refreshSize, 50);
    window.addEventListener('resize', refreshSize);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => refreshSize());
      observer.observe(mapRef.current);
    }

    return () => {
      window.clearTimeout(initial);
      window.removeEventListener('resize', refreshSize);
      observer?.disconnect();
    };
  }, [mapLoaded]);

  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !window.L) return;

    const map = mapInstanceRef.current;
    const L = window.L;

    markersRef.current.forEach(({ marker }) => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    courts.forEach((court) => {
      const isSelected = selectedCourt?.id === court.id;
      const icon = createCustomIcon(L, isSelected, court.activePlayers);

      const marker = L.marker([court.lat, court.lng], { icon })
        .addTo(map)
        .bindPopup(createPopupHtml(court), { autoPan: true, keepInView: true });

      marker.on('popupopen', (e: any) => {
        try {
          const popupEl = e.popup.getElement();
          if (!popupEl) return;
          const btn = popupEl.querySelector('.find-players-btn') as HTMLButtonElement | null;
          if (btn) {
            const handler = () => onCourtSelect(court);
            (btn as any).__handler = handler;
            btn.addEventListener('click', handler);
          }
        } catch {
          // ignore
        }
      });

      marker.on('popupclose', (e: any) => {
        try {
          const popupEl = e.popup.getElement();
          if (!popupEl) return;
          const btn = popupEl.querySelector('.find-players-btn') as HTMLButtonElement | null;
          if (btn && (btn as any).__handler) {
            btn.removeEventListener('click', (btn as any).__handler);
            delete (btn as any).__handler;
          }
        } catch {
          // ignore
        }
      });

      markersRef.current.push({ marker, courtId: court.id });
    });
  }, [mapLoaded, courts, onCourtSelect, selectedCourt]);

  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !window.L || courts.length === 0) return;

    const L = window.L;
    const bounds = L.latLngBounds(courts.map((court) => [court.lat, court.lng]));

    try {
      mapInstanceRef.current.fitBounds(bounds, { padding: [32, 32], maxZoom: 10 });
    } catch {
      // ignore
    }
  }, [mapLoaded, courts]);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCourt) return;

    try {
      mapInstanceRef.current.closePopup();
    } catch {
      // ignore
    }

    const markerObj = markersRef.current.find((m) => m.courtId === selectedCourt.id);
    if (markerObj?.marker && typeof markerObj.marker.getLatLng === 'function') {
      try {
        mapInstanceRef.current.panTo(markerObj.marker.getLatLng());
      } catch {
        // ignore
      }
    }
  }, [selectedCourt]);

  if (!mapLoaded) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-100 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4" />
          <div className="text-gray-600">Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full" style={{ minHeight: 0 }}>
      <div ref={mapRef} className="absolute inset-0" />

      <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-4 max-w-[280px]" style={{ zIndex: 650 }}>
        <h4 className="text-gray-900 mb-3">Map legend</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" />
            <span className="text-gray-600">Padel court</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <MapPin className="w-6 h-6 text-green-500" fill="currentColor" />
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                5
              </div>
            </div>
            <span className="text-gray-600">Players looking</span>
          </div>
          <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
            Click a marker to see details and find players
          </div>
        </div>
      </div>
    </div>
  );
}
