import React from "react";
import Swal from 'sweetalert2';

function ContactForm() {


  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "eefb308a-564d-42f9-85cc-6f8a66b10f9a");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    }).then((res) => res.json());

    if (res.success) {
      Swal.fire({
        title: "Done",
        text: "Message sent successfully",
        icon: "success"
      });
    }
  };


  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Form Container */}
      <form onSubmit={onSubmit} className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-10 mx-4">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Contact Form
        </h2>

        {/* Full Name */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your name..."
            name = 'name'
            required
            className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email..."
            name="email"
            required
            className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Message */}
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Your Message
          </label>
          <textarea
            placeholder="Enter your message..."
            required
            name="message"
            rows="5"
            className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-200"
          >
            Send Message
          </button>
        </div>
      </form>
    </section>
  );
}

export default ContactForm;
