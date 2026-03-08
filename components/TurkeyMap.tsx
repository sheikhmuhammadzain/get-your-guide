'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MAP_ROUTE_HEX } from '@/theme/colors';

const MARKERS = [
  { city: 'Istanbul', lat: 41.0082, lon: 28.9784, label: 'Culture & History' },
  { city: 'Cappadocia', lat: 38.6431, lon: 34.8272, label: 'Adventure' },
  { city: 'Ephesus', lat: 37.939, lon: 27.3415, label: 'Ancient Wonders' },
  { city: 'Pamukkale', lat: 37.9244, lon: 29.1177, label: 'Nature' },
  { city: 'Antalya', lat: 36.8969, lon: 30.7133, label: 'Coastal Relaxation' },
] as const;

const MAP_ROUTE_COLOR = MAP_ROUTE_HEX;

declare global {
  interface Window {
    __googleMapsScriptLoadingPromise?: Promise<void>;
  }
}

function loadGoogleMapsScript(apiKey: string) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is not available'));
  }

  if (window.google?.maps) {
    return Promise.resolve();
  }

  if (window.__googleMapsScriptLoadingPromise) {
    return window.__googleMapsScriptLoadingPromise;
  }

  window.__googleMapsScriptLoadingPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });

  return window.__googleMapsScriptLoadingPromise;
}

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
  const [mapError, setMapError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
    city?: string;
    country?: string;
  } | null>(null);
  const [locating, setLocating] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const routeLineRef = useRef<google.maps.Polyline | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const hasInitializedRef = useRef(false);
  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const routeCoordinates = useMemo(
    () =>
      routeCities
        .map((city) => MARKERS.find((marker) => marker.city === city))
        .filter((item): item is (typeof MARKERS)[number] => Boolean(item))
        .map((marker) => ({ lat: marker.lat, lng: marker.lon })),
    [routeCities],
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

  const nearestCity = useMemo(() => {
    if (!userLocation) return null;
    let closest: (typeof MARKERS)[number] = MARKERS[0];
    let minDist = Infinity;
    for (const marker of MARKERS) {
      const dist = getDistanceKm(userLocation, marker);
      if (dist < minDist) {
        minDist = dist;
        closest = marker;
      }
    }
    return { marker: closest, distanceKm: minDist };
  }, [userLocation]);

  function toggleRouteCity(city: string) {
    setRouteCities((prev) => (prev.includes(city) ? prev.filter((item) => item !== city) : [...prev, city]));
  }

  async function locateUser() {
    if (!navigator.geolocation) {
      setMapError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setMapError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      const { latitude, longitude } = position.coords;
      const loc: typeof userLocation = { lat: latitude, lon: longitude };

      // Reverse geocode with Google to get city/country
      if (googleMapsKey) {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsKey}&result_type=locality|country`,
          );
          if (response.ok) {
            const data = (await response.json()) as {
              results?: Array<{
                address_components?: Array<{
                  long_name: string;
                  types: string[];
                }>;
              }>;
            };
            const components = data.results?.[0]?.address_components ?? [];
            const city = components.find((c) => c.types.includes('locality'))?.long_name;
            const country = components.find((c) => c.types.includes('country'))?.long_name;
            loc.city = city;
            loc.country = country;
          }
        } catch {
          // Reverse geocoding failed — location still works without city name.
        }
      }

      setUserLocation(loc);

      // Add/move user marker on the map
      if (mapRef.current) {
        if (userMarkerRef.current) {
          userMarkerRef.current.setPosition({ lat: latitude, lng: longitude });
        } else {
          userMarkerRef.current = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: mapRef.current,
            title: 'Your Location',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
          });
        }

        // Pan to show both user and Turkey
        const bounds = new google.maps.LatLngBounds();
        bounds.extend({ lat: latitude, lng: longitude });
        MARKERS.forEach((m) => bounds.extend({ lat: m.lat, lng: m.lon }));
        mapRef.current.fitBounds(bounds, 40);
      }
    } catch (err) {
      const geoError = err as GeolocationPositionError;
      const messages: Record<number, string> = {
        1: 'Location access denied. Please allow location in your browser settings.',
        2: 'Location unavailable. Please try again.',
        3: 'Location request timed out. Please try again.',
      };
      setMapError(messages[geoError.code] ?? 'Could not get your location.');
    } finally {
      setLocating(false);
    }
  }

  useEffect(() => {
    if (hasInitializedRef.current) return;
    if (!mapContainerRef.current) return;
    if (!googleMapsKey) {
      setMapError('Google Maps key missing. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.');
      return;
    }
    const apiKey = googleMapsKey;

    let cancelled = false;

    async function initGoogleMap() {
      try {
        await loadGoogleMapsScript(apiKey);
        if (cancelled || !mapContainerRef.current) return;

        const map = new google.maps.Map(mapContainerRef.current, {
          center: { lat: selectedCity.lat, lng: selectedCity.lon },
          zoom: 5.5,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });
        mapRef.current = map;

        MARKERS.forEach((marker) => {
          const markerInstance = new google.maps.Marker({
            position: { lat: marker.lat, lng: marker.lon },
            map,
            title: marker.city,
          });
          markerInstance.addListener('click', () => setSelectedCity(marker));
        });

        routeLineRef.current = new google.maps.Polyline({
          path: routeCoordinates,
          strokeColor: MAP_ROUTE_COLOR,
          strokeOpacity: 0.85,
          strokeWeight: 4,
          map,
        });

        hasInitializedRef.current = true;
      } catch (error) {
        setMapError(error instanceof Error ? error.message : 'Failed to initialize Google Maps');
      }
    }

    void initGoogleMap();

    return () => {
      cancelled = true;
    };
  }, [googleMapsKey, routeCoordinates, selectedCity.lat, selectedCity.lon]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.panTo({ lat: selectedCity.lat, lng: selectedCity.lon });
  }, [selectedCity]);

  useEffect(() => {
    if (!routeLineRef.current) return;
    routeLineRef.current.setPath(routeCoordinates);
  }, [routeCoordinates]);

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
      <div ref={mapContainerRef} className="h-full w-full" />

      <div className="absolute left-3 right-3 top-3 rounded-xl border border-gray-200 bg-white/95 p-3 shadow-md backdrop-blur-sm">
        <p className="mb-2 text-xs font-semibold text-gray-500">Route map (Google Maps)</p>
        <div className="mb-2 flex flex-wrap gap-2">
          {MARKERS.map((marker) => {
            const active = selectedCity.city === marker.city;
            return (
              <button
                key={marker.city}
                onClick={() => setSelectedCity(marker)}
                className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${active ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-blue-50'
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
                className={`rounded-full border px-2 py-1 text-[11px] ${active ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300 bg-white text-gray-700'
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

        {/* User Location Info */}
        {userLocation && nearestCity && (
          <div className="mt-2 flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2">
            <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
            <div className="text-[11px] leading-relaxed text-blue-800">
              <p className="font-semibold">
                {userLocation.city
                  ? `You are in ${userLocation.city}${userLocation.country ? `, ${userLocation.country}` : ''}`
                  : 'Your location detected'}
              </p>
              <p>
                {nearestCity.distanceKm.toLocaleString("en-US")} km from {nearestCity.marker.city} (nearest)
              </p>
            </div>
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => void locateUser()}
            disabled={locating}
            className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50"
          >
            <span className={`inline-block h-2 w-2 rounded-full ${locating ? 'animate-pulse bg-blue-400' : 'bg-blue-500'}`} />
            {locating ? 'Locating…' : userLocation ? 'Update Location' : '📍 My Location'}
          </button>

          <button
            onClick={() => void saveMapPreferences()}
            className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Save map preferences
          </button>
        </div>

        {mapError ? <p className="mt-1 text-xs text-red-700">{mapError}</p> : null}
        {saveMessage ? <p className="mt-1 text-xs text-gray-700">{saveMessage}</p> : null}
      </div>
    </div>
  );
}
