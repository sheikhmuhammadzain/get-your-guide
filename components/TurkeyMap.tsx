'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { useMemo, useState } from 'react';
import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl/maplibre';

const MARKERS = [
  { city: 'Istanbul', lat: 41.0082, lon: 28.9784, label: 'Culture & History' },
  { city: 'Cappadocia', lat: 38.6431, lon: 34.8272, label: 'Adventure' },
  { city: 'Ephesus', lat: 37.939, lon: 27.3415, label: 'Ancient Wonders' },
  { city: 'Pamukkale', lat: 37.9244, lon: 29.1177, label: 'Nature' },
  { city: 'Antalya', lat: 36.8969, lon: 30.7133, label: 'Coastal Relaxation' },
] as const;

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

function getDistanceKm(from: { lat: number; lon: number }, to: { lat: number; lon: number }) {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latDiff = toRadians(to.lat - from.lat);
  const lonDiff = toRadians(to.lon - from.lon);
  const a =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(lonDiff / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(earthRadiusKm * c);
}

export default function TurkeyMap() {
  const [selectedCity, setSelectedCity] = useState<(typeof MARKERS)[number]>(MARKERS[0]);
  const [routeCities, setRouteCities] = useState<string[]>(['Istanbul', 'Cappadocia', 'Ephesus']);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const initialViewState = useMemo(
    () => ({
      latitude: selectedCity.lat,
      longitude: selectedCity.lon,
      zoom: 5.5,
    }),
    [selectedCity],
  );

  const routeCoordinates = useMemo(() => {
    return routeCities
      .map((city) => MARKERS.find((marker) => marker.city === city))
      .filter((item): item is (typeof MARKERS)[number] => Boolean(item))
      .map((marker) => [marker.lon, marker.lat]);
  }, [routeCities]);

  const routeGeoJson = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'LineString' as const,
            coordinates: routeCoordinates,
          },
        },
      ],
    }),
    [routeCoordinates],
  );

  const estimatedRouteDistance = useMemo(() => {
    if (routeCities.length < 2) {
      return 0;
    }

    let sum = 0;
    for (let index = 1; index < routeCities.length; index += 1) {
      const from = MARKERS.find((marker) => marker.city === routeCities[index - 1]);
      const to = MARKERS.find((marker) => marker.city === routeCities[index]);
      if (from && to) {
        sum += getDistanceKm(from, to);
      }
    }
    return sum;
  }, [routeCities]);

  function toggleRouteCity(city: string) {
    setRouteCities((prev) => (prev.includes(city) ? prev.filter((item) => item !== city) : [...prev, city]));
  }

  async function saveMapPreferences() {
    setSaveMessage(null);

    try {
      const response = await fetch('/api/v1/users/me/preferences', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          preferredCities: routeCities.map((city) => city.toLowerCase()),
          savedMap: {
            centerLat: selectedCity.lat,
            centerLon: selectedCity.lon,
            zoom: 5.5,
            highlightedCities: routeCities,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Sign in to save map state');
      }

      setSaveMessage('Map preferences saved.');
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : 'Map save failed');
    }
  }

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

        {routeCoordinates.length > 1 ? (
          <Source id="route-line" type="geojson" data={routeGeoJson}>
            <Layer
              id="route-line-layer"
              type="line"
              paint={{
                'line-color': '#0b6bcb',
                'line-width': 3,
                'line-opacity': 0.75,
              }}
            />
          </Source>
        ) : null}

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
        <p className="mb-2 text-xs font-semibold text-gray-500">Route map (MapLibre + Carto)</p>
        <div className="mb-2 flex flex-wrap gap-2">
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

        <p className="mb-1 text-xs font-semibold text-gray-500">Build route</p>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {MARKERS.map((marker) => {
            const active = routeCities.includes(marker.city);
            return (
              <button
                key={`route-${marker.city}`}
                onClick={() => toggleRouteCity(marker.city)}
                className={`rounded-full border px-2 py-1 text-[11px] ${
                  active ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300 bg-white text-gray-700'
                }`}
              >
                {active ? 'In route' : 'Add'} {marker.city}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-gray-600">{routeCities.join(' -> ') || 'No route cities selected'}</p>
        <p className="text-xs text-gray-600">Approx route distance: {estimatedRouteDistance} km</p>
        <p className="mt-1 text-xs text-gray-600">Focus: {selectedCity.label}</p>

        <button
          onClick={() => void saveMapPreferences()}
          className="mt-2 rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          Save map preferences
        </button>
        {saveMessage ? <p className="mt-1 text-xs text-gray-700">{saveMessage}</p> : null}
      </div>
    </div>
  );
}
