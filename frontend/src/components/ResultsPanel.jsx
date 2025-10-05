import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import rainGif from "../assets/logo/rain.gif";
import windGif from "../assets/logo/wind.gif";
import fogGif from "../assets/logo/fog.gif";
import humidityGif from "../assets/logo/humidity.gif";
import cloudGif from "../assets/logo/cloud.gif";
import snowGif from "../assets/logo/snow.gif";
import cloudyGif from "../assets/logo/cloudy.gif";
import TemperatureChart from "./TemperatureChart.jsx";
import HumidityChart from "./HumidityChart.jsx";
import RainChart from "./RainChart.jsx";

export default function ResultsPanel({
  result,
  loading,
  error,
  addressLabel,
  selectedDate,
}) {
  /* -------------------- Derive common data from API response -------------------- */
  const stats = result?.weather_probabilities?.statistics || {};
  const probs = result?.weather_probabilities?.probabilities || {};
  const thresholds = result?.thresholds_info || {};

  const placeShort = addressLabel ? addressLabel.split(",")[0] : "—";

  // temperature (current/avg and range)
  const tempObj = stats?.temperature || null;
  const temp = pickNumber(tempObj);
  const tempRange = {
    max: stats?.temperature?.average_range?.max ?? null,
    min: stats?.temperature?.average_range?.min ?? null,
  };

  // other mini metrics
  const rainProb = stats?.rain?.probability ?? null;
  const snowProb =
    pickNumber(stats?.snow_cover) ??
    pickNumber(probs?.snow ?? stats?.snow_cover_probability);
  const humidity = pickNumber(stats?.humidity);
  const cloud = pickNumber(stats?.cloud);
  const windVal = pickNumber(stats?.wind);
  const windUnit = unitOf(stats?.wind, "km/h");
  const fogScale = stats?.fog?.scale ?? null;
  const fogText = stats?.fog?.status ?? null;

  // extremes badges
  const extremesRaw = {
    "Heavy rain": probs?.heavy_precipitation_percent,
    "Heavy snowfall": probs?.heavy_snowfall_percent,
    "Very hot": probs?.very_hot_percent,
    "Very cold": probs?.very_cold_percent,
    "Very windy": probs?.very_windy_percent,
    "Very uncomfortable": probs?.uncomfortable_percent,
  };
  const extremes = Object.entries(extremesRaw).map(([k, v]) => [k, pickNumber(v)]);

  // charts visualizations from API
  const vizTemp =
    result?.visualizations?.temperature ??
    null;

    
    const vizHumidity = result?.visualizations?.humidity ?? null;
const vizRain = result?.visualizations?.rain ?? null;



 


  /* -------------------- UI state -------------------- */
  const [modal, setModal] = useState(null);        // "combined" | null
  const [chartTab, setChartTab] = useState("temp"); // "temp" | "humidity" | "rain"

  /* -------------------- Utilities -------------------- */
  // Download the full API result as JSON
  function handleDownloadJSON() {
    if (!result) return;
    const safePlace = (addressLabel || "location")
      .split(",")[0]
      .trim()
      .replace(/[^\w\-]+/g, "_");
    const dateStr = selectedDate || "date";
    const filename = `weather_${dateStr}_${safePlace}.json`;

    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Tab button style helper
  function tabBtnClass(name) {
    const base =
      "px-3 py-1.5 text-xs font-semibold rounded-full border transition";
    const inactive =
      "bg-white text-gray-700 border-gray-200 hover:text-[#1E3A8A] hover:border-[#1E3A8A]";
    const active =
      "bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-transparent shadow";
    return `${base} ${chartTab === name ? active : inactive}`;
  }

  /* -------------------- Render -------------------- */
  return (
    <aside
      className="
        absolute right-0 top-0 z-[1001]
        h-full w-[340px] max-w-[88vw]
        backdrop-blur
        border-l border-gray-200
        shadow-xl flex flex-col
      "
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-800">
          <span className="text-2xl">Weather Details</span>
        </h2>
        <p className="text-[11px] text-gray-500 leading-snug">
          {addressLabel || "Please choose a location."}
        </p>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col items-center justify-start overflow-y-auto">
        {loading && <div className="text-xs text-gray-600 mb-2">Analyzing…</div>}
        {error && !loading && (
          <div className="text-sm text-red-600 mb-2">Error: {error}</div>
        )}

        {!loading && !error && result && (
          <>
            {/* Hero card */}
            <div className="flex flex-col mb-5 items-center justify-center w-56 h-48 p-4 bg-gradient-to-br from-sky-500 to-indigo-500 text-white rounded-2xl shadow">
              <div className="-translate-y-4 flex flex-col items-center">
                <div className="text-4xl mt-10 mb-7">
                  <img src={cloudyGif} alt="Temperature" className="w-20 h-20" />
                </div>
                <div className="text-4xl font-bold -mt-4">
                  {typeof temp === "number" ? `${Math.round(temp)}°C` : "No Data."}
                </div>
                <div className="flex flex-col items-center mt-auto space-y-1">
                  <div className="text-sm">
                    max: {tempRange.max ?? "—"} • min: {tempRange.min ?? "—"}
                  </div>
                  <div className="text-xs opacity-80">{placeShort}</div>
                </div>
              </div>
            </div>

            {/* Mini metrics */}
            <div className="grid mb-4 grid-cols-1 gap-2">
              <MiniMetric
                icon={<img src={rainGif} alt="Rain" className="w-4 h-4 " />}
                label="Rain"
                value={nOrDashPct(rainProb)}
              />
              <MiniMetric
                icon={<img src={windGif} alt="Wind" className="w-4 h-4" />}
                label="Wind"
                value={formatWind(windVal, windUnit, true)}
              />
              <MiniMetric
                icon={<img src={fogGif} alt="Fog" className="w-4 h-4" />}
                label="Fog"
                value={fogScale != null ? fogText ?? "—" : "—"}
              />
              <MiniMetric
                icon={<img src={humidityGif} alt="Humidity" className="w-4 h-4" />}
                label="Humidity"
                value={nOrDashPct(humidity)}
              />
              <MiniMetric
                icon={<img src={cloudGif} alt="Cloud" className="w-4 h-4" />}
                label="Cloud"
                value={nOrDashPct(cloud)}
              />
              <MiniMetric
                icon={<img src={snowGif} alt="Snow" className="w-4 h-4" />}
                label="Snow Cover"
                value={nOrDashPct(snowProb)}
              />
            </div>

            {/* Open modal once */}
            <button
              type="button"
              onClick={() => setModal("combined")}
              className="flex-1 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white text-base font-semibold py-2 px-6 shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              View Details
            </button>

            {/* Tiny footer line with JSON download */}
            <FooterLine onDownload={handleDownloadJSON} />
          </>
        )}
      </div>

      {/* Combined Modal */}
      <Modal
        open={modal === "combined"}
        onClose={() => setModal(null)}
        title="Weather Details"
      >
        <div className="space-y-4">
          {/* Extremes */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Extremes</h4>
            <div className="flex flex-wrap gap-1.5">
              {extremes
                .filter(([, n]) => typeof n === "number" && n > 0)
                .map(([k, n]) => (
                  <Badge key={k} label={k} value={`${Math.round(n)}%`} />
                ))}
              {extremes.every(([, n]) => !(typeof n === "number" && n > 0)) && (
                <div className="text-sm text-gray-600">No notable extremes.</div>
              )}
            </div>
          </div>

          {/* Context */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Context</h4>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-600">Climate: </span>
                <span className="font-semibold">
                  {thresholds?.climate_zone ?? "—"}
                </span>
              </div>
              <div className="text-sm">
                <div className="text-gray-600 mb-1">Thresholds:</div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(thresholds?.thresholds_used || {}).map(([k, v]) => (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-white text-gray-800 border border-gray-200"
                      title={k}
                    >
                      {prettyKey(k)}:{" "}
                      <span className="font-semibold">
                        {typeof v === "object" && v
                          ? `${v.value ?? "—"}${v.unit ? ` ${v.unit}` : ""}`
                          : String(v)}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Charts (Tabs) */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Charts</h4>

            {/* Tabs header */}
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                className={tabBtnClass("temp")}
                onClick={() => setChartTab("temp")}
                title="Show temperature trend"
              >
                Temperature
              </button>
              <button
                type="button"
                className={tabBtnClass("humidity")}
                onClick={() => setChartTab("humidity")}
                title="Show humidity"
              >
                Humidity
              </button>
              <button
                type="button"
                className={tabBtnClass("rain")}
                onClick={() => setChartTab("rain")}
                title="Show rain"
              >
                Rain
              </button>
            </div>

            {/* Tab panel */}
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              {/* Temperature tab */}
              {chartTab === "temp" &&
                (vizTemp?.years?.length && vizTemp?.temperatures?.length ? (
                  <>
                    <TemperatureChart viz={vizTemp} />
                    <div className="text-[10px] text-gray-500 mt-2">
                      Showing {vizTemp.years.length} years.
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-500">No temperature data.</div>
                ))}

              {/* Humidity tab */}
              {chartTab === "humidity" &&
                (vizHumidity ? (
                  <HumidityChart viz={vizHumidity} />
                ) : (
                  <div className="text-xs text-gray-500">No humidity data.</div>
                ))}

              {/* Rain tab */}
              {chartTab === "rain" &&
                (vizRain ? (
                  <RainChart viz={vizRain} />
                ) : (
                  <div className="text-xs text-gray-500">No rain data.</div>
                ))}
            </div>
          </div>
        </div>
      </Modal>
    </aside>
  );
}

/* ---------- Modal ---------- */
function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const modalUI = (
    <div
      className="fixed inset-0 z-[3000] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-[min(95vw,580px)] rounded-2xl bg-white shadow-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        <div className="text-gray-800">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalUI, document.body);
}

/* ---------- UI Elements ---------- */
function MiniMetric({ icon, label, value, sub }) {
  return (
    <div className="w-60 border border-gray-200 bg-white p-2.5 shadow-sm rounded-full">
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

function Badge({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
      {label} <span className="text-indigo-800">{value}</span>
    </span>
  );
}

function FooterLine({ onDownload }) {
  return (
    <div className="text-[10px] text-gray-500 mt-3">
      <button
        type="button"
        onClick={onDownload}
        className="text-[10px] text-gray-500 hover:text-gray-700 underline-offset-2 appearance-none bg-transparent p-0 border-0 cursor-pointer"
        title="Download full JSON response"
      >
        Download JSON
      </button>
    </div>
  );
}

/* ---------- Helpers ---------- */
function pickNumber(x) {
  if (x == null) return null;
  if (typeof x === "number") return x;
  if (typeof x === "object") {
    if (typeof x.value === "number") return x.value;
    if (typeof x.probability === "number") return x.probability;
    if (typeof x.average === "number") return x.average;
    if (typeof x.average_speed === "number") return x.average_speed;
  }
  return null;
}
function unitOf(x, fallback = "") {
  return x && typeof x === "object" && typeof x.unit === "string" ? x.unit : fallback;
}
function nOrDashPct(x) {
  const n = pickNumber(x);
  return typeof n === "number" ? `${Math.round(n)}%` : "—";
}
function formatWind(val, unit = "m/s", withPrecision = false) {
  if (typeof val !== "number") return "—";
  const num = withPrecision ? val.toFixed(1) : Math.round(val);
  return `${num} ${unit}`;
}
function prettyKey(k) {
  const map = {
    comfortable_max: "Comfortable max",
    comfort_temp_max: "Comfortable max",
    heavy_precipitation: "Heavy precipitation",
    very_cold: "Very cold",
    very_hot: "Very hot",
    very_windy: "Very windy",
  };
  return map[k] || k.replace(/_/g, " ");
}
