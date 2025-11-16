import React from "react";
import { Link } from "react-router-dom";
import InfoCard from "../components/infoCard";
// * import the profile pictures we are going to use
import razanPic from "../assets/pictures/razanPic.jpg"
import seyfPic from "../assets/pictures/seyfPic.jpg"
import ahmetPic from "../assets/pictures/ahmetPic.jpg"
import melekPic from "../assets/pictures/melekPic.jpg"
import aysegulPic from "../assets/pictures/aysegulPic.jpg"
import logoClose from "../assets/logo/logoClose.png";

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="backdrop-blur bg-white/80 w-full py-4 px-6 shadow-md flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={logoClose}
            className="w-10 h-10 object-cover rounded-full"
            alt="Cloudra logo"
          />
          <span className="text-2xl font-bold bg-gradient-to-br from-sky-500 to-indigo-500 bg-clip-text text-transparent">
            Cloudra
          </span>
        </div>
        <Link 
          to="/" 
          className="px-4 py-2 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white text-sm font-semibold hover:shadow-lg transition"
        >
          Go Back
        </Link>
      </header>

      {/* Banner */}
      <section className="py-12 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-br from-sky-500 to-indigo-500 bg-clip-text text-transparent mb-3">
          About Us
        </h1>
        <p className="text-gray-600 text-lg">Meet the team behind Cloudra</p>
      </section>

      {/* Creators Grid */}
      <section className="flex flex-col items-center justify-start py-8 pb-16">
        <div className="backdrop-blur bg-white/60 shadow-xl rounded-3xl p-10 w-full max-w-6xl border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              image={ahmetPic}
              name="Ahmet Burhan KAYALI"
              email="ahmetburhan1703@gmail.com"
            />

            <InfoCard
              image={seyfPic}
              name="Seyf JAMAL"
              email="contact@daif.top"
            />

            <InfoCard
              image={aysegulPic}
              name="Ayşegül KAYA"
              email="aysegulkaya@gmail.com"
            />

            <InfoCard
              image={razanPic}
              name="Razan STEIF"
              email="razansteifschool@gmail.com"
            />

            <InfoCard
              image={melekPic}
              name="Melek GÜNGÜL"
              email="mmelekgungul5104@gmail.com"
            />

            <InfoCard
              image={null} 
              name="Zehra BALCI"
              email="balcizehranur779@gmail.com"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
