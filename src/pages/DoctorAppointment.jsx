import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import fetchData from "../helper/authApi";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/reducers/rootSlice";
import toast from "react-hot-toast";
import "../styles/appoint.css";
import Error from "../pages/Error";

const DoctorAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const doctor = JSON.parse(localStorage.getItem("doctor"));
  const doctorId = doctor?._id;

  const retrieveAllAppointments = async () => {
    try {
      if (!doctorId) {
        toast.error("Doctor ID not found");
        return;
      }
      dispatch(setLoading(true));

      const response = await fetchData(
        `http://localhost:5000/api/doctors/${doctorId}/appointments`
      );

      const appointmentsData = response?.data?.data || response?.data || [];
      setAppointments(appointmentsData);
    } catch (error) {
      toast.error("Failed to fetch appointments");
      console.error("Error fetching appointments:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateStatus = async (
    appointmentId,
    newStatus,
    appointmentDate = null,
    appointmentTime = null
  ) => {
    try {
      dispatch(setLoading(true));
      const response = await fetchData(
        `http://localhost:5000/api/doctors/${doctorId}/appointments/${appointmentId}`,
        "PUT",
        {
          status: newStatus,
          appointmentDate,
          appointmentTime,
        }
      );

      toast.success(`Appointment ${newStatus.toLowerCase()} successfully`);
      retrieveAllAppointments();
    } catch (error) {
      console.error("❌ Update failed:", error.message);
      toast.error("Failed to update appointment status");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    retrieveAllAppointments();
  }, []);

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
                        <th>Patient</th>
                        <th>Appointment Date</th>
                        <th>Appointment Time</th>
                        <th>Booking Date</th>
                        <th>Booking Time</th>
                        <th>Status</th>
                        {appointments.length > 0 &&
                          doctorId === appointments[0]?.doctorId?._id && (
                            <th>Action</th>
                          )}
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((ele, i) => (
                        <tr key={ele?._id}>
                          <td>{i + 1}</td>
                          <td>{ele?.doctorId?.name || "N/A"}</td>
                          <td>{ele?.patientId?.name || "N/A"}</td>
                          <td>
                            {ele?.appointmentDate
                              ? new Date(ele?.appointmentDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>
                            {ele?.appointmentTime
                              ? ele?.appointmentTime
                              : "N/A"}
                          </td>
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
                          <td>{ele?.status}</td>
                          {doctorId === ele?.doctorId?._id && (
                            <td>
                              {ele.status !== "Completed" &&
                                ele.status !== "Cancelled" && (
                                  <>
                                    <button
                                      className="btn user-btn accept-btn"
                                      title="Confirm"
                                      onClick={() => {
                                        setSelectedAppointmentId(ele._id);
                                        setShowModal(true);
                                      }}
                                    >
                                      ✅
                                    </button>
                                    <button
                                      className="btn user-btn reject-btn"
                                      title="Cancel"
                                      onClick={() =>
                                        updateStatus(ele._id, "cancelled")
                                      }
                                    >
                                      ❌
                                    </button>
                                  </>
                                )}
                            </td>
                          )}
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

      {/* Modal for setting date & time */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Set Appointment Date & Time</h3>
            <label>Date:</label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
            <label>Time:</label>
            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            />
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => {
                  if (!appointmentDate || !appointmentTime) {
                    toast.error("Please set both date and time");
                    return;
                  }
                  updateStatus(
                    selectedAppointmentId,
                    "confirmed",
                    appointmentDate,
                    appointmentTime
                  );
                  setShowModal(false);
                  setAppointmentDate("");
                  setAppointmentTime("");
                }}
                className="btn user-btn accept-btn"
              >
                Confirm Appointment
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn user-btn reject-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorAppointment;
