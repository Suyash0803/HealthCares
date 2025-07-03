// ResetPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/change.css";
import ChangeImage from "../images/change-pic.png";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const doctorN=localStorage.getItem("doctor");
  const patientN=localStorage.getItem("patient");
  const [passwordDetails, setPasswordDetails] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails({ ...passwordDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordDetails.newPassword) {
      return toast.error("Please enter a new password");
    }
    
    if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (passwordDetails.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/patients/reset-password/${token}`,
        {
          newPassword: passwordDetails.newPassword,
        }
      );

      if (res.data.message) {
        toast.success("Password reset successfully!");
        setPasswordDetails({
          newPassword: "",
          confirmPassword: "",
        });
        
        setTimeout(() => {
          if(doctorN){
            navigate("/loginD")
            }else if(patientN){
              navigate("/loginP")
              };
        }, 1500);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="register-section flex-center">
      <div className="register-wrapper">
        <div className="register-image">
          <img src={ChangeImage} alt="Reset Password Visual" />
        </div>
        <div className="register-container flex-center">
          <h2 className="form-heading">Reset Password</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <input
              type="password"
              name="newPassword"
              className="form-input"
              placeholder="Enter your new password"
              value={passwordDetails.newPassword}
              onChange={handleChange}
              required
            />
            
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm your new password"
              value={passwordDetails.confirmPassword}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn form-btn" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}


export default ResetPassword;