// src/components/LoadingOverlay.jsx
import React, { useEffect } from "react";

export default function LoadingOverlay({ message = "Analyzing weather…" }) {
 
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <>
 
      <style>{`
        @keyframes floaty {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
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
          {/* Cloud icon */}
          <div
            className="mx-auto mb-4 w-20 h-20"
            style={{ animation: "floaty 2.2s ease-in-out infinite" }}
          >
            <svg viewBox="0 0 64 64" className="w-full h-full">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0" stopColor="#60a5fa" />
                  <stop offset="1" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <path
                d="M22 48h22a10 10 0 0 0 0-20h-1.2A14 14 0 1 0 22 48Z"
                fill="url(#g1)"
              />
              {/* drizzle lines */}
              <g stroke="#334155" strokeWidth="2" strokeLinecap="round" opacity=".35">
                <line x1="25" y1="50" x2="25" y2="56" />
                <line x1="33" y1="50" x2="33" y2="56" />
                <line x1="41" y1="50" x2="41" y2="56" />
              </g>
            </svg>
          </div>

          {/* Message */}
          <div className="text-center">
            <div className="text-sm font-medium text-gray-800">{message}</div>
            <div className="mt-2 text-xs text-gray-500">
              Fetching historical NASA data
              <span style={{ animation: "pulseDots 1.4s infinite" }}>.</span>
              <span style={{ animation: "pulseDots 1.4s .2s infinite" }}>.</span>
              <span style={{ animation: "pulseDots 1.4s .4s infinite" }}>.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
