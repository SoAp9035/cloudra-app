// src/components/LoadingOverlay.jsx
import React, { useEffect, useState } from "react";
import { FaCloudRain } from "react-icons/fa";

export default function LoadingOverlay({
  message = "Analyzing weather…",
  Icon = FaCloudRain,
  mode = "quick" // "quick" or "detailed"
}) {
  // Lock scroll when overlay is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Initialize countdown timer depending on mode
  const [secondsLeft, setSecondsLeft] = useState(
    mode === "quick" ? 30 : 60
  );

  // Countdown logic: decrease seconds every 1s
  useEffect(() => {
    if (secondsLeft <= 0) return;  
    const id = setInterval(() => {
      setSecondsLeft(s => s - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  return (
    <>
      <style>{`
        @keyframes bounceSmooth {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
          25% { transform: translateY(-6px) scale(1.05) rotate(-3deg); opacity: 0.9; }
          50% { transform: translateY(-12px) scale(1.1) rotate(3deg); opacity: 1; }
          75% { transform: translateY(-6px) scale(1.05) rotate(-2deg); opacity: 0.95; }
        }
        .animate-bounce-smooth {
          animation: bounceSmooth 2s ease-in-out infinite;
        }
        @keyframes pulseDots {
          0%, 80%, 100% { opacity: .2; }
          40% { opacity: 1; }
        }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Loading"
        className="
          fixed inset-0 z-[3000] 
          flex items-center justify-center 
          bg-black/40 backdrop-blur-sm
          pointer-events-auto
        "
      >
        <div className="rounded-2xl bg-white/90 shadow-xl p-6 w-[min(92vw,360px)]">
          
          {/* Gradient Icon with bounce animation */}
          <div
            className="mx-auto mb-4 w-20 h-20 flex items-center justify-center animate-bounce-smooth"
          >
            <Icon
              className="w-full h-full"
              style={{ fill: "url(#gradient1)" }}
            />
            <svg width="0" height="0">
              <defs>
                <linearGradient id="gradient1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" /> {/* cyan-500 */}
                  <stop offset="50%" stopColor="#22c55e" /> {/* emerald-400 */}
                  <stop offset="100%" stopColor="#a3e635" /> {/* green-300 */}
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Loading text + countdown */}
          <div className="text-center">
            <div className="text-sm font-medium text-gray-800">{message}</div>
            <div className="mt-2 text-xs text-gray-500">
              Fetching historical NASA data
              <span style={{ animation: "pulseDots 1.4s infinite" }}>.</span>
              <span style={{ animation: "pulseDots 1.4s .2s infinite" }}>.</span>
              <span style={{ animation: "pulseDots 1.4s .4s infinite" }}>.</span>

              {/* Countdown timer */}
              <div className="mt-3 text-sm font-semibold text-gray-700">
                {secondsLeft > 0 ? `${secondsLeft}s remaining` : "Almost done…"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
