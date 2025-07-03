import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/change.css";
import ChangeImage from "../images/change-pic.png";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return toast.error("Please enter your email address");
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email: email,
      });

      if (res.data.message) {
        toast.success("Password reset email sent! Check your inbox.");
        setEmail("");
        // Navigate back to login after showing success message
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="register-section flex-center">
      <div className="register-wrapper">
        <div className="register-image">
          <img src={ChangeImage} alt="Forgot Password Visual" />
        </div>
        <div className="register-container flex-center">
          <h2 className="form-heading">Forgot Password</h2>
          <p style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit} className="register-form">
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" className="btn form-btn" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button 
              onClick={() => navigate("/login")} 
              style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;