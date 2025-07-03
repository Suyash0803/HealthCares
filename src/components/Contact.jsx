import React, { useState } from "react";
import "../styles/contact.css";
import axios from "axios";
import toast from "react-hot-toast";

const Contact = () => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    message: ""
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page refresh

    if (!formDetails.name || !formDetails.email || !formDetails.message) {
      return toast.error("All fields are required.");
    }

    try {
      await axios.post("http://localhost:5000/api/contact", formDetails);
      toast.success("Message sent successfully!");
      setFormDetails({ name: "", email: "", message: "" }); // reset form
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Try again later.");
    }
  };

  return (
    <section className="register-section flex-center" id="contact">
      <div className="contact-container flex-center contact">
        <h2 className="form-heading">Contact Us</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="Enter your name"
            value={formDetails.name}
            onChange={inputChange}
          />
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formDetails.email}
            onChange={inputChange}
          />
          <textarea
            name="message"
            className="form-input"
            placeholder="Enter your message"
            value={formDetails.message}
            onChange={inputChange}
          ></textarea>
          <button type="submit" className="btn form-btn">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
