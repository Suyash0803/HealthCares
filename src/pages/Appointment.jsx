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

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const patient = JSON.parse(localStorage.getItem("patient"));
  const userId = patient?._id;

  const retriveAllApoint = async () => {
    try {
      dispatch(setLoading(true));
      const patientData = JSON.parse(localStorage.getItem("patient"));
      const patientId = patientData?._id;
      if (!patientId) {
        throw new Error("Patient ID not found");
      }

      const response = await fetchData(
        `http://localhost:5000/api/patients/${patientId}/appointments`
      );
      setAppointments(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    retriveAllApoint();
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
                        {userId === appointments[0]?.doctorId?._id && <th>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((ele, i) => (
                        <tr key={ele?._id}>
                          <td>{i + 1}</td>
                          <td>{ele?.doctorId?.name}</td>
                          <td>{ele?.patientId?.name}</td>
                          <td>{ele?.date}</td>
                          <td>{ele?.time}</td>
                          <td>
                            {new Date(ele?.createdAt).toLocaleDateString("en-IN", {
                              timeZone: "Asia/Kolkata",
                            })}
                          </td>
                          <td>
                            {new Date(ele?.createdAt).toLocaleTimeString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })}
                          </td>
                          <td>{ele?.status}</td>
                          {userId === ele?.doctorId?._id && (
                            <td>
                              <button
                                className={`btn user-btn accept-btn ${
                                  ele?.status === "Completed" ? "disable-btn" : ""
                                }`}
                                disabled={ele?.status === "Completed"}
                              >
                                Complete
                              </button>
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

export default Appointment;
