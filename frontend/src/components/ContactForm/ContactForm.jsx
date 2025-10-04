import React from 'react'
import './ContactForm.css'

/* TODO: adjust all the styling including: border radius, shadow, padding, color, size, text, width and height...
    make everything at the center of the page
*/


function ContactForm() {



    return (
        <section className="flex justify-center items-cente min-h-screen bg-gray-100">

            {/* Form Start */}
            <form className='max-wmax-w-[600px] mx-auto bg-white p-4 rounded-lg'>
                <h2 className='text-lg font-bold'>Contact Form</h2>

                {/* Full name */}
                <div className="mt-20">
                    <label>Full Name</label>
                    <input type="text" className="
                    w-full h-[50px] bg-transparent border-2 border-gray-300 outline-none rounded-[6px] p-[15px] text-[16px] text-[#333] mt-2
                    " placeholder='Enter Your Name...' required />
                </div>

                {/* Email */}
                <div className="input-box">
                    <label>Email Address</label>
                    <input type="email" className="field" placeholder='Enter Your Email...' required />
                </div>

                {/* Message */}
                <div className="input-box">
                    <label>Your Message</label>
                    <textarea name="" id="" className='field mess' placeholder='Enter your message...' required ></textarea>
                </div>

                {/* Send msg button */}
                <button type='submit'>Send Message</button>

            </form>
        </section>
    )
}

export default ContactForm
