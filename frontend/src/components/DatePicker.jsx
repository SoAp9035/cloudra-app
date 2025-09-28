
export default function DatePicker({ value, onChange, className = "" }) {
  return (
    <input
      type="date"  
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value || null)}
      className={
        "w-full px-3 py-2 rounded-lg border border-gray-300 bg-white shadow outline-none " +
        "focus:ring-2 focus:ring-blue-500 " + className
      }
    />
  );
}
