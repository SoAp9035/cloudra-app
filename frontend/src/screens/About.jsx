import React from "react";
import { Link } from "react-router-dom";
import InfoCard from "../components/infoCard";

// TODO: ADD THE PICTURES TO GITIGNORE FILE 

// import the profile pictures we are going to use
import razanPic from "../assets/pictures/razanpic.jpeg"


// a VERY bad code coming :

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

        // TODO: WRITE SMTHING ABOUT OUR TEAM/PROJECT
      <section className="bg-gray-300 text-center w-full py-8 px-5 shadow-sm">
        bro lets end this already
      </section>

      {/* Creators Grid */}

      <section className="min-h-screen flex flex-col items-center justify-start bg-gray-50 py-16">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-5xl ">
          <div className="grid grid-cols-2 gap-6">
            <InfoCard
              image={razanPic}
              name="1"
              email="razansteifdev@gmail.com"
              gsm="551 397 53 97"
            />

            <InfoCard
              image={razanPic}
              name="2"
              email="razansteifdev@gmail.com"
              gsm="551 397 53 97"
            />

            <InfoCard
              image={razanPic}
              name="3"
              email="razansteifdev@gmail.com"
              gsm="551 397 53 97"
            />

            <InfoCard
              image={razanPic}
              name="4"
              email="razansteifdev@gmail.com"
              gsm="551 397 53 97"
            />

            <InfoCard
              image={razanPic}
              name="5"
              email="razansteifdev@gmail.com"
              gsm="551 397 53 97"
            />

            <InfoCard
              image={razanPic}
              name="6"
              email="razansteifdev@gmail.com"
              gsm="551 397 53 97"
            />
          </div>
        </div>
      </section>


    </div>
  );
}

export default About;
