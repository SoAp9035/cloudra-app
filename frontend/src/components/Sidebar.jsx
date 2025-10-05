import { useState } from "react";
import DatePicker from "./DatePicker.jsx";
import logoClose from "../assets/logo/logoClose.png";
import { FaSearch } from "react-icons/fa";

export default function Sidebar({
  onSearch,
  dateValue,
  onDateChange,
  mode,
  onModeChange,
  onAnalyze,
  analyzeLoading,
  analyzeError,
  readyToRun,
  dirty,
}) {

  const [query, setQuery] = useState("");
  const handleModeSelect = (value) => {
    if (analyzeLoading) return;
    if (mode === value) return;
    onModeChange?.(value);
  };


  const handleSearchClick = () => {
    const trimmed = query.trim();
    if (!trimmed || analyzeLoading) return;
    onSearch?.(trimmed);
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-full bg-white border border-[#1E3A8A] px-3 py-2 pr-12 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Search trigger (magnifier) - SEARCH ONLY */}
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black disabled:opacity-50"
                onClick={handleSearchClick}
                disabled={analyzeLoading || !query.trim()}
                title={
                  !query.trim()
                    ? "Type a location first"
                    : analyzeLoading
                      ? "Analysis is running…"
                      : "Search location"
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
          {/* Tip / Guidance */}
          <p className="text-black font-bold text-[12px] mb-3.5 text-center">
            Select a mode, pick a location & date, then click “Run Analysis”.
          </p>

          {/* Mode Buttons: selection-only (never auto-run) */}
          <div className="flex flex-col gap-3 w-full cursor-pointer" role="group" aria-label="Analysis Mode">
            {MODE_BUTTONS.map((b) => {
              const isActive = mode === b.key;
              const isDisabled = !!analyzeLoading; // lock switching while loading

              const base =
                "w-full flex flex-col items-center justify-center px-6 py-2 rounded-full text-sm transition border";
              const active =
                "text-white shadow bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 border-transparent";
              const inactive =
                "text-gray-800 bg-white border-gray-300 hover:border-blue-400 hover:shadow";

              return (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => handleModeSelect(b.key)}
                  disabled={isDisabled}
                  aria-pressed={isActive}
                  className={`${base} ${isActive ? active : inactive} ${isDisabled ? " opacity-60 cursor-not-allowed" : ""
                    }`}
                  title={
                    isDisabled
                      ? "Cannot change mode while analysis is running"
                      : isActive
                        ? `${b.label} selected`
                        : `Select ${b.label}`
                  }
                >
                  <span className="font-semibold">
                    {b.label} {isActive ? "✓" : ""}
                  </span>
                  {/* Subtext readable on both backgrounds */}
                  <span
                    className={`text-[10px] mt-0 text-center ${isActive ? "text-white/90" : "text-gray-600"
                      }`}
                  >
                    {b.subText}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Primary explicit Run button - SAME gradient look as active mode */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => onAnalyze?.()}
              disabled={!readyToRun || analyzeLoading || !dirty}
              title={
                analyzeLoading
                  ? "Analysis is running…"
                  : !readyToRun
                    ? "Select mode, location, and date first"
                    : !dirty
                      ? "No changes since last run"
                      : "Run analysis"
              }
              className={
                // SAME visual language (gradient) when enabled
                "w-full rounded-full px-6 py-3 text-sm font-semibold transition  " +
                (readyToRun && dirty && !analyzeLoading
                  ? "text-white shadow bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 cursor-pointer"
                  : "text-white shadow bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 opacity-60 cursor-not-allowed")
              }
            >
              {analyzeLoading ? "Analyzing…" : "Run Analysis"}
            </button>

            {/* Tiny status text under the button */}
            {readyToRun && !analyzeLoading && dirty && (
              <p className="mt-1 text-[11px] text-center text-amber-600">
                Changes detected — click “Run Analysis”.
              </p>
            )}
            {readyToRun && !dirty && !analyzeLoading && (
              <p className="mt-1 text-[11px] text-center text-gray-500">
                Up to date with last run.
              </p>
            )}
          </div>

          {/* Errors */}
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
