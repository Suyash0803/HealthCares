import React, { useState } from "react";
import toast from "react-hot-toast";
import "../styles/doctors-apply.css";
import axios from "axios";
import DoctorImage from "../images/ij.jpg";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

axios.defaults.baseURL = "http://localhost:5000/api/doctors";

function DoctorApply() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
    phone: "",
    qualification: "",
    address: "",
    fees: "",
    gender: "",
    hospitalName: "",
    walletAddress: "",
    image: null,
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      specialization,
      experience,
      phone,
      qualification,
      address,
      fees,
      gender,
      hospitalName,
      walletAddress,
      password,
      image,
    } = formData;

    if (
      !name || !email || !specialization || !experience || !phone ||
      !qualification || !address || !fees || !gender || !hospitalName ||
      !walletAddress || !password || !image
    ) {
      return toast.error("Please fill all the fields including image");
    }

    const toastId = toast.loading("Uploading image...");

    try {
      const imageUrl = await uploadToCloudinary(image);

      const response = await axios.post("/register", {
        ...formData,
        image: imageUrl,
      });

      if (response.data.success) {
        toast.success("Application submitted successfully!", { id: toastId });
        setFormData({
          name: "",
          email: "",
          password: "",
          specialization: "",
          experience: "",
          phone: "",
          qualification: "",
          address: "",
          fees: "",
          gender: "",
          hospitalName: "",
          walletAddress: "",
          image: null,
        });
        navigate("/loginD"); // Redirect to login page after successful submission
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application.",
        { id: toastId }
      );
    }
  };

  return (
    <section className="apply-doctor-section flex-center">
      <div className="apply-doctor-container flex-center">
        <h2 className="form-heading">Apply as a Doctor</h2>
        <div className="form-layout">
          <div className="form-image">
            <img src={DoctorImage} alt="Doctor Visual" />
          </div>

          <form onSubmit={formSubmit} className="register-form">
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Please enter your name"
              value={formData.name}
              onChange={inputChange}
            />
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={inputChange}
            />
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={inputChange}
            />
            <input
              type="text"
              name="walletAddress"
              className="form-input"
              placeholder="Enter your wallet address"
              value={formData.walletAddress}
              onChange={inputChange}
            />
            <input
              type="text"
              name="hospitalName"
              className="form-input"
              placeholder="Enter the hospital name"
              value={formData.hospitalName}
              onChange={inputChange}
            />
            <div className="form-row">
              <div className="form-group">
                <input
                  type="number"
                  name="experience"
                  className="form-input"
                  placeholder="Experience (years)"
                  value={formData.experience}
                  onChange={inputChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  name="fees"
                  className="form-input"
                  placeholder="Consultation fees"
                  value={formData.fees}
                  onChange={inputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="specialization"
                  className="form-input"
                  placeholder="Specialization"
                  value={formData.specialization}
                  onChange={inputChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="qualification"
                  className="form-input"
                  placeholder="Qualification"
                  value={formData.qualification}
                  onChange={inputChange}
                />
              </div>
            </div>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="Phone number (10 digits)"
              value={formData.phone}
              onChange={inputChange}
              maxLength={10}
            />
            <select
              name="gender"
              className="form-input"
              value={formData.gender}
              onChange={inputChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              name="address"
              className="form-input"
              placeholder="Address"
              value={formData.address}
              onChange={inputChange}
            />
            <input
              type="file"
              name="image"
              className="form-input"
              accept="image/*"
              onChange={handleFileChange}
            />

            <button type="submit" className="btn form-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default DoctorApply;
