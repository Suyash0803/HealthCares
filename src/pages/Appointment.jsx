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
  const patientId = patient?._id;

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
                              ? new Date(ele.appointmentDate).toLocaleDateString("en-IN", {
                                  timeZone: "Asia/Kolkata",
                                })
                              : "Not Confirmed"}
                          </td>
                          <td>{ele?.appointmentTime || "Not Confirmed"}</td>
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
