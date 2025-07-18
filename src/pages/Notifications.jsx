import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import fetchData from "../helper/authApi";
import Loading from "../components/Loading";
import Empty from "../components/Empty";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import toast from "react-hot-toast";
import "../styles/notif.css"; // updated CSS

const NotificationDoctor = () => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const doctor = JSON.parse(localStorage.getItem("doctor"));

  useEffect(() => {
    if (doctor && doctor.notifications) {
      setNotifications(doctor.notifications);
    } else {
      toast.error("Doctor information not found");
    }
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      setLoading(true);
      const response = await fetchData(
        `http://localhost:5000/api/notifications/${notificationId}/${doctor._id}/read`,
        "PUT"
      );

      const updatedNotifications = notifications.map((notif) =>
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      );
      setNotifications(updatedNotifications);

      // Update localStorage and redux
      const updatedDoctor = { ...doctor, notifications: updatedNotifications };
      localStorage.setItem("doctor", JSON.stringify(updatedDoctor));
      dispatch(setUserInfo(updatedDoctor));

      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {loading ? (
        <Loading />
      ) : (
        <section className="container notif-section">
          <h2 className="page-heading">Your Notifications</h2>

          {notifications.length > 0 ? (
            <div className="responsive-table-wrapper">
              <table className="notif-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Content</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((ele, i) => (
                    <tr key={ele?._id}>
                      <td>{i + 1}</td>
                      <td>{ele?.message}</td>
                      <td>
                        {!ele?.isRead ? (
                          <button
                            className="btn user-btn"
                            onClick={() => markAsRead(ele._id)}
                          >
                            Mark as Read
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
      )}

      <Footer />
    </>
  );
};

export default NotificationDoctor;
