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
        title: "Success!",
        text: "Your message has been sent successfully",
        icon: "success",
        confirmButtonColor: "#0ea5e9"
      });
      event.target.reset();
    }
  };

  return (
    <section className="flex justify-center items-center py-8">
      {/* Form Container */}
      <form onSubmit={onSubmit} className="w-full max-w-2xl backdrop-blur bg-white/80 shadow-xl rounded-3xl p-10 mx-4 border border-white/50">
        {/* Full Name */}
        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-semibold mb-2 pl-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your name..."
            name='name'
            required
            className="w-full h-12 border border-gray-300 rounded-full px-5 text-gray-700 bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-semibold mb-2 pl-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email..."
            name="email"
            required
            className="w-full h-12 border border-gray-300 rounded-full px-5 text-gray-700 bg-white/90 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
          />
        </div>

        {/* Message */}
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-semibold mb-2 pl-1">
            Your Message
          </label>
          <textarea
            placeholder="Enter your message..."
            required
            name="message"
            rows="5"
            className="w-full border border-gray-300 rounded-2xl p-4 text-gray-700 bg-white/90 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
          ></textarea>
        </div>

        {/* Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full rounded-full px-8 py-3 text-white font-semibold bg-gradient-to-br from-sky-500 to-indigo-500 hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            Send Message
          </button>
        </div>
      </form>
    </section>
  );
}

export default ContactForm;
