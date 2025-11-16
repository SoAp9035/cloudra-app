import React from "react";

function InfoCard({ image, name, email, gsm }) {
  return (
    <div className="backdrop-blur bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/50">
      {/* profile picture */}
      <div className="w-24 h-24 rounded-full mb-4 bg-gradient-to-br from-sky-400 to-indigo-400 p-1">
        {image ? (
          <img
            src={image}
            className="w-full h-full rounded-full object-cover"
            alt={name}
          />
        ) : (
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-bold text-gray-400">
            {name?.charAt(0) || "?"}
          </div>
        )}
      </div>

      {/* Info */}
      <h2 className="text-lg font-semibold text-gray-800 mb-1">{name}</h2>
      <p className="text-sm text-gray-600">{email}</p>
      {gsm && <p className="text-sm text-gray-600">{gsm}</p>}
    </div>
  );
}

export default InfoCard;
