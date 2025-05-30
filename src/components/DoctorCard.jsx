import React, { useState } from "react";
import { Link } from "react-router-dom";
import BookAppointment from "../components/BookAppointment";
import { toast } from "react-hot-toast";
import "../styles/doctorcard.css";

const DoctorCard = ({ ele }) => {
  const [showModal, setShowModal] = useState(false);

  const handleModal = (e) => {
    e.preventDefault(); // Prevents navigating to the doctor's profile when clicking the button
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <>
      <Link to={`/doctors/${ele._id}`} className="doctor-card-link">
        <div className="card">
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
          <p className="specialization">
            <strong>Specialization:</strong> {ele?.specialization}
          </p>
          <p className="experience">
            <strong>Experience: </strong>
            {ele?.experience}yrs
          </p>
          <p className="fees">
            <strong>Fees per consultation: </strong>₹{ele?.fees}
          </p>
          <p className="phone">
            <strong>Phone: </strong>
            {ele?.phone}
          </p>
          <button
            className="btn appointment-btn"
            onClick={handleModal}
          >
            Book Appointment
          </button>
        </div>
      </Link>

      {/* BookAppointment Modal */}
      {showModal && (
        <BookAppointment
          ele={ele}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default DoctorCard;
