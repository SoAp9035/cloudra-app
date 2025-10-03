import { WiRain, WiStrongWind, WiHumidity, WiCloud, WiFog, WiSnow } from "react-icons/wi";
export default function ResultsPanel({
  result,
  loading,
  error,
  addressLabel,
  mode, // "quick" | "detailed"
}) {
  const stats = result?.weather_probabilities?.statistics || {};
  const probs = result?.weather_probabilities?.probabilities || {};
  const thresholds = result?.thresholds_info || {};
  const placeShort = addressLabel ? addressLabel.split(",")[0] : "—";
  const dataPoints = result?.analysis_summary?.data_points ?? null;
  const tempObj = stats?.temperature || null;
  const temp = pickNumber(tempObj);
  const tempRange = tempObj?.average_range || { min: null, max: null };
  const rainProb = pickNumber(
    probs?.rain ?? probs?.precipitation ?? probs?.heavy_precipitation_percent
  );

  const humidity = pickNumber(stats?.humidity);
  const cloud = pickNumber(stats?.cloud);
  const windVal = pickNumber(stats?.wind);
  const windUnit = unitOf(stats?.wind, "m/s");
  const fogScale = (stats?.fog && typeof stats.fog.scale === "number") ? stats.fog.scale : null;
  const fogText = (stats?.fog && typeof stats.fog.status === "string") ? stats.fog.status : null;
  const snowProb = pickNumber(probs?.snow ?? stats?.snow_cover_probability);
  const extremes = {
    "Heavy rain": probs?.heavy_rain ?? probs?.heavy_precipitation_percent,
    "Heavy snowfall": probs?.heavy_snowfall_percent ?? probs?.heavy_snowfall,
    "Very hot": probs?.very_hot,
    "Very cold": probs?.very_cold,
    "Very windy": probs?.very_windy,
    "Very uncomfortable": probs?.very_uncomfortable,
  };

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
      {/* Header */}
      <div className="px-4 pt-4 pb-2 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Weather Details</h2>
        <p className="text-[11px] text-gray-500 leading-snug">
          {addressLabel || "Please choose a location."}
        </p>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col items-stretch justify-start overflow-y-auto">
        {loading && <div className="text-xs text-gray-600 mb-2">Analyzing…</div>}
        {error && !loading && <div className="text-sm text-red-600 mb-2">Error: {error}</div>}

        {!loading && !error && result && (
          <>
            {/* Hero compact */}
            <div className="rounded-2xl p-4 bg-gradient-to-br bg-gradient-to-br from-green-300 to-teal-500

 text-white shadow mb-4">
              <div className="text-[11px] opacity-90 text-gray-900">Average Temperature</div>
              <div className="text-gray-900 text-xl font-bold leading-none mt-0.5">
                {typeof temp === "number" ? `${temp.toFixed(0)}°C` : "—"}
              </div>
              <div className="text-gray-900 text-[11px] mt-1.5 opacity-90">
                {placeShort} • max: {tempRange?.max ?? "—"}° • min: {tempRange?.min ?? "—"}°
              </div>
            </div>

            {/* QUICK */}
            {mode === "quick" && (
              <>
            <div className="grid grid-cols-1 gap-2 mb-2">
                  <MiniMetric
                    icon={<WiRain className="text-2xl text-teal-500" />}
                    label="Rain"
                    value={nOrDashPct(rainProb)}
                  />
                  <MiniMetric
                    icon={<WiStrongWind className="text-2xl text-teal-500" />}
                    label="Wind"
                    value={typeof windVal === "number" ? `${windVal} ${windUnit}` : "0"}
                  />
                  <MiniMetric
                    icon={<WiFog className="text-2xl text-teal-500" />}
                    label="Fog"
                    value={fogScale != null ? `${fogScale}` : "0"}
                    sub={fogText || undefined}
                  />
                  <MiniMetric
                    icon={<WiHumidity className="text-2xl text-teal-500" />}
                    label="Humidity"
                    value={nOrDashPct(humidity)}
                  />
                  <MiniMetric
                    icon={<WiCloud className="text-2xl text-teal-500" />}
                    label="Cloud"
                    value={nOrDashPct(cloud)}
                  />
                  <MiniMetric
                    icon={<WiSnow className="text-2xl text-teal-500" />}
                    label="Snow Cover"
                    value={nOrDashPct(snowProb)}
                  />
                </div>


                <FooterLine dataPoints={dataPoints} mode={mode} />
              </>
            )}

            {/* DETAILED */}
            {mode === "detailed" && (
              <>
                <div className="grid grid-cols-1 gap-2 mb-2">
                  <MiniMetric
                    icon={<WiRain className="text-2xl text-teal-500" />}
                    label="Rain"
                    value={nOrDashPct(rainProb)}
                  />
                  <MiniMetric
                    icon={<WiStrongWind className="text-2xl text-teal-500" />}
                    label="Wind"
                    value={typeof windVal === "number" ? `${windVal} ${windUnit}` : "0"}
                  />
                  <MiniMetric
                    icon={<WiFog className="text-2xl text-teal-500" />}
                    label="Fog"
                    value={fogScale != null ? `${fogScale}` : "0"}
                    sub={fogText || undefined}
                  />
                  <MiniMetric
                    icon={<WiHumidity className="text-2xl text-teal-500" />}
                    label="Humidity"
                    value={nOrDashPct(humidity)}
                  />
                  <MiniMetric
                    icon={<WiCloud className="text-2xl text-teal-500" />}
                    label="Cloud"
                    value={nOrDashPct(cloud)}
                  />
                  <MiniMetric
                    icon={<WiSnow className="text-2xl text-teal-500" />}
                    label="Snow Cover"
                    value={nOrDashPct(snowProb)}
                  />
                </div>


                {/* Extremes */}
                <SectionTitle>Extremes</SectionTitle>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {Object.entries(extremes)
                    .filter(([, v]) => typeof pickNumber(v) === "number" && pickNumber(v) > 0)
                    .map(([k, v]) => (
                      <Badge key={k} label={k} value={`${Math.round(pickNumber(v))}%`} />
                    ))}
                  {Object.entries(extremes).every(([, v]) => !(typeof pickNumber(v) === "number" && pickNumber(v) > 0)) && (
                    <div className="text-[11px] text-gray-500">No notable extremes.</div>
                  )}
                </div>

                {/* Context */}
                <SectionTitle>Context</SectionTitle>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-2">
                  <div className="text-xs">
                    <span className="text-gray-600">Climate:</span>{" "}
                    <span className="font-semibold text-gray-900">
                      {thresholds?.climate_zone ?? "—"}
                    </span>
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
                          {prettyKey(k)}:{" "}
                          <span className="font-semibold">
                            {typeof v === "object" && v
                              ? `${v.value}${v.unit ? ` ${v.unit}` : ""}`
                              : String(v)}
                          </span>
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
  return <div className="text-[11px] font-semibold text-gray-700 mt-1.5 mb-1">{children}</div>;
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
    <div className="text-[10px] text-gray-500 mt-3">
      Data points: {dataPoints ?? "—"} • Mode: {mode}
    </div>
  );
}

/* ---------- helpers ---------- */
// Read a number out of many possible API shapes
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
  return (x && typeof x === "object" && typeof x.unit === "string") ? x.unit : fallback;
}


function nOrDashPct(x) {
  const n = pickNumber(x);
  return (typeof n === "number") ? `${n}%` : "0";
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
