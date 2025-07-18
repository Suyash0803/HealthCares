import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import "../styles/bookappointment.css"; // reuses modal CSS

const ConfirmAppointment = ({ onClose, onConfirm }) => {
  const [formData, setFormData] = useState({ date: "", time: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      toast.error("Please select date and time");
      return;
    }
    onConfirm(formData.date, formData.time);
  };

  return (
    <div className="modal flex-center">
      <div className="modal__content">
        <h2 className="page-heading">Confirm Appointment</h2>
        <IoMdClose onClick={onClose} className="close-btn" />

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="date"
            name="date"
            className="form-input"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="time"
            className="form-input"
            value={formData.time}
            onChange={handleChange}
            required
          />

          <div className="modal-buttons">
            <button type="submit" className="btn blue-btn">
              ✅ Confirm Appointment
            </button>
            <button type="button" className="btn cancel-btn" onClick={onClose}>
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmAppointment;
