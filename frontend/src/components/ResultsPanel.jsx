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




  // detailed extras

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
  const placeShort = addressLabel ? addressLabel.split(",")[0] : "0";

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
        <h2 className="text-base font-bold text-gray-800">
          <span className="text-2xl">
            Weather Details
          </span>
        </h2>
        <p className="text-[11px] text-gray-500 leading-snug">
          {addressLabel || "Please choose a location."}
        </p>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col items-center justify-start overflow-y-auto">
        {loading && <div className="text-xs text-gray-600 mb-2">Analyzing…</div>}
        {error && !loading && <div className="text-sm text-red-600 mb-2"  >Error: {error}</div>}

        {!loading && !error && result && (
          <>
            {/* Hero compact */}
            <div className="flex p-5 flex-col mb-5 items-center justify-between w-50 h-60 p-4 bg-gradient-to-br from-sky-500 to-indigo-500 text-white rounded-2xl shadow">
              <div className="text-4xl mt-3 mb-7">🌧️</div>
              <div className="text-4xl font-bold">
                {typeof temp === "number" ? `${temp.toFixed(0)}°C` : "No Data."}
              </div>
              <div className="flex flex-col items-center mt-auto space-y-1">
                <div className="text-md">{selectedDate || "0"}</div>
                <div className="text-xs opacity-80">{placeShort}</div>
              </div>
            </div>


            {/* QUICK: tiny metric cards (2 columns) */}
            {mode === "quick" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <MiniMetric icon="🌧️" label="Rain" value={
                    nOrDashPct(rainProb)
                  } />
                  <MiniMetric icon="🌬️" label="Wind" value={
                    typeof windMs === "number" ? `${windMs} m/s` : "0"
                  } />

                  <MiniMetric icon="💧" label="Humidity" value={
                    nOrDashPct(humidity)
                  } />
                </div>

                <FooterLine dataPoints={dataPoints} mode={mode} />
              </>
            )}

            {/* DETAILED: compact grid + extras */}
            {mode === "detailed" && (
              <>
                {/* core */}
                <div className="grid mb-5 grid-cols-2 gap-2">
                  <MiniMetric icon="🌧️" label="Rain" value={nOrDashPct(rainProb)} />
                  <MiniMetric icon="🌬️" label="Wind" value={
                    typeof windMs === "number" ? `${windMs.toFixed(1)} m/s` : "0"
                  } />


                  <MiniMetric
                    icon="🌫️"
                    label="Fog"
                    value={
                      typeof stats?.fog?.status === "number"
                        ? `${stats.fog.status}/3`
                        : "0"
                    }


                  />
                  <MiniMetric icon="💧" label="Humidity" value={nOrDashPct(humidity)} />
                  <MiniMetric icon="☁️" label="Cloud" value={nOrDashPct(cloud)} />
                  <MiniMetric icon="❄️" label="Snow Cover" value={nOrDashPct(snowProb)} />

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
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-2">
                  <div className="text-xs">
                    <span className="text-gray-600">Climate:</span>{" "}
                    <span className="font-semibold text-gray-900">{thresholds?.climate_zone ?? "—"}</span>
                  </div>

                  <div className="text-xs">
                    <div className="text-gray-600 mb-1">Thresholds:</div>
                    <div className="flex flex-wrap gap-1.5">

                      {Object.entries(thresholds?.thresholds_used || {}).map(([k, v]) => (
                        <span
                          key={k}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white text-gray-800 border border-gray-200"
                          title={k}
                        >
                          {prettyKey(k)}: <span className="font-semibold">{v}</span>
                        </span>
                      ))}


                    </div>
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
        <span className="text-xs font-semibold text-gray-900">{value}</span>
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
      Data points: {dataPoints ?? "0"} • Mode: {mode}
    </div>
  );
}

/* ---------- helpers ---------- */

function nOrDashPct(n) {
  return typeof n === "number" ? `${n}%` : "0";
}


function prettyKey(k) {
  const map = {
    comfortable_max: "Comfortable max",
    heavy_precipitation: "Heavy precipitation",
    very_cold: "Very cold",
    very_hot: "Very hot",
    very_windy: "Very windy",
  };
  return map[k] || k.replace(/_/g, " ");
}


// function formatThresholds(t) {
//   if (!t || typeof t !== "object") return "0";
//   try {
//     const pairs = Object.entries(t).map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`);
//     return pairs.join(" • ");
//   } catch {
//     return "0";
//   }
// }
