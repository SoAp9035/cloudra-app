// src/components/Sidebar.jsx
import { useEffect, useRef, useState } from "react";
import DatePicker from "./DatePicker.jsx";
import logoClose from "../assets/logo/logoClose.png";
import { FaSearch } from "react-icons/fa";

export default function Sidebar({
  onSearch,
  onAnalyze,
  dateValue,
  onDateChange,
  mode,
  onModeChange,
  analyzeLoading,
  analyzeError,
}) {
  const [lockedMode, setLockedMode] = useState(null);
  const prevLoadingRef = useRef(analyzeLoading);

  useEffect(() => {
    const wasLoading = prevLoadingRef.current;
    const nowLoading = analyzeLoading;
    prevLoadingRef.current = nowLoading;

    if (wasLoading && !nowLoading) {
      if (!analyzeError && !lockedMode) {
        setLockedMode(mode ?? null);
      }
    }
  }, [analyzeLoading, analyzeError, mode, lockedMode]);

  const handleModeChange = (value) => {
    if (lockedMode && lockedMode !== value) return;
    onModeChange?.(value);
  };

  const handleSearchEnter = (query) => {
    onSearch?.(query);
    if (mode) onAnalyze?.();
  };

  const handleModeButtonClick = (value) => {
    const isDisabled = analyzeLoading || (lockedMode && lockedMode !== value);
    if (isDisabled) return;
    handleModeChange(value);
    onAnalyze?.();
  };

  const MODE_BUTTONS = [
    { key: "quick", label: "Quick Analysis", subText: "10 years ≈ 25 seconds" },
    { key: "detailed", label: "Detailed Analysis", subText: "30 years ≈ 85 seconds" },
  ];

  return (
    <aside
      className="
        absolute z-[1001]
        w-[350px] max-w-[90vw] h-full
        backdrop-blur
        shadow-lg overflow-y-auto rounded-tr-70 rounded-br-70
        pointer-events-auto flex flex-col
      "
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={logoClose}
            className="w-14 h-14 object-cover rounded-full shrink-0"
            alt="Cloudra logo"
          />
          <div className="flex flex-col">
            <h4 className="text-5xl font-poppins font-bold leading-none">
              <span className="inline-block bg-[linear-gradient(90deg,#0D1321,#1E3A8A,#2563EB,#38BDF8,#A0E7FF)] bg-clip-text text-transparent">
                Cloudra
              </span>
            </h4>
            <p className="text-sm font-bold mt-1 text-black">
              Wanna know the weather?
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Location */}
          <div>
            <label className="block text-center text-base font-bold text-black mb-2">
              Enter your desired location
            </label>

            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchEnter(e.target.value);
                }}
                className="w-full rounded-full bg-white border border-[#1E3A8A] px-3 py-2 pr-12 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black disabled:opacity-50"
                onClick={() => onAnalyze?.()}
                disabled={analyzeLoading || !mode}
                title={
                  mode
                    ? "Run analysis for current selection"
                    : 'Choose a mode ("quick" or "detailed") first'
                }
              >
                {analyzeLoading ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <FaSearch size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Date
            </label>
            <DatePicker value={dateValue} onChange={onDateChange} />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-5 w-full">
          {/* Tip yazısı hemen butonların üstünde */}
          <p className="text-black font-bold text-[12px] mb-3.5 text-center">
            {/* Tip: press <kbd>Enter</kbd> after typing a location, or click a mode to run analysis */}
            Press Enter after typing a location, or click a mode to run analysis.
          </p>

          {/* Mode Buttons */}
          <div className="flex flex-col gap-3 w-full" role="group" aria-label="Analysis Mode">
            {MODE_BUTTONS.map((b) => {
              const isActive = mode === b.key;
              const isDisabled = analyzeLoading || (lockedMode && b.key !== lockedMode);

              const buttonWidth = b.key === "quick" ? "w-full" : "flex-1";

              return (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => handleModeButtonClick(b.key)}
                  disabled={isDisabled}
                  aria-pressed={isActive}
                  className={
                    `${buttonWidth} flex flex-col items-center justify-center px-6 py-2 rounded-full text-sm transition ` +
                    (isActive
                      ? "text-white shadow bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-200"
                      : "text-white shadow bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-200") +
                    (isDisabled ? " opacity-60 cursor-not-allowed" : "")
                  }
                  title={
                    isDisabled && lockedMode && b.key !== lockedMode
                      ? `Mode locked to ${lockedMode}`
                      : isDisabled && analyzeLoading
                      ? "Analysis is running…"
                      : `Run ${b.label}`
                  }
                >
                  <span className="font-semibold">{b.label}</span>
                  <span className="text-[10px] text-black mt-0 text-center">{b.subText}</span>
                </button>
              );
            })}
          </div>

          {analyzeLoading && (
            <p className="mt-2 text-[11px] text-gray-500 text-center">Analyzing…</p>
          )}
          {analyzeError && (
            <div className="mt-2 text-xs text-red-600 text-center">
              Error: {analyzeError}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

