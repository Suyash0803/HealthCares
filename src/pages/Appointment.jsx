import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import fetchData from "../helper/authApi";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/reducers/rootSlice";
import toast from "react-hot-toast";
import axios from "axios";
import "../styles/appoint.css";
import Error from "../pages/Error";
import ConfirmAppointment from "../components/ConfirmAppointment"; // ✅ import new component

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const patient = JSON.parse(localStorage.getItem("patient"));
  const patientId = patient?._id;

  // Fetch all appointments
  const retriveAllAppointments = async () => {
    try {
      dispatch(setLoading(true));

      if (!patientId) throw new Error("Patient ID not found");

      const response = await fetchData(
        `http://localhost:5000/api/patients/${patientId}/appointments`
      );

      const data = response?.data?.data || response?.data || [];
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    retriveAllAppointments();
  }, []);

  // Modal open handler
  const openConfirmModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowConfirmModal(true);
  };

  // Modal close handler
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedAppointmentId(null);
  };

  // Confirm appointment API call
  const confirmAppointmentAPI = async (date, time) => {
    if (!selectedAppointmentId) return;

    const appointmentDate = new Date(`${date}T${time}`);

    try {
      await toast.promise(
        axios.put(
          `http://localhost:5000/api/appointments/${selectedAppointmentId}/confirm`,
          {
            appointmentDate,
            appointmentTime: time,
          },
          { withCredentials: true }
        ),
        {
          loading: "Confirming appointment...",
          success: "Appointment confirmed!",
          error: "Failed to confirm appointment",
        }
      );

      // Update local state so UI refreshes without reloading
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === selectedAppointmentId
            ? {
                ...appt,
                appointmentDate,
                appointmentTime: time,
                status: "confirmed",
              }
            : appt
        )
      );

      closeConfirmModal();
    } catch (error) {
      console.error(error);
      toast.error("Error confirming appointment");
    }
  };

  return (
    <>
      <Navbar />

      {loading ? (
        <Loading />
      ) : (
        <div className="page-wrapper">
          <section className="notif-section">
            <h2 className="page-heading">Your Appointments</h2>

            {appointments.length > 0 ? (
              <div className="appointments-wrapper">
                <div className="responsive-table-wrapper">
                  <table className="appointments">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Doctor</th>
                        <th>Status</th>
                        <th>Confirmed Date</th>
                        <th>Confirmed Time</th>
                        <th>Booking Date</th>
                        <th>Booking Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((ele, i) => (
                        <tr key={ele?._id}>
                          <td>{i + 1}</td>
                          <td>{ele?.doctorId?.name || "N/A"}</td>
                          <td>{ele?.status}</td>
                          <td>
                            {ele?.appointmentDate
                              ? new Date(ele.appointmentDate).toLocaleDateString(
                                  "en-IN",
                                  { timeZone: "Asia/Kolkata" }
                                )
                              : "Not Confirmed"}
                          </td>
                          <td>{ele?.appointmentTime || "Not Confirmed"}</td>
                          <td>
                            {new Date(ele?.createdAt).toLocaleDateString(
                              "en-IN",
                              { timeZone: "Asia/Kolkata" }
                            )}
                          </td>
                          <td>
                            {new Date(ele?.createdAt).toLocaleTimeString(
                              "en-IN",
                              {
                                timeZone: "Asia/Kolkata",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              }
                            )}
                          </td>
                          <td>
                            {ele?.status !== "confirmed" && (
                              <button
                                className="btn blue-btn"
                                onClick={() => openConfirmModal(ele._id)}
                              >
                                ✅ Confirm
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <Error />
            )}
          </section>
        </div>
      )}

      <Footer />

      {/* ✅ Show ConfirmAppointment modal */}
      {showConfirmModal && (
        <ConfirmAppointment
          onClose={closeConfirmModal}
          onConfirm={confirmAppointmentAPI}
        />
      )}
    </>
  );
};

export default Appointment;
