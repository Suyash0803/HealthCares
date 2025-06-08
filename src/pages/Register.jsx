import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import "../styles/register.css";
import toast from "react-hot-toast";
import RegisterImage from '../images/d.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// axios.defaults.baseURL = "http://localhost:5000/api/patients";
function Register() {
  const [file, setFile] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    bloodgroup: "",
    password: "",
    walletAddress: "",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const onImageUpload = (file) => {
    setFile(file);
  };

  const formSubmit = async (e) => {
    try {
      e.preventDefault();
      if (loading) return;

      const { name, email, age, gender, address, phone, bloodgroup, password, walletAddress } = formDetails;
      if (!name || !email || !age || !gender || !address || !phone || !bloodgroup || !password || !walletAddress) {
        return toast.error("All fields are required");
      }
      if (name.length < 3) {
        return toast.error("Name must be at least 3 characters long");
      }
      if (isNaN(age) || age < 1 || age > 120) {
        return toast.error("Please enter a valid age");
      }
      if (!["Male", "Female", "Others"].includes(gender)) {
        return toast.error("Please select a valid gender");
      }
      if (phone.length < 10) {
        return toast.error("Please enter a valid phone number");
      }
      if (password.length < 5) {
        return toast.error("Password must be at least 5 characters long");
      }
      if (!file) {
        return toast.error("Please upload a profile image");
      }
      if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        return toast.error("Please enter a valid wallet address");
      }
      // Add more validation as needed

      // Submit logic here...
      await toast.promise(
        axios.post("http://localhost:5000/api/patients/register",{
          ...formDetails,
          // profilePic: file,
        }),
        {
          loading: "Registering...",
          success: "Registration successful!",
          error: "Registration failed. Please try again.",
        })
      
      toast.success("Registration successful!");
      return navigate("/login");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <section className="register-section flex-center">
      <div className="register-wrapper">
        <div className="register-image">
          <img src={RegisterImage} alt="Register Visual" />
        </div>
        <div className="register-container flex-center">
          <h2 className="form-heading">Sign Up</h2>
          <form onSubmit={formSubmit} className="register-form">
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
            <input
              type="number"
              name="age"
              className="form-input"
              placeholder="Enter your age"
              value={formDetails.age}
              onChange={inputChange}
              min="1"
              max="120"
            />
            <select
              name="gender"
              className="form-input"
              value={formDetails.gender}
              onChange={inputChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
            <input
              type="text"
              name="address"
              className="form-input"
              placeholder="Enter your address"
              value={formDetails.address}
              onChange={inputChange}
            />
            <input
              type="text"
              name="phone"
              className="form-input"
              placeholder="Enter your phone number"
              value={formDetails.phone}
              onChange={inputChange}
              maxLength={15}
            />
            <input
              type="text"
              name="bloodgroup"
              className="form-input"
              placeholder="Enter your blood group (e.g. A+, O-)"
              value={formDetails.bloodgroup}
              onChange={inputChange}
              maxLength={3}
            />
            <input
              type="file"
              onChange={(e) => onImageUpload(e.target.files[0])}
              name="profile-pic"
              id="profile-pic"
              className="form-input"
              accept="image/*"
            />
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formDetails.password}
              onChange={inputChange}
            />
            <input
              type="text"
              name="walletAddress"
              className="form-input"
              placeholder="Enter your wallet address"
              value={formDetails.walletAddress}
              onChange={inputChange}
              maxLength={42}
            />
            <button
              type="submit"
              className="btn form-btn"
              disabled={loading}
            >
              Sign Up
            </button>
          </form>
          <p>
            Already a user?{" "}
            <NavLink className="login-link" to={"/login"}>
              Log in
            </NavLink>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;
