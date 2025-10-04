import React, { useEffect, useState } from "react";
import cloudnetwork from "../assets/logo/cloudnetwork.gif";

export default function LoadingOverlay({
  message = "Analyzing weather…",
}) {
  // Lock scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

 const [secondsLeft, setSecondsLeft] = useState(60); // دائمًا يبدأ من 60
useEffect(() => {
  const intervalId = setInterval(() => {
    setSecondsLeft(prev => {
      if (prev <= 0) {
        clearInterval(intervalId);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(intervalId);
}, []);

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

      <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
        <div className="rounded-2xl bg-white/90 shadow-xl p-6 w-[min(92vw,360px)] text-center">
          
          {/* GIF Icon with bounce animation */}
          <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center animate-bounce-smooth">
            <img src={cloudnetwork} alt="Loading" className="w-full h-full" />
          </div>

          {/* Loading message */}
          <div className="text-sm font-medium text-gray-800">{message}</div>
          <div className="mt-2 text-xs text-gray-500">
            Fetching historical NASA data
            <span style={{ animation: "pulseDots 1.4s infinite" }}>.</span>
            <span style={{ animation: "pulseDots 1.4s .2s infinite" }}>.</span>
            <span style={{ animation: "pulseDots 1.4s .4s infinite" }}>.</span>

            {/* Countdown */}
            <div className="mt-3 text-sm font-semibold text-gray-700">
              {secondsLeft > 0 ? `${secondsLeft}s remaining` : "Almost done…"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
