import React,{useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "../styles/register.css"

import toast from "react-hot-toast"
import RegisterImage from '../images/d.jpg';

function Register(){
    const [file,setFile]=useState("");
    const [loading, setLoading] = useState(false);
    const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confpassword: "",
  });
  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };
  const formSubmit = async (e) => {
    try {
      e.preventDefault();

      if (loading) return;
      if (file === "") return;

      const { firstname, lastname, email, password, confpassword } =
        formDetails;
      if (!firstname || !lastname || !email || !password || !confpassword) {
        return toast.error("Input field should not be empty");
      } else if (firstname.length < 3) {
        return toast.error("First name must be at least 3 characters long");
      } else if (lastname.length < 3) {
        return toast.error("Last name must be at least 3 characters long");
      } else if (password.length < 5) {
        return toast.error("Password must be at least 5 characters long");
      } else if (password !== confpassword) {
        return toast.error("Passwords do not match");
      }
   }catch(e){
    console.log(e)
   }
 }
 return(
    <section className="register-section flex-center">
         <div className="register-wrapper">
            <div className="register-image">
      <img src={RegisterImage} alt="Register Visual" />
    </div>
      <div className="register-container flex-center">
        <h2 className="form-heading">Sign Up</h2>
        <form
          onSubmit={formSubmit}
          className="register-form"
        >
          <input
            type="text"
            name="firstname"
            className="form-input"
            placeholder="Enter your first name"
            value={formDetails.firstname}
            onChange={inputChange}
          />
          <input
            type="text"
            name="lastname"
            className="form-input"
            placeholder="Enter your last name"
            value={formDetails.lastname}
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
            placeholder="Enter your password"
            value={formDetails.password}
            onChange={inputChange}
          />
          <input
            type="password"
            name="confpassword"
            className="form-input"
            placeholder="Confirm your password"
            value={formDetails.confpassword}
            onChange={inputChange}
          />
          <button
            type="submit"
            className="btn form-btn"
            disabled={loading ? true : false}
          >
            sign up
          </button>
        </form>
        <p>
          Already a user?{" "}
          <NavLink
            className="login-link"
            to={"/login"}
          >
            Log in
          </NavLink>
        </p>
      </div>
      </div>
    </section>
 )
}
export default Register;