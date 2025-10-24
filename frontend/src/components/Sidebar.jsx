import { useState } from "react";
import DatePicker from "./DatePicker.jsx";
import logoClose from "../assets/logo/logoClose.png";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Sidebar({
  onSearch,
  dateValue,
  onDateChange,
  mode,
  onModeChange,
  onAnalyze,
  analyzeLoading,
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
    { key: "quick", label: "Quick Analysis", subText: "10 years ≈ 30s", disabled: false },
    { key: "detailed", label: "Detailed Analysis", subText: "Not available in demo", disabled: true },
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
              <span className="inline-block bg-gradient-to-br from-sky-500 to-indigo-500  bg-clip-text text-transparent">
                Cloudra
              </span>
            </h4>
            <p className="text-sm font-bold mt-2.5 text-gray-600">
              Weather Forecast for Your Date
            </p>
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2 pl-3">
              Enter location
            </label>
            <div className="relative w-full">
        <input
      type="text"
      placeholder="Search..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== "NumpadEnter") return;
        e.preventDefault();
        if (!query.trim() || analyzeLoading) return;
        handleSearchClick();
      }}
      className="w-full rounded-full bg-white border border-[#1E3A8A] px-3 py-2 pr-12 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
              {/* Search trigger (magnifier) */}
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
            <label className="block text-xs font-medium text-gray-600 mb-1 pl-3">
              Date
            </label>
            <DatePicker value={dateValue} onChange={onDateChange} />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-5 w-full">
          {/* Tip / Guidance */}
          <p className="block text-left text-xs font-medium text-gray-600 mb-1 pl-3">
            Choose analysis type:
          </p>
          {/* Mode Buttons */}
          <div className="flex flex-col gap-3 w-full cursor-pointer" role="group" aria-label="Analysis Mode">
            {MODE_BUTTONS.map((b) => {
              const isActive = mode === b.key;
              const isDisabled = !!analyzeLoading || b.disabled;
              const base =
                "w-full flex flex-col items-center justify-center px-6 py-2 rounded-full text-sm transition border";
              const active =
                "text-white shadow bg-gradient-to-br from-sky-500 to-indigo-500  border-transparent";
              const inactive =
                "text-gray-800 bg-white border-gray-300 hover:border-blue-400 hover:shadow";
              const disabledStyle = b.disabled ? "opacity-50 cursor-not-allowed" : "";
              return (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => !b.disabled && handleModeSelect(b.key)}
                  disabled={isDisabled}
                  aria-pressed={isActive}
                  className={`${base} ${isActive ? active : inactive} ${isDisabled ? " opacity-60 cursor-not-allowed" : ""} ${disabledStyle}`}
                  title={
                    b.disabled
                      ? "Not available in demo version"
                      : isDisabled
                        ? "Cannot change mode while analysis is running"
                        : isActive
                          ? `${b.label} selected`
                          : `Select ${b.label}`
                  }
                >
                  <span className="font-semibold">
                    {b.label} {isActive ? "✓" : ""} {b.disabled ? "🔒" : ""}
                  </span>
                  <span
                    className={`text-[10px] mt-0 text-center ${isActive ? "text-white/90" : b.disabled ? "text-red-500 font-medium" : "text-gray-600"
                      }`}
                  >
                    {b.subText}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Run Analysis Button */}
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
                "w-full rounded-full px-6 py-3 text-sm font-semibold transition  " +
                (readyToRun && dirty && !analyzeLoading
                  ? "text-white shadow bg-gradient-to-br from-sky-500 to-indigo-500  cursor-pointer"
                  : "text-white shadow bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 opacity-60 cursor-not-allowed")
              }
            >
              {analyzeLoading ? "Analyzing…" : "Run Analysis"}
            </button>
            {readyToRun && !analyzeLoading && dirty && (
              <p className="mt-1 text-[11px] text-center text-amber-600">
                Changes detected — click "Run Analysis".
              </p>
            )}
            {readyToRun && !dirty && !analyzeLoading && (
              <p className="mt-1 text-[11px] text-center text-gray-500">
                Up to date with last run.
              </p>
            )}
          </div>
                    {/* routers   */}
        <div>
 
          <div className="flex justify-center items-center gap-4 mt-2 ">
            <Link to="/about" className=" text-xs text-gray-600 hover:underline">
              About Us
            </Link>
            <Link to="/contact" className=" text-xs text-gray-600 hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
        </div>
      </div>
    </aside>
  );
}
 