import React from "react";
import { Link } from "react-router-dom";
import InfoCard from "../components/infoCard";
import logoClose from "../assets/logo/logoClose.png";

// Profil resimleri
import razanPic from "../assets/pictures/razanPic.jpg";
import seyfPic from "../assets/pictures/seyfPic.jpg";
import ahmetPic from "../assets/pictures/ahmetPic.jpg";
import melekPic from "../assets/pictures/melekPic.jpg";
import aysegulPic from "../assets/pictures/aysegulPic.jpg";
import zehranurPic from "../assets/pictures/zehranur.png";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 bg-white flex justify-between items-center">
        {/* Sol: Cloudra + Profil */}
        <div className="flex items-center gap-3">
          <img
            src={logoClose}
            alt="Cloudra logo"
            className="w-14 h-14 object-cover rounded-full shrink-0"
          />
          <h1 className="text-3xl font-bold font-poppins leading-none">
            <span className="bg-gradient-to-br from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              Cloudra
            </span>
          </h1>
        </div>

        {/* Sağ: Geri butonu */}
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
        >
          Go Back
        </Link>
      </header>

      {/* About section just under header */}
      <section className="text-center py-12 bg-white px-4">
        <p className="text-center text-2xl font-semibold text-gray-800 mb-10">
          Meet the passionate minds behind Cloudra.
        </p>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Our team aims to push beyond boundaries through the power of science and engineering, to explore new horizons and to inspire the future.
          Science beyond limits, vision beyond time ✨
        </p>
      </section>

      {/* Creators Grid */}
      <section className="flex-1 flex flex-col items-center justify-start py-16 px-5">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-6xl">
          <h3 className="text-center text-2xl font-semibold text-gray-800 mb-10">
            About Cloudra Creators
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <InfoCard
              image={ahmetPic}
              name="Ahmet Burhan Kayalı"
              email="ahmetburhan1703@gmail.com"
              gsm="536 443 04 57"
            />
            <InfoCard
              image={seyfPic}
              name="Seyf JAMAL"
              email="ssaaiiffjjaammaall@gmail.com"
              gsm="534 453 39 88"
            />
            <InfoCard
              image={aysegulPic}
              name="Ayşegül KAYA"
              email="razansteifdev@gmail.com"
              gsm="537 562 00 13"
            />
            <InfoCard
              image={razanPic}
              name="Razan STEIF"
              email="razansteifschool@gmail.com"
              gsm="551 397 53 97"
            />
            <InfoCard
              image={melekPic}
              name="Melek GÜNGÜL"
              email="mmelekgungul5104@gmail.com"
              gsm="545 162 24 51"
            />
            <InfoCard
              image={zehranurPic}
              name="Fatıma Zehra Nur BALCI"
              email="balcizehranur779@gmail.com"
              gsm="553 780 42 90"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-100">
        © {new Date().getFullYear()} Cloudra Team. All rights reserved.
      </footer>
    </div>
  );
}
