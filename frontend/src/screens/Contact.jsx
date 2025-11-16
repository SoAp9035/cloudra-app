import React from 'react'
import ContactForm from '../components/ContactForm/ContactForm.jsx'
import { Link } from "react-router-dom";
import logoClose from "../assets/logo/logoClose.png";

function Contact() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
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
      <div className="py-12 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-br from-sky-500 to-indigo-500 bg-clip-text text-transparent mb-3">
          Contact Us
        </h1>
        <p className="text-gray-600 text-lg">Got a question? We'd love to hear from you!</p>
      </div>

      {/* Contact content */}
      <div className="px-5 pb-16">
        <ContactForm />
      </div>
    </div>
  )
}

export default Contact
