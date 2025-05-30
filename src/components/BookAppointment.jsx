import React, { useState } from "react";
import "../styles/bookappointment.css";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";


const BookingAppointment=({ele,onClose})=>{
  console.log(ele);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        message: ""
    });
    const inputChange = (e) => {
        const { name, value } = e.target;
        return setFormData({
        ...formData,
        [name]: value,
        });
    };

    const book=async(e)=>{
        e.preventDefault();
        try{
            await toast.promise(
                axios.post("http://localhost:5000/api/doctors/",{
                    ...formData,
                    doctorId: ele._id
                }),
                {
                    loading: "Booking appointment...",
                    success: "Appointment booked successfully!",
                    error: "Error booking appointment"
                });
            
        }catch(e){
            console.log(e);
            toast.error("Error booking appointment");
        }
    };

    return(
        
    <>
      <div className="modal flex-center">
        <div className="modal__content">
          <h2 className="page-heading">Book Appointment</h2>
          <IoMdClose
            onClick={onClose}
            className="close-btn"
          />
          <div className="register-container flex-center book">
            <form className="register-form">
              <input
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={inputChange}
              />
              <input
                type="time"
                name="time"
                className="form-input"
                value={formData.time}
                onChange={inputChange}
              />
              <button
                type="submit"
                className="btn form-btn"
                onClick={book}
              >
                book
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
    )

}
export default BookingAppointment;