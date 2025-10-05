import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);
export default function HumidityChart({ viz }) {
  const years = Array.isArray(viz?.years) ? viz.years : [];
  const values = Array.isArray(viz?.humidity_levels) ? viz.humidity_levels.map(Number) : [];
  const hasData = years.length > 0 && years.length === values.length;
  const data = useMemo(() => {
    if (!hasData) return { labels: [], datasets: [] };
    return {
      labels: years,
      datasets: [
        {
          label: "Rain (mm/day)",
          data: values,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.15)",
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 4,
          tension: 0.2,
        },
      ],
    };
  }, [hasData, years, values]);

  
  const options = useMemo(() => ({
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.formattedValue}`,  
        },
      },
    },
    scales: {
      x: { title: { display: true, text: "Years" }, grid: { display: false } },
      y: { title: { display: true, text: "mm/day" }, beginAtZero: true },
    },
  }), []);

  if (!hasData) {
    return <div style={{ fontSize: 12, color: "#6b7280", padding: 8 }}>No rain data.</div>;
  }

  return (
    <div style={{ width: 480, height: 260 }}>
      <Line data={data} options={options} width={480} height={260} />
    </div>
  );
}
