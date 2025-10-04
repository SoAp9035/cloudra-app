import React from 'react'
import ContactForm from '../components/ContactForm/ContactForm.jsx'

function Contact() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top gray bar */}
      <div className="bg-gray-300 w-full py-3 px-5">
        <span className="text-xl font-bold text-gray-800">Cloudra</span>
      </div>

      {/* Banner */}
      <div className="bg-white mt-5 py-10 text-center shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800">
          Got a question? Contact Us!
        </h1>
      </div>


      {/* Contact content */}

      <div className="mt-8 px-5 max-w-[600px] mx-auto">
        <ContactForm />
      </div>




    </div>
  )
}

export default Contact
