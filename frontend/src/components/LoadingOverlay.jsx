import React, { useEffect, useState } from "react";
import earth_degree from "../assets/logo/degree.gif";

export default function LoadingOverlay({ mode = "quick" }) {
  // Scroll kilidi
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  // Süre: quick → 25 sn, detailed → 85 sn
  const DURATION = mode === "detailed" ? 85 : 25;

  const [secondsPassed, setSecondsPassed] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsPassed((prev) => {
        if (prev >= DURATION) {
          clearInterval(intervalId);
          return DURATION;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [DURATION]);

  const progress = Math.min((secondsPassed / DURATION) * 100, 100);

  return (
    <>
      <style>{`
        @keyframes pulseDots {
          0%, 80%, 100% { opacity: .2; }
          40% { opacity: 1; }
        }
        .progress-bar {
          transition: width 0.5s ease-in-out;
        }
      `}</style>

      <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
        <div className="rounded-2xl bg-white/90 shadow-xl p-6 w-[min(92vw,360px)] text-center">
          {/* GIF Icon */}
          <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center">
            <img src={earth_degree} alt="Loading" className="w-full h-full" />
          </div>

          {/* Loading message */}
          <div className="text-sm font-medium text-gray-800">
            <div>
              Analyzing weather
              <span style={{ animation: "pulseDots 1.4s infinite" }}>.</span>
              <span style={{ animation: "pulseDots 1.4s .2s infinite" }}>.</span>
              <span style={{ animation: "pulseDots 1.4s .4s infinite" }}>.</span>
            </div>
          </div>
          
          

          {/* Info text */}
          <div className="mt-2 text-xs text-gray-500">
            Fetching historical NASA data
            <span style={{ animation: "pulseDots 1.4s infinite" }}>.</span>
            <span style={{ animation: "pulseDots 1.4s .2s infinite" }}>.</span>
            <span style={{ animation: "pulseDots 1.4s .4s infinite" }}>.</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress text */}
          <div className="mt-2 text-sm font-semibold text-gray-700">
            {progress < 100
              ? `${Math.round(progress)}% completed`
              : "Almost done…"}
          </div>
        </div>
      </div>
    </>
  );
}
   