import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import fetchData from "../helper/authApi";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/reducers/rootSlice";
import toast from "react-hot-toast";
import "../styles/appoint.css";
import "../styles/bookappointment.css"; // ✅ reuse modal styling
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

  // ✅ Fetch appointments for this doctor
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
      console.error("❌ Error fetching appointments:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ✅ Update appointment status (confirm/cancel)
  const updateStatus = async (
    appointmentId,
    newStatus,
    appointmentDate = null,
    appointmentTime = null
  ) => {
    try {
      dispatch(setLoading(true));

      await fetchData(
        `http://localhost:5000/api/doctors/${doctorId}/appointments/${appointmentId}`,
        "PUT",
        {
          status: newStatus,
          appointmentDate,
          appointmentTime,
        }
      );

      toast.success(
        `Appointment ${newStatus === "confirmed" ? "confirmed" : "cancelled"} successfully`
      );

      // ✅ Refresh appointments after update
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

  // ✅ Open confirm modal
  const openConfirmModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowModal(true);
  };

  // ✅ Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointmentId(null);
    setAppointmentDate("");
    setAppointmentTime("");
  };

  // ✅ Handle confirm from modal
  const handleConfirm = () => {
    if (!appointmentDate || !appointmentTime) {
      toast.error("Please select both date and time");
      return;
    }

    updateStatus(
      selectedAppointmentId,
      "confirmed",
      appointmentDate,
      appointmentTime
    );

    closeModal();
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
                        <th>Patient</th>
                        <th>Appointment Date</th>
                        <th>Appointment Time</th>
                        <th>Booking Date</th>
                        <th>Booking Time</th>
                        <th>Status</th>
                        <th>Action</th>
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
                              ? new Date(ele?.appointmentDate).toLocaleDateString("en-IN", {
                                  timeZone: "Asia/Kolkata",
                                })
                              : "N/A"}
                          </td>
                          <td>{ele?.appointmentTime || "N/A"}</td>
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

                          {/* ✅ Show confirm/cancel only if pending */}
                          <td>
                            {/* {ele?.status === "pending" && (
                              <>
                                <button
                                  className="btn blue-btn"
                                  title="Confirm"
                                  onClick={() => openConfirmModal(ele._id)}
                                >
                                  ✅ 
                                </button>
                                <button
                                  className="btn cancel-btn"
                                  title="Cancel"
                                  onClick={() =>
                                    updateStatus(ele._id, "cancelled")
                                  }
                                >
                                  ❌ 
                                </button>
                              </>
                            )} */}
                            {ele?.status === "pending" && (
  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
    <button
      className="btn blue-btn"
      title="Confirm"
      onClick={() => openConfirmModal(ele._id)}
    >
      ✅
    </button>
    <button
      className="btn cancel-btn"
      title="Cancel"
      onClick={() => updateStatus(ele._id, "cancelled")}
    >
      ❌
    </button>
  </div>
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

      {/* ✅ Modal for confirming appointment */}
      {showModal && (
        <div className="modal flex-center">
          <div className="modal__content">
            <h2 className="page-heading">Set Appointment Date & Time</h2>

            <form
              className="register-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
            >
              <input
                type="date"
                className="form-input"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />

              <input
                type="time"
                className="form-input"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
              />

              <div className="modal-buttons">
                <button type="submit" className="btn blue-btn">
                  ✅ 
                </button>
                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={closeModal}
                >
                  ❌ 
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorAppointment;
