export async function fetchWeatherProbability({ lat, lon, month, day, analysisMode }) {
  // Remove trailing slash from base URL to avoid double slashes
  const base = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '');
  const qs = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    month: String(month),
    day: String(day),
    analysis_mode: analysisMode, // "quick_analysis" | "detailed_analysis"
  });
  const url = `${base}/api/weather_probability?${qs.toString()}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${text || res.statusText}`);
  }
  return res.json();
}
