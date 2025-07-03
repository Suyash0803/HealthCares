import React, { useState } from "react";
import { Link } from "react-router-dom";
import BookAppointment from "../components/BookAppointment";
import "../styles/doctorcard.css";

const DoctorCard = ({ ele }) => {
  const [showModal, setShowModal] = useState(false);

  const handleModal = (e) => {
    e.preventDefault(); // Stop profile link on button click
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <>
      <div className="card">
        <Link to={`/doctors/${ele._id}`} className="doctor-card-link">
          <div className="card-img flex-center">
            <img
              src={
                ele?.image ||
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
              }
              alt="profile"
            />
          </div>
          <h3 className="card-name">{ele?.name}</h3>
        </Link>

        <p><strong>Specialization:</strong> {ele?.specialization}</p>
        <p><strong>Experience:</strong> {ele?.experience}yrs</p>
        <p><strong>Fees per consultation:</strong> ₹{ele?.fees}</p>
        <p><strong>Phone:</strong> {ele?.phone}</p>

        <button className="appointment-btn" onClick={handleModal}>
          Book Appointment
        </button>
      </div>

      {showModal && <BookAppointment ele={ele} onClose={handleClose} />}
    </>
  );
};

export default DoctorCard;
