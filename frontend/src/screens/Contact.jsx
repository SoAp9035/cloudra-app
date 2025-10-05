import React from 'react'
import ContactForm from '../components/ContactForm/ContactForm.jsx'
import { Link } from "react-router-dom";
import logoClose from "../assets/logo/logoClose.png";

function Contact() {
  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Header (Cloudra + Contact Text + Go Back) */}
      <header className="bg-white w-full py-6 px-6 shadow-sm flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-4">
          <img
            src={logoClose}
            className="w-14 h-14 object-cover rounded-full shrink-0"
            alt="Cloudra logo"
          />
          <div className="flex flex-col leading-tight">
            <h1 className="text-5xl font-poppins font-bold leading-none">
              <span className="inline-block bg-gradient-to-br from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                Cloudra
              </span>
            </h1>
            <span className="text-gray-600 text-lg mt-1">
              Got a question? Contact Us!
            </span>
          </div>
        </div>

        <Link
          to="/"
          className="text-blue-600 font-medium hover:underline text-lg"
        >
          Go Back
        </Link>
      </header>

      {/* Contact content */}
      <div className="mt-10 px-5 max-w-[600px] mx-auto">
        <ContactForm />
      </div>

    </div>
  )
}

export default Contact
