// src/components/Sidebar.jsx
import SearchBox from "./SearchBox.jsx";
import DatePicker from "./DatePicker.jsx";
import logoClose from "../assets/logo/logoClose.png";
import { Link } from "react-router-dom";

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
        bg-slate-950 backdrop-blur
        shadow-lg overflow-y-auto 
        pointer-events-auto flex flex-col 
      "
    >


      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <img src={logoClose} className="w-14 h-14 object-cover rounded-full -mt-2" />
          <div className="flex flex-col">
            <h4 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-cyan-500 via-emerald-400 to-green-300 bg-clip-text text-transparent">
                Cloudra
              </span>
            </h4>
            <p className="text-xs text-emerald-50 mt-1">Wanna know the weather?</p>
          </div>
        </div>
      </div>



      {/* Body */}
      <div className="p-5 space-y-5 flex-1">
        {/* Location */}
        <div>
          <label className="block text-center text-xs font-medium text-emerald-100 mb-2">Enter your desired location</label>
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
              <label
                key={o.key}
                // onClick={() => onModeChange?.(o.key)}
                className={
                  "px-3 py-1.5 text-sm rounded-full transition " +
                  (mode === o.key
                    ? "bg-gradient-to-br from-cyan-500 to-green-300 via-emerald-400 text-white shadow"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100")
                }
              >
                <input
                  type="radio"
                  name="analysisMode"
                  value={o.key}
                  checked={mode == o.key}
                  onChange={(e) => onModeChange?.(e.target.value)}
                  className="mr-2"
                />
                {o.label}
              </label>
            ))}
          </div>
        </div>
      </div>


      {/* About & Contact Page */}

      <div className="p-2 space-y-2 ">
        <div className="text-center flex justify-center gap-4">
          <Link to="/about" className="block hover:underline text-white">
          About Us
          </Link>
          <Link to="/contact" className="block hover:underline text-white">
          Contact Us
          </Link>
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
              ? "bg-gray-400 text-slate cursor-not-allowed"
              : "bg-gradient-to-br from-cyan-500 via-emerald-400 to-green-300 text-white shadow")
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
