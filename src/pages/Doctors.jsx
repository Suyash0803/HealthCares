import React, { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/doctors.css";


const Doctors=()=>{
    const [doctors,setDoctors]=useState([]);

    const fetchDoctors=async()=>{
        try{
            const response=await fetch("http://localhost:5000/api/doctors/view");
            const data=await response.json();
            setDoctors(data.data);
;
        }catch(e){
            console.log(e);
        }
    };
    useEffect(()=>{
        fetchDoctors();
    },[]);

    return(
        <> 
            <Navbar />
            
            <div className="doctors-container">
                <h1 className="page-heading">Doctors</h1>
                <div className="doctors-list">
                    {doctors.map((ele) => (
                        <DoctorCard key={ele._id} ele={ele} />
                    ))}
                </div>
            </div>
            
            <Footer />
        </>
    )
}
export default Doctors;