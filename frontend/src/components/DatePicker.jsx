export default function DatePicker({ value, onChange, className = "" }) {
  return (
    <div
      className={
        "flex items-center w-full px-3 py-2 rounded-full border border-[#1E3A8A] " +
        "bg-stone-50 shadow-lg focus-within:ring-2 focus-within:ring-[#1E3A8A] " +
        className
      }
    >
      <input
        type="date"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value || null)}
        className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
      />
    </div>
  );
}
