
export default function SearchBox({ onEnter, placeholder = "Search place… (Enter)", className = "" }) {
  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    const q = e.currentTarget.value.trim();
    if (!q) return;
    onEnter?.(q);
  }

  return (
    <input
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      className={
        "w-full px-3 py-2 rounded-lg border border-gray-300 bg-white shadow " +
        "outline-none focus:ring-2 focus:ring-blue-500 " + className
      }
    />
  );
}
