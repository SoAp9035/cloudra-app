// src/components/Sidebar.jsx
import SearchBox from "./SearchBox.jsx";
import DatePicker from "./DatePicker.jsx";

export default function Sidebar({
  onSearch,
  dateValue,
  onDateChange,
  mode,             // "quick" | "detailed"
  onModeChange,
  onAnalyze,
  analyzeLoading,
  analyzeError,
}) {
  const options = [
    { key: "quick", label: "Quick Analysis" },
    { key: "detailed", label: "Detailed Analysis" },
  ];

  return (
    <aside
      className="
        absolute z-[1001]
        w-[320px] max-w-[90vw] h-full
        bg-white/95 backdrop-blur
        shadow-lg overflow-y-auto
        pointer-events-auto flex flex-col
      "
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Weather Analysis</h2>
        <p className="text-xs text-gray-500 mt-0.5">Pick a location and a date</p>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5 flex-1">
        {/* Location */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
          <SearchBox onEnter={onSearch} />
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
          <DatePicker value={dateValue} onChange={onDateChange} />
        </div>

        {/* Analysis Mode */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Analysis Mode</label>
          <div className="flex flex-wrap gap-2">
            {options.map((o) => (
              <button
                key={o.key}
                onClick={() => onModeChange?.(o.key)}
                className={
                  "px-3 py-1.5 text-sm rounded-full transition " +
                  (mode === o.key
                    ? "bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100")
                }
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer (Analyze) */}
      <div className="p-5 border-t border-gray-100">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={analyzeLoading}
          className={
            "w-full rounded-xl text-white py-2.5 text-sm font-medium shadow " +
            (analyzeLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow")
          }
        >
          {analyzeLoading ? "Analyzing…" : "Get Analysis"}
        </button>

        {analyzeError && (
          <div className="mt-2 text-xs text-red-600">Error: {analyzeError}</div>
        )}
      </div>
    </aside>
  );
}
