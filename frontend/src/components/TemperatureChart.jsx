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
export default function TemperatureChart({ viz }) {
 
  const hasData =
    viz &&
    Array.isArray(viz.years) &&
    Array.isArray(viz.temperatures) &&
    viz.years.length > 0 &&
    viz.years.length === viz.temperatures.length;

  const data = useMemo(() => {
    if (!hasData) return { labels: [], datasets: [] };
    return {
      labels: viz.years,
      datasets: [
        {
          label: "Average temperature (°C)",
          data: (viz.temperatures ?? []).map(Number),
          borderColor: "#3b82f6",    
          backgroundColor: "#6366f1",
          borderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 20,
          tension: 0.2,           
        },
      ],
    };
  }, [hasData, viz]);

  const options = useMemo(
    () => ({
      responsive: false,          
      maintainAspectRatio: false,  
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.formattedValue} °C`,
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Years" },
          grid: { display: false },
        },
        y: {
          title: { display: true, text: "Temperature" },
          beginAtZero: true,
        },
      },
    }),
    []
  );

  if (!hasData) {
    return (
      <div style={{ fontSize: 12, color: "#6b7280", padding: 8 }}>
        No temperature data.
      </div>
    );
  }

 
  return (
    <div style={{ width: 480, height: 260 }}>
      <Line data={data} options={options} width={500} height={280} />
    </div>
  );
}
