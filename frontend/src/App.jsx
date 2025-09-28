import React, { useEffect, useState } from "react";
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

  // sidebar state
  const [addressLabel, setAddressLabel] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [mode, setMode] = useState("current"); // now | hourly | daily | air

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
    // later: call Flask weather with { coords, selectedDate, mode }
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

  return (
    <div className="relative h-screen w-full">
      {/* Sidebar overlay */}
      <Sidebar
        onSearch={onSearch}
        dateValue={selectedDate}
        onDateChange={setSelectedDate}
        mode={mode}
        onModeChange={setMode}
      />

      {/* Address toast/card (top-right) */}
      {addressLabel && (
        <div className="absolute z-[1001] top-3 right-3 max-w-[360px]">
          <div
            className="bg-white border border-gray-200 rounded-lg p-3 shadow text-sm leading-tight"
            title={addressLabel}
          >
            <div className="font-semibold mb-1">Location address</div>
            <div className="text-gray-700 break-words">{addressLabel}</div>
          </div>
        </div>
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

        {markerClick && (
          <Marker position={[markerClick.lat, markerClick.lng]} icon={redIcon} />
        )}
        {markerSearch && (
          <Marker position={[markerSearch.lat, markerSearch.lng]} icon={redIcon} />
        )}
      </MapContainer>
    </div>
  );
}
