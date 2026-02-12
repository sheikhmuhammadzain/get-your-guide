'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { useMemo, useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';

const MARKERS = [
  { city: 'Istanbul', lat: 41.0082, lon: 28.9784, label: 'Culture & History' },
  { city: 'Cappadocia', lat: 38.6431, lon: 34.8272, label: 'Adventure' },
  { city: 'Ephesus', lat: 37.939, lon: 27.3415, label: 'Ancient Wonders' },
  { city: 'Pamukkale', lat: 37.9244, lon: 29.1177, label: 'Nature' },
  { city: 'Antalya', lat: 36.8969, lon: 30.7133, label: 'Coastal Relaxation' },
] as const;

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

export default function TurkeyMap() {
  const [selectedCity, setSelectedCity] = useState<(typeof MARKERS)[number]>(MARKERS[0]);

  const initialViewState = useMemo(
    () => ({
      latitude: selectedCity.lat,
      longitude: selectedCity.lon,
      zoom: 5.5,
    }),
    [selectedCity],
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <Map
        key={selectedCity.city}
        initialViewState={initialViewState}
        mapStyle={MAP_STYLE}
        reuseMaps
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="bottom-right" />
        {MARKERS.map((marker) => (
          <Marker key={marker.city} latitude={marker.lat} longitude={marker.lon} anchor="bottom">
            <button
              type="button"
              onClick={() => setSelectedCity(marker)}
              className={`h-3.5 w-3.5 rounded-full border-2 ${
                selectedCity.city === marker.city ? 'border-blue-700 bg-blue-500' : 'border-blue-500 bg-white'
              }`}
              aria-label={`Focus ${marker.city}`}
            />
          </Marker>
        ))}
      </Map>

      <div className="absolute left-3 right-3 top-3 rounded-xl border border-gray-200 bg-white/95 p-3 shadow-md backdrop-blur-sm">
        <p className="mb-2 text-xs font-semibold text-gray-500">Free map (MapLibre + Carto)</p>
        <div className="flex flex-wrap gap-2">
          {MARKERS.map((marker) => {
            const active = selectedCity.city === marker.city;
            return (
              <button
                key={marker.city}
                onClick={() => setSelectedCity(marker)}
                className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  active ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-blue-50'
                }`}
                aria-label={`Show ${marker.city} on map`}
              >
                {marker.city}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-gray-600">{selectedCity.label}</p>
      </div>
    </div>
  );
}
