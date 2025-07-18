import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/reducers/rootSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import fetchData from "../helper/authApi";
import Loading from "../components/Loading";
import "../styles/profile.css";
import Navbar from "../components/Navbar";

function Profile() {
  const navigate = useNavigate();
  const doctor = JSON.parse(localStorage.getItem("doctor"));
  const patient = JSON.parse(localStorage.getItem("patient"));
  const user = doctor || patient;
  const userId = user?._id;
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const [imageUrl, setImageUrl] = useState(""); // store Cloudinary image URL
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "neither",
    address: "",
    age: "",
    password: "",
    confpassword: "",
  });

  const getUser = async () => {
    try {
      dispatch(setLoading(true));
      const userType = localStorage.getItem("patient") ? "patient" : "doctor";
      const user = JSON.parse(localStorage.getItem(userType));
      const userId = user?._id;
      if (!userId) return;

      const profileUrl =
        userType === "patient"
          ? `http://localhost:5000/api/patients/profile/${userId}`
          : `http://localhost:5000/api/doctors/profile/${userId}`;

      const response = await fetchData(profileUrl);
      console.log("Fetched profile:", response.data); // check image URL here

      setFormDetails({
        ...response.data,
        password: "",
        confpassword: "",
        phone: response.data.phone || "",
        age: response.data.age ? response.data.age.toString() : "",
        gender:
          response.data.gender?.toLowerCase() === "male" ||
          response.data.gender?.toLowerCase() === "female"
            ? response.data.gender.toLowerCase()
            : "neither",
      });

      setImageUrl(response.data.image); // should be Cloudinary URL
      dispatch(setLoading(false));
    } catch (error) {
      toast.error("Failed to fetch user profile");
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getUser();
  }, [dispatch]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmission = async (e) => {
    e.preventDefault();

    if (formDetails.password && formDetails.password !== formDetails.confpassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const userType = localStorage.getItem("patient") ? "patient" : "doctor";
      const updateUrl =
        userType === "patient"
          ? `http://localhost:5000/api/patients/profile/${userId}`
          : `http://localhost:5000/api/doctors/profile/${userId}`;

      const payload = {
        ...formDetails,
        image: imageUrl, // use Cloudinary URL
      };

      delete payload.confpassword;

      await toast.promise(
        fetch(updateUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }),
        {
          loading: "Updating profile...",
          success: "Profile updated!",
          error: "Profile update failed.",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
     <Navbar/>
      {loading ? (
        <Loading />
      ) : (
        <section className="register-section flex-center">
          <div className="profile-container flex-center">
            <h2 className="form-heading">Profile</h2>

            {/* ✅ Show Cloudinary image URL directly */}
            <img
              src={imageUrl || "/default-profile.png"}
              alt="profile"
              className="profile-pic"
            />

            <form onSubmit={formSubmission} className="register-form">
              <div className="form-same-row">
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Enter your name"
                  value={formDetails.name}
                  onChange={inputChange}
                />
              </div>

              <div className="form-same-row">
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formDetails.email}
                  onChange={inputChange}
                />
                <select
                  name="gender"
                  value={formDetails.gender}
                  className="form-input"
                  onChange={inputChange}
                >
                  <option value="neither">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-same-row">
                <input
                  type="text"
                  name="age"
                  className="form-input"
                  placeholder="Enter your age"
                  value={formDetails.age}
                  onChange={inputChange}
                />
                <input
                  type="text"
                  name="phone"
                  className="form-input"
                  placeholder="Enter your mobile number"
                  value={formDetails.phone}
                  onChange={inputChange}
                />
              </div>

              <textarea
                name="address"
                className="form-input"
                placeholder="Enter your address"
                value={formDetails.address}
                onChange={inputChange}
                rows="2"
              ></textarea>

              {/* <div className="form-same-row">
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter new password"
                  value={formDetails.password}
                  onChange={inputChange}
                />
                <input
                  type="password"
                  name="confpassword"
                  className="form-input"
                  placeholder="Confirm new password"
                  value={formDetails.confpassword}
                  onChange={inputChange}
                />
              </div> */}

              <button type="submit" className="btn form-btn">
                Update Profile
              </button>

              <button
                type="button"
                className="btn form-btn"
                onClick={() => navigate("/forgot-password")}
              >
                Change Password
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}

export default Profile;
