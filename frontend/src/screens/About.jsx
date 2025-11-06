import React from "react";
import { Link } from "react-router-dom";
import InfoCard from "../components/infoCard";
// * import the profile pictures we are going to use
import razanPic from "../assets/pictures/razanPic.jpg"
import seyfPic from "../assets/pictures/seyfPic.jpg"
import ahmetPic from "../assets/pictures/ahmetPic.jpg"
import melekPic from "../assets/pictures/melekPic.jpg"
import aysegulPic from "../assets/pictures/aysegulPic.jpg"



function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-300 w-full py-3 px-5 shadow-sm flex justify-between items-center">
        <span className="text-xl font-bold text-gray-800">Cloudra</span>
        <Link to="/" className="text-blue-600 hover:underline" >
          Go Back
        </Link>
      </header>

      {/* Banner */}
      <section className="bg-white py-10 text-center shadow-md">
        <h1 className="text-4xl font-semibold text-gray-800">
          About Cloudra Creators
        </h1>
      </section>

      {/* Creators Grid */}

      <section className="min-h-screen flex flex-col items-center justify-start bg-gray-50 py-16">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-5xl ">
          <div className="grid grid-cols-2 gap-6">
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
              email="razansteifdev@gmail.com"
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

            {/* TODO: ZEHRA BİLGİLERİ */}
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
