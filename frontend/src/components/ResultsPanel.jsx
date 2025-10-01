// src/components/ResultsPanel.jsx
import React from "react";

export default function ResultsPanel({
  result,
  loading,
  error,
  selectedDate,
  addressLabel,
  mode, // "quick" | "detailed"
}) {
  const stats = result?.weather_probabilities?.statistics || {};
  const probs = result?.weather_probabilities?.probabilities || {};
  const thresholds = result?.thresholds_info || {};

  // core metrics
  const temp =
    stats?.temperature?.average ??
    stats?.temperature ??
    null;

  const rainProb =
    probs?.rain ??
    probs?.precipitation ??
    probs?.heavy_precipitation_percent ??
    null;

  const humidity =
    stats?.humidity?.average ??
    stats?.humidity ??
    null;

  const windMs =
    stats?.wind?.average_speed ??
    stats?.wind?.speed ??
    (typeof stats?.wind === "number" ? stats?.wind : null);
  const windKmh = typeof windMs === "number" ? windMs * 3.6 : null;

  // detailed extras
  const uvIndex = stats?.uv_index ?? stats?.uv ?? null;
  const airQuality = stats?.air_quality?.index ?? stats?.aqi ?? null;
  const cloud =
    stats?.cloud?.average ??
    stats?.cloud?.cover ??
    stats?.cloudiness ??
    null;
  const snowProb =
    probs?.snow ??
    stats?.snow_cover_probability ??
    null;

  const extremes = {
    "Heavy rain": probs?.heavy_rain ?? probs?.heavy_precipitation_percent,
    "Heavy snowfall": probs?.heavy_snowfall_percent ?? probs?.heavy_snowfall,
    "Very hot": probs?.very_hot,
    "Very cold": probs?.very_cold,
    "Very windy": probs?.very_windy,
    "Very uncomfortable": probs?.very_uncomfortable,
  };

  const dataPoints = result?.analysis_summary?.data_points ?? null;
  const placeShort = addressLabel ? addressLabel.split(",")[0] : "—";

  return (
    <aside
      className="
        absolute right-0 top-0 z-[1001]
        h-full w-[340px] max-w-[88vw]
        bg-white/95 backdrop-blur
        border-l border-gray-200
        shadow-xl flex flex-col
      "
    >
      {/* Header (smaller spacing) */}
      <div className="px-4 pt-4 pb-2 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Weather Details</h2>
        <p className="text-[11px] text-gray-500 leading-snug">
          {addressLabel || "—"}
        </p>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {loading && <div className="text-sm text-gray-600">Analyzing…</div>}
        {error && !loading && <div className="text-sm text-red-600">Error: {error}</div>}

        {!loading && !error && result && (
          <>
            {/* Hero compact */}
            <div className="rounded-2xl p-4 bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow">
              <div className="text-[11px] opacity-90">Average Temperature</div>
              <div className="text-3xl font-bold leading-none mt-0.5">
                {typeof temp === "number" ? `${temp.toFixed(0)}°C` : "—"}
              </div>
              <div className="text-[11px] mt-1.5 opacity-90">
                {placeShort} • {selectedDate || "—"}
              </div>
            </div>

            {/* QUICK: tiny metric cards (2 columns) */}
            {mode === "quick" && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <MiniMetric icon="🌧️" label="Rain" value={
                    nOrDashPct(rainProb)
                  }/>
                  <MiniMetric icon="🌬️" label="Wind" value={
                    typeof windKmh === "number" ? `${windKmh.toFixed(1)} km/h` : "—"
                  }/>
                  <MiniMetric icon="💧" label="Humidity" value={
                    nOrDashPct(humidity)
                  }/>
                </div>

                <FooterLine dataPoints={dataPoints} mode={mode} />
              </>
            )}

            {/* DETAILED: compact grid + extras */}
            {mode === "detailed" && (
              <>
                {/* core */}
                <div className="grid grid-cols-2 gap-2">
                  <MiniMetric icon="🌧️" label="Rain" value={nOrDashPct(rainProb)} />
                  <MiniMetric icon="🌬️" label="Wind" value={
                    typeof windKmh === "number" ? `${windKmh.toFixed(1)} km/h` : "—"
                  } />
                  <MiniMetric icon="💧" label="Humidity" value={nOrDashPct(humidity)} />
                  <MiniMetric icon="☁️" label="Cloudiness" value={nOrDashPct(cloud)} />
                </div>

                {/* extras */}
                <div className="grid grid-cols-2 gap-2">
                  <MiniMetric icon="❄️" label="Snow Cover" value={nOrDashPct(snowProb)} />
                  <MiniMetric icon="🌞" label="UV Index" value={nOrDashRaw(uvIndex)} />
                  <MiniMetric icon="🫧" label="Air Quality" value={nOrDashRaw(airQuality)} />
                </div>

                {/* Extremes badges (very small) */}
                <SectionTitle>Extremes</SectionTitle>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(extremes)
                    .filter(([, v]) => typeof v === "number" && v > 0)
                    .map(([k, v]) => (
                      <Badge key={k} label={`${k}`} value={`${Math.round(v)}%`} />
                    ))}
                  {Object.entries(extremes).every(([, v]) => !(typeof v === "number" && v > 0)) && (
                    <div className="text-[11px] text-gray-500">No notable extremes.</div>
                  )}
                </div>

                {/* Context (tiny text) */}
                <SectionTitle>Context</SectionTitle>
                <div className="text-[11px] text-gray-600 space-y-0.5">
                  <div>Climate: <span className="font-medium">{thresholds?.climate_zone ?? "—"}</span></div>
                  <div className="break-words">
                    Thresholds: <span className="font-medium">{formatThresholds(thresholds?.thresholds_used)}</span>
                  </div>
                </div>

                <FooterLine dataPoints={dataPoints} mode={mode} />
              </>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

/* ---------- tiny UI atoms ---------- */

function MiniMetric({ icon, label, value, sub }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-gray-600 flex items-center gap-1">
          <span className="text-xs leading-none">{icon}</span>
          {label}
        </span>
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      </div>
      {sub && <div className="text-[10px] text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

function SectionTitle({ children }) {
  return <div className="text-[11px] font-semibold text-gray-700 mt-1.5">{children}</div>;
}

function Badge({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
      {label} <span className="text-indigo-800">{value}</span>
    </span>
  );
}

function FooterLine({ dataPoints, mode }) {
  return (
    <div className="text-[10px] text-gray-500">
      Data points: {dataPoints ?? "—"} • Mode: {mode}
    </div>
  );
}

/* ---------- helpers ---------- */

function nOrDashPct(n) {
  return typeof n === "number" ? `${Math.round(n)}%` : "—";
}
function nOrDashRaw(n) {
  return typeof n === "number" ? String(n) : "—";
}
function formatThresholds(t) {
  if (!t || typeof t !== "object") return "—";
  try {
    const pairs = Object.entries(t).map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`);
    return pairs.join(" • ");
  } catch {
    return "—";
  }
}
