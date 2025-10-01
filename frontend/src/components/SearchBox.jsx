import { FiSearch } from "react-icons/fi";

export default function SearchBox({
  onEnter,
  placeholder = "Search…",
  className = "",
}) {
  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    const q = e.currentTarget.value.trim();
    if (!q) return;
    onEnter?.(q);
  }

  return (
    <div
      className={
        "flex items-center w-full px-3 py-2 rounded-full border-1" +
        "border-gray-300 bg-gray-50 shadow-lg focus-within:ring-2 " +
        "focus-within:ring-blue-500 " +
        className
      }
    >
      {/* search icon */}
      <FiSearch className="text-gray-400 mr-2 text-2xl" />

      {/* input field */}
      <input
        type="text"
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
      />
    </div>
  );
}
