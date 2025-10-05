import React from "react";

function InfoCard({ image, name, email, gsm }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition">
      {/* profile picture */}
      <img
        src={image}
        className="w-24 h-24 rounded-full mb-4 object-cover border border-gray-200"
      />

      {/* Info */}
      <h2 className="text-lg font-medium text-gray-800">{name}</h2>
      <p className="text-sm text-gray-600">{email}</p>
      <p className="text-sm text-gray-600">{gsm}</p>
    </div>
  );
}

export default InfoCard;
