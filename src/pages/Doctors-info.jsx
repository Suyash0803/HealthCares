import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../styles/doctors-info.css";
import "../components/Navbar"
import "../components/Footer"
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
const DoctorProfile = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await axios.get(`/profile/${doctorId}`);
        console.log(response.data);
        if (response.data.data) {
          setDoctor(response.data.data); // <-- Only the doctor object!
        } else {
          setError('Doctor not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch doctor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!doctor) return <div className="error">Doctor not found</div>;

  return (
  <>
  <Navbar/>
  <div className="profile-center-wrapper">
    <div className="doctor-profile container">
      <div className="profile-header">
        <h2>Dr. {doctor.name}</h2>
        <p className="specialization">{doctor.specialization}</p>
      </div>
      <div className="profile-grid">
        <div className="profile-section">
          <h3>Contact Information</h3>
          <p>Email: {doctor.email}</p>
          <p>Phone: {doctor.phone}</p>
          <p>Address: {doctor.address}</p>
        </div>
        <div className="profile-section">
          <h3>Professional Information</h3>
          <p>Experience: {doctor.experience} years</p>
          <p>Qualifications: {doctor.qualification}</p>
          <p>Consultation Fee: ₹{doctor.fees}</p>
        </div>
        <div className="profile-section">
          <h3>Availability</h3>
          <p>Working Hours: {doctor.workingHours || "N/A"}</p>
        </div>
      </div>
    </div>
  </div>
  <Footer/>
  </>
);

};

export default DoctorProfile;
