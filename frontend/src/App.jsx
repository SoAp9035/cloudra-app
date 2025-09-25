// src/App.jsx
import React, { useEffect, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";


const FALLBACK = { lat: 37.7749, lng: -122.4194 }; // user blocks location

export default function App() {
  const [center, setCenter] = useState(null); // null until we know where to center
  const [marker, setMarker] = useState(null); // marker pin state


  // ask browser for your location once
  useEffect(() => {
    if (!navigator.geolocation) {
      setCenter(FALLBACK);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCenter(FALLBACK),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY} libraries={["places"]}>
      {/* if center is not ready → show loading */}
      {!center && (
        <div className="grid h-screen place-items-center">Loading map…</div>
      )}

      {/* if center is ready → show the map */}
      {center && (
        <Map
          id="main-map"
          defaultCenter={center}
          defaultZoom={12}
          gestureHandling="greedy"
          style={{ width: "100%", height: "100vh" }}
          onClick={(e) => {
            const ll = e?.detail?.latLng;
            if (!ll) return;

            const coords = { lat: ll.lat, lng: ll.lng };
            setMarker(coords); // store clicked position
          }}
        >{marker && <Marker position={marker} />}
        </Map>

      )}
    </APIProvider>
  );
}
