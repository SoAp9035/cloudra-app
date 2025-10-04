// src/App.jsx

import { fetchWeatherProbability } from "./components/apiClient";
import ResultsPanel from "./components/ResultsPanel.jsx";
import LoadingOverlay from "./components/LoadingOverlay.jsx";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import Sidebar from "./components/Sidebar.jsx";

// fallback center
const FALLBACK = { lat: 37.7749, lng: -122.4194 };

// simple ISO today
const todayISO = () => new Date().toISOString().slice(0, 10);

// red marker
const redIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// keep map in sync with center
function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView([center.lat, center.lng]);
  }, [center, map]);
  return null;
}

export default function App() {
  // map state
  const [center, setCenter] = useState(null);
  const [markerClick, setMarkerClick] = useState(null);
  const [markerSearch, setMarkerSearch] = useState(null);

  // UI state
  const [addressLabel, setAddressLabel] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [mode, setMode] = useState("quick"); // "quick" | "detailed"

  // API state
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function mapAnalysisMode(uiMode) {
    return uiMode === "quick" ? "quick_analysis" : "detailed_analysis";
  }

  // helper: split ISO date
  function splitIso(iso /* "YYYY-MM-DD" */) {
    if (!iso) return { month: null, day: null };
    const [, m, d] = iso.split("-");
    return { month: Number(m), day: Number(d) };
  }

  // Analyze action
  async function onAnalyze() {
    const point = (markerClick ?? markerSearch) || center;
    if (!point) return alert("Pick a location first.");
    const { month, day } = splitIso(selectedDate);
    if (!month || !day) return alert("Pick a date first.");

    const analysisMode = mapAnalysisMode(mode);
    setLoading(true);
    setError("");
    try {
      const json = await fetchWeatherProbability({
        lat: point.lat,
        lon: point.lng,
        month,
        day,
        analysisMode,
      });
      console.log("API result:", json);
      setResult(json);
    } catch (e) {
      console.error(e);
      setError(e.message || "API request failed.");
    } finally {
      setLoading(false);
    }
  }

  // reverse geocode (coords -> address)
  async function reverseGeocode(coords) {
    if (!coords) return;
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`;
    try {
      const res = await fetch(url, { headers: { "Accept-Language": "en" } });
      const data = await res.json();
      setAddressLabel(data?.display_name || "No address found");
    } catch (e) {
      console.error("Reverse error:", e);
      setAddressLabel("Reverse geocode failed");
    }
  }

  // one path for chosen point
  function pickPoint(coords, source) {
    if (source === "click") setMarkerClick(coords);
    if (source === "search") setMarkerSearch(coords);
    setCenter(coords);
    reverseGeocode(coords);
    console.log("chosen:", coords, "date:", selectedDate, "mode:", mode);
  }

  // geolocation once
  useEffect(() => {
    if (!navigator.geolocation) {
      setCenter(FALLBACK);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCenter(FALLBACK),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // map click
  function ClickToSetMarker() {
    useMapEvents({
      click(e) {
        pickPoint({ lat: e.latlng.lat, lng: e.latlng.lng }, "click");
      },
    });
    return null;
  }

  // Nominatim search
  async function onSearch(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(
      query
    )}`;
    try {
      const res = await fetch(url, { headers: { "Accept-Language": "en" } });
      const data = await res.json();
      if (!data?.length) {
        alert("No results");
        return;
      }
      const first = data[0];
      const coords = {
        lat: parseFloat(first.lat),
        lng: parseFloat(first.lon),
      };
      pickPoint(coords, "search");
    } catch (err) {
      console.error("Search error:", err);
    }
  }

  if (!center) return <div className="grid h-screen place-items-center">Loading…</div>;

  return (<>
      {loading && <LoadingOverlay message="Analyzing weather…" />}
    <div className="relative h-screen w-full">

      {/* Controls sidebar (left) */}
      <Sidebar
        onSearch={onSearch}
        dateValue={selectedDate}
        onDateChange={setSelectedDate}
        mode={mode}
        onModeChange={setMode}
        onAnalyze={onAnalyze}
        analyzeLoading={loading}
        analyzeError={error}
      />

 
      {/* Results panel (right) */}
      <ResultsPanel
        result={result}
        loading={loading}
        error={error}
        selectedDate={selectedDate}
        addressLabel={addressLabel}
        mode={mode}
        onViewFullReport={() => {
          console.log("open full report");
        }}
      />

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

        {markerClick && (
          <Marker position={[markerClick.lat, markerClick.lng]} icon={redIcon} />
        )}
        {markerSearch && (
          <Marker position={[markerSearch.lat, markerSearch.lng]} icon={redIcon} />
        )}
      </MapContainer>
    </div>
    </>
  );
}
