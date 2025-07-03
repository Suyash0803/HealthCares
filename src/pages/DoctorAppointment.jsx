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
      console.log("Retrieving appointments for doctor ID:", doctorId);

      dispatch(setLoading(true));

      const response = await fetchData(
        `http://localhost:5000/api/doctors/${doctorId}/appointments`
      );

      console.log("Appointments fetched:", response);

      // Adjust based on your backend's response structure
      const appointmentsData = response?.data?.data || response?.data || [];
      console.log("Appointments data:", appointmentsData);
      setAppointments(appointmentsData);
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
      dispatch(setLoading(false));
    }
  };
//   const updateStatus = async (appointmentId, newStatus) => {
//   try {
//     dispatch(setLoading(true));

//     const response = await fetchData(
//       `http://localhost:5000/api/doctors/${doctorId}/appointments/${appointmentId}`,
//       "PUT", // or "PUT" depending on your backend
//       { status: newStatus }
//     );
//     console.log("Update response:", response);

//     toast.success(`Appointment ${newStatus.toLowerCase()} successfully`);

//     // Refresh appointments
//     retrieveAllAppointments();
//   } catch (error) {
//     toast.error("Failed to update appointment status");
//     console.error("Update error:", error);
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

const updateStatus = async (appointmentId, newStatus) => {
  try {
    console.log("Sending update request:", appointmentId, newStatus);

    dispatch(setLoading(true));

    const response = await fetchData(
      `http://localhost:5000/api/doctors/${doctorId}/appointments/${appointmentId}`,
      "PUT",
      { status: newStatus }
    );

    console.log("✅ Update response:", response);
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
                        {
                            
                        appointments.length > 0 &&
                          doctorId === appointments[0]?.doctorId?._id && (
                            <th>Action</th>
                          )
                          
                          }
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((ele, i) => (
                        <tr key={ele?._id}>
                          <td>{i + 1}</td>
                          <td>{ele?.doctorId?.name || "N/A"}</td>
                          <td>{ele?.patientId?.name || "N/A"}</td>
                          <td>{ele?.date}</td>
                          <td>{ele?.time}</td>
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
  {ele.status !== "Completed" && ele.status !== "Cancelled" && (
    <>
      <button
        className="btn user-btn accept-btn"
        title="Confirm"
        onClick={() => updateStatus(ele._id, "confirmed")}
      >
        ✅
      </button>
      <button
        className="btn user-btn reject-btn"
        title="Cancel"
        onClick={() => updateStatus(ele._id, "cancelled")}
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
    </>
  );
};

export default DoctorAppointment;
