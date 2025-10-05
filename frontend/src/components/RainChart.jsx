// src/components/RainChart.jsx
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js parts used by this chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function RainChart({ viz }) {
  // 1) Normalize & validate incoming data
  const years = Array.isArray(viz?.years) ? viz.years : [];
  const values = Array.isArray(viz?.rain_probabilities)
    ? viz.rain_probabilities.map(Number)
    : [];

  const hasData = years.length > 0 && years.length === values.length;

  // 2) Prepare dataset
  const data = useMemo(() => {
    if (!hasData) return { labels: [], datasets: [] };
    return {
      labels: years,
      datasets: [
        {
          label: "Rain (mm/day)",
          data: values,
          backgroundColor: "rgba(59,130,246,0.6)", // blue bars
          borderColor: "#3b82f6",
          borderWidth: 1,
          borderRadius: 4,
          hoverBackgroundColor: "rgba(59,130,246,0.8)",
        },
      ],
    };
  }, [hasData, years, values]);

  // 3) Options (axes + tooltip)
  const options = useMemo(() => {
    const maxVal = values.length ? Math.max(...values) : 0;
    const suggestedMax = maxVal > 0 ? Math.ceil(maxVal * 1.15) : undefined;

    return {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.formattedValue} mm/day`,
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Years" },
          grid: { display: false },
        },
        y: {
          title: { display: true, text: "mm/day" },
          beginAtZero: true,
          suggestedMax,
        },
      },
    };
  }, [values]);

 
  if (!hasData) {
    return <div style={{ fontSize: 12, color: "#6b7280", padding: 8 }}>No rain data.</div>;
  }
 
  return (
    <div style={{ width: 480, height: 260 }}>
      <Bar data={data} options={options} width={480} height={260} />
    </div>
  );
}
