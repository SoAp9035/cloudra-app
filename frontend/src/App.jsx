import { fetchWeatherProbability } from "./components/apiClient";
import ResultsPanel from "./components/ResultsPanel.jsx";
import LoadingOverlay from "./components/LoadingOverlay.jsx";
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  ZoomControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Sidebar from "./components/Sidebar.jsx";
import { Link } from "react-router-dom";

const FALLBACK = { lat: 37.7749, lng: -122.4194 };

const todayISO = () => new Date().toISOString().slice(0, 10);

// Red marker icon
const redIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Keeps the map view in sync with `center`
function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView([center.lat, center.lng]);
  }, [center, map]);
  return null;
}

export default function App() {
  // Map state
  const [center, setCenter] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [hasSelectedLocation, setHasSelectedLocation] = useState(false);

  // UI state
  const [addressLabel, setAddressLabel] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [mode, setMode] = useState(null); // "quick" | "detailed" | null

  // API state
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lastRunRef = useRef(null);

  const analysisMode = useMemo(() => {
    if (mode === "quick") return "quick_analysis";
    if (mode === "detailed") return "detailed_analysis";
    return null;
  }, [mode]);

  const splitIso = useCallback((iso) => {
    if (!iso) return { month: null, day: null };
    const [, m, d] = iso.split("-");
    return { month: Number(m), day: Number(d) };
  }, []);

  const pickPoint = useCallback(
    (coords) => {
      setMarkerPosition(coords);
      setCenter(coords);
      reverseGeocode(coords);
      setHasSelectedLocation(true);
    },
    []
  );




   
  const reverseGeocode = useCallback(async (coords) => {
    if (!coords) return;
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`;
    try {
      const res = await fetch(url, {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "weather-probability-app/1.0 (mailto:you@example.com)",
        },
      });
      const data = await res.json();
      setAddressLabel(data?.display_name || "No address found");
    } catch {
      setAddressLabel("Reverse geocode failed");
    }
  }, []);

  const onAnalyze = useCallback(async () => {
    if (!markerPosition) {
      setError("Pick a location first.");
      return;
    }
    if (!analysisMode) {
      setError('Choose a mode: "quick" or "detailed".');
      return;
    }
    const { month, day } = splitIso(selectedDate);
    if (!month || !day) {
      setError("Pick a date first.");
      return;
    }

    setLoading(true);
    setError("");

    setHasSelectedLocation(true);

    try {
      const json = await fetchWeatherProbability({
        lat: markerPosition.lat,
        lon: markerPosition.lng,
        month,
        day,
        analysisMode,
      });
      setResult(json);

      lastRunRef.current = {
        lat: markerPosition.lat,
        lng: markerPosition.lng,
        mode,
        date: selectedDate,
      };
    } catch (e) {
      setError(e?.message || "API request failed.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [markerPosition, selectedDate, analysisMode, mode, splitIso]);

  const readyToRun = !!markerPosition && !!mode && !!selectedDate;
  const isDirty = useMemo(() => {
    if (!readyToRun) return false;
    const currentSig = {
      lat: markerPosition?.lat ?? null,
      lng: markerPosition?.lng ?? null,
      mode,
      date: selectedDate,
    };
    if (!lastRunRef.current) return true;
    return JSON.stringify(currentSig) !== JSON.stringify(lastRunRef.current);
  }, [readyToRun, markerPosition, mode, selectedDate]);

  function ClickToSetMarker() {
    useMapEvents({
      click(e) {
        pickPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  }

  async function onSearch(query) {
    if (!query?.trim()) return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(
      query
    )}`;
    try {
      const res = await fetch(url, {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "weather-probability-app/1.0 (mailto:you@example.com)",
        },
      });
      const data = await res.json();
      if (!data?.length) return alert("No results");
      const coords = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
      pickPoint(coords);
    } catch (err) {
      console.error("Search error:", err);
      alert("Search failed.");
    }
  }

  // Auto-detect user location
  useEffect(() => {
    let cancelled = false;

    const useCoords = (coords) => {
      if (cancelled) return;
      setCenter(coords);
      setMarkerPosition(coords);
    };

    if (!navigator.geolocation) {
      useCoords(FALLBACK);
      return () => {};
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        useCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        useCoords(FALLBACK);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  if (!center)
    return <div className="grid h-screen place-items-center">Loading…</div>;

  return (
    <>
      {/* LoadingOverlay modal */}
      {loading && <LoadingOverlay mode={mode || "quick"} />}

      <div className="relative h-screen w-full">
        <Sidebar
          onSearch={onSearch}
          dateValue={selectedDate}
          onDateChange={setSelectedDate}
          mode={mode}
          onModeChange={setMode}
          onAnalyze={onAnalyze}
          analyzeLoading={loading}
          analyzeError={error}
          readyToRun={readyToRun}
          dirty={isDirty}
        />

        {hasSelectedLocation && (
          <ResultsPanel
            result={result}
            loading={loading}
            error={error}
            selectedDate={selectedDate}
            addressLabel={addressLabel}
            mode={mode}
            onViewFullReport={() => console.log("open full report")}
          />
        )}

        {/* Map */}
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={12}
          zoomControl={false}
          scrollWheelZoom
          className="h-full w-full"
        >
          <ZoomControl position="bottomright" />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Recenter center={center} />
          <ClickToSetMarker />
          {markerPosition && (
            <Marker position={[markerPosition.lat, markerPosition.lng]} icon={redIcon} />
          )}
        </MapContainer>
      </div>
    </>
  );
}
