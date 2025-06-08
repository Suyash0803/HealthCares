import React, { use } from "react";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import fetchData from "../helper/authApi";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
// import jwt_decode from "jwt-decode";
import axios from "axios";
import { setLoading } from "../redux/reducers/rootSlice";
import toast from "react-hot-toast";
import "../styles/appoint.css";
import Error from "../pages/Error"

const Appointment=()=>{
    const [appointments, setAppointments] = useState([]);
    const dispatch=useDispatch();
    const {loading}=useSelector((state)=>state.root);
    const patient = JSON.parse(localStorage.getItem("patient"));
const userId = patient?._id;
    const retriveAllApoint=async(e)=>{
        try{
            dispatch(setLoading(true));
           const patientData = JSON.parse(localStorage.getItem("patient"));
            const patientId = patientData?._id;
            console.log("Patient ID:", patientId);
            if (!patientId) {
                throw new Error("Patient ID not found");
            }
            const response = await fetchData(`http://localhost:5000/api/patients/${patientId}/appointments`);
            console.log("Appointments:", response.data);

            setAppointments(response.data); 

            dispatch(setLoading(false));

        }
        catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error("Failed to fetch appointments");
            dispatch(setLoading(false));
        }
    };
    useEffect(() => {
        retriveAllApoint();
    }, []);
//     const complete = async (ele) => {
//     try {
//       await toast.promise(
//         axios.put(
//           "/api/appointment/completed",
//           {
//             appointid: ele?._id,
//             doctorId: ele?.doctorId?._id,
//             doctorname: `${ele?.name}`,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         ),
//         {
//           success: "Appointment booked successfully",
//           error: "Unable to book appointment",
//           loading: "Booking appointment...",
//         }
//       );

//       retriveAllApoint();
//     } catch (error) {
//       return error;
//     }
//   };

    return(
        <>
          <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className="container notif-section">
          <h2 className="page-heading">Your Appointments</h2>

          {appointments.length > 0 ? (
            <div className="appointments">
              <table>
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
                    {userId === appointments[0].doctorId?._id ? (
                      <th>Action</th>
                    ) : (
                      <></>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {appointments?.map((ele, i) => {
                    return (
                      <tr key={ele?._id}>
                        <td>{i + 1}</td>
                        <td>
                          {ele?.doctorId?.name}
                        </td>
                        <td>
                          {ele?.patientId?.name}

                        </td>
                        <td>{ele?.date}</td>
                        <td>{ele?.time}</td>
                        <td>{ele?.createdAt?.split("T")[0] ?? "N/A"}</td>
                        <td>{ele?.updatedAt?.split("T")[1]?.split(".")[0] ?? "N/A"}</td>

                        <td>{ele?.status}</td>
                        {userId === ele?.doctorId?._id ? (
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
                        ) : (
                          <></>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Error />
          )}
        </section>
      )}
      <Footer />
        </>
    )
}
export default Appointment;