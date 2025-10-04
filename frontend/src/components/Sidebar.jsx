// src/components/Sidebar.jsx
import { useEffect, useRef, useState } from "react";
import SearchBox from "./SearchBox.jsx";
import DatePicker from "./DatePicker.jsx";
import logoClose from "../assets/logo/logoClose.png";

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
  // سنقفل الوضع بعد أول تحليل ناجح
  const [lockedMode, setLockedMode] = useState(null); // null | "quick" | "detailed"

  // نحتاج نعرف متى ينتهي التحميل (من true -> false)
  const prevLoadingRef = useRef(analyzeLoading);
  useEffect(() => {
    const wasLoading = prevLoadingRef.current;
    const nowLoading = analyzeLoading;
    prevLoadingRef.current = nowLoading;

    // التحميل انتهى الآن
    if (wasLoading && !nowLoading) {
      // إذا لم يحدث خطأ → اعتبر التحليل ناجحًا واقفل الوضع الحالي
      if (!analyzeError && !lockedMode) {
        setLockedMode(mode); // اقفل على الوضع الذي كان مُختارًا وقت انتهاء التحليل
      }
    }
  }, [analyzeLoading, analyzeError, mode, lockedMode]);

  const handleAnalyze = () => {
    onAnalyze?.();
    // لا نقفل هنا — ننتظر التأكد من نجاح التحليل (انتهاء التحميل بدون أخطاء)
  };

  const handleModeChange = (value) => {
    // إذا تم القفل بالفعل ووضع مختلف → امنع التغيير
    if (lockedMode && lockedMode !== value) return;
    onModeChange?.(value);
  };

  const options = [
    { key: "quick", label: "Quick Analysis" },
    { key: "detailed", label: "Detailed Analysis" },
  ];

  return (
    <aside
      className="
        absolute z-[1001]
        w-[320px] max-w-[90vw] h-full
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
      <div className="p-5 space-y-5 flex-1">
        {/* Location */}
        <div>
          <label className="block text-center text-base font-bold text-black mb-2">
            Enter your desired location
          </label>
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
            {options.map((o) => {
              const isActive = mode === o.key;

              // عطّل أثناء التحميل + عطّل الخيار الآخر بعد القفل
              const isDisabled =
                analyzeLoading || (lockedMode && o.key !== lockedMode);

              return (
                <label
                  key={o.key}
                  className={
                    "px-3 py-1.5 text-sm rounded-full transition " +
                    (isActive
                      ? "text-white shadow"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100") +
                    (isDisabled ? " opacity-60 cursor-not-allowed" : "")
                  }
                  style={
                    isActive
                      ? { background: "linear-gradient(90deg,  #2563EB, #38BDF8, #A0E7FF)" }
                      : {}
                  }
                >
                  <input
                    type="radio"
                    name="analysisMode"
                    value={o.key}
                    checked={isActive}
                    onChange={(e) => handleModeChange(e.target.value)}
                    className="mr-2"
                    disabled={isDisabled}
                  />
                  {o.label}
                </label>
              );
            })}
          </div>

          {/* رسائل حالة بسيطة (اختيارية) */}
          {analyzeLoading && (
            <p className="mt-2 text-[11px] text-gray-500">Analyzing…</p>
          )}
          {!analyzeLoading && lockedMode && (
            <p className="mt-2 text-[11px] text-gray-500">
              Mode locked to <span className="font-semibold">{lockedMode}</span>.
            </p>
          )}
        </div>
      </div>

      {/* Footer (Analyze) */}
      <div className="p-5 border-t border-gray-100">
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={analyzeLoading}
          className={
            "w-full rounded-xl text-white py-2.5 text-sm font-medium shadow " +
            (analyzeLoading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 text-white shadow")
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
