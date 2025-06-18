import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/change.css"
import ChangeImage from "../images/change-pic.png";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
    const navigate = useNavigate();
  const doctor = JSON.parse(localStorage.getItem("doctor"));
  const patient = JSON.parse(localStorage.getItem("patient"));
  const user = doctor || patient;
  const userId = user?._id;
  const userType = localStorage.getItem("doctor") ? "doctor" : "patient";

  const [passwordDetails, setPasswordDetails] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails({ ...passwordDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
    //   return toast.error("New passwords do not match");
    // }

    // try {
    //   const res = await axios.post(
    //     `http://localhost:5000/api/${userType}s/update-password/${userId}`,
    //     {
    //       currentPassword: passwordDetails.currentPassword,
    //       newPassword: passwordDetails.newPassword,
    //     }
    //   );

    //   if (res.data.success) {
    //     toast.success("Password updated successfully");
    //   } else {
    //     toast.error(res.data.message);
    //   }
    // } catch (error) {
    //   toast.error("Something went wrong");
    // }
    navigate("/login");
  };

 return(
    <section className="register-section flex-center">
         <div className="register-wrapper">
            <div className="register-image">
      <img src={ChangeImage} alt="Register Visual" />
    </div>
      <div className="register-container flex-center">
        <h2 className="form-heading">Change Password</h2>
        <form
          onSubmit={handleSubmit}
          className="register-form"
        >
          
         {/* <input
            type="text"
            name="name"
            className="form-input"
            placeholder="Enter your name"
            value={passwordDetails.name}
            onChange={handleChange}
          /> */}
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your password"
            value={passwordDetails.password}
            onChange={handleChange}
          />
          {/* <input
            type="file"
            onChange={(e) => onUpload(e.target.files[0])}
            name="profile-pic"
            id="profile-pic"
            className="form-input"
          /> */}
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Enter your current password"
            value={passwordDetails.currentPassword}
            onChange={handleChange}
          />
          
          <button
            type="submit"
            className="btn form-btn"
            navigate="/"
          >
            Change
          </button>
        </form>
        
      </div>
      </div>
    </section>
 )
}

export default ChangePassword;
