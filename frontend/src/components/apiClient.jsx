export async function fetchWeatherProbability({ lat, lon, month, day, analysisMode }) {
  const base = import.meta.env.VITE_API_BASE;
  const qs = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    month: String(month),
    day: String(day),
    analysis_mode: analysisMode, // "quick_analysis" | "detailed_analysis"
  });
  const url = `${base}/api/weather_probability?${qs.toString()}`;

  const res = await fetch(url, { headers: { Accept: "application/json", "Access-Control-Allow-Origin": "*" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${text || res.statusText}`);
  }
  return res.json();
}
