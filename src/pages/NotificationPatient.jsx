import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import fetchData from "../helper/authApi";
import Loading from "../components/Loading";
import Empty from "../components/Empty";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/reducers/rootSlice";
import { setUserInfo } from "../redux/reducers/rootSlice";
import "../styles/users.css";
import "../styles/notif.css";
import toast from "react-hot-toast";

const NotificationPatient = () => {
  
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  let {userInfo} = useSelector((state) => state.root);
  console.log("User Info:", userInfo);
const [notifications, setNotifications] = useState([]);
    useEffect(() => {
    setNotifications(userInfo?.notifications || []);
  }, [userInfo]);

console.log("Notifications:", notifications);
//   const fetchNotifications = async () => {
//     try {
//       dispatch(setLoading(true));

//       // Fetch all notifications for patient
//       const patient = JSON.parse(localStorage.getItem("doctor"));
//       console.log("Fetching notifications for patient:", patient);
//       console.log("Patient ID:", patient?._id);
//       const response = await fetchData(
//         `http://localhost:5000/api/doctors/${patient._id}/notifications`
//       );
//       console.log("Notifications response:", response);
//       const data = response?.data || [];
//       setNotifications(data);
//       dispatch(setLoading(false));
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       toast.error("Failed to fetch notifications");
//       dispatch(setLoading(false));
//     }
//   };

  const markAsRead = async (notificationId) => {
    try {
        console.log("Marking notification as read:", notificationId);
     const response= await fetchData(
        `http://localhost:5000/api/notifications/${notificationId}/${userInfo._id}/read`,
        "PUT"
      );
      
        const updatedNotification = notifications.map((ele) =>
        ele._id === notificationId ? { ...ele, isRead: true } : ele
      );
        setNotifications(updatedNotification);
      console.log("Notification marked as read:", notifications);
      let updateduserinfo=userInfo;
      updateduserinfo.notifications = notifications;
      console.log("Updated notifications:", updateduserinfo.notifications);
      dispatch(setUserInfo(updateduserinfo));
    //   fetchNotifications(); // refresh after marking
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark as read");
    }
  };

//   useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
     
//       return;
//     }
//   }, [ userInfo]);

  return (
    <>
      <Navbar />
       
        <section className="container notif-section">
          <h2 className="page-heading">Your Notifications</h2>
          {notifications.length > 0 ? (
            <div className="notifications">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Content</th>
                    {/* <th>Date</th>
                    <th>Time</th> */}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((ele, i) => (
                    <tr key={ele?._id}>
                      <td>{i + 1}</td>
                      <td>{ele?.message}</td>
                      {/* <td>{ele?.updatedAt?.split("T")[0]}</td>
                      <td>{ele?.updatedAt?.split("T")[1].split(".")[0]}</td> */}
                      <td>
                        {!ele?.isRead ? (
                          <button
                            className="btn user-btn"
                            onClick={() => markAsRead(ele?._id)}
                          >
                            {ele?.isRead ? "Read" : "Mark as Read"}
                          </button>
                        ) : (
                          <span className="read-label">Read</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </section>
      
      <Footer />
    </>
  );
};

export default NotificationPatient;
