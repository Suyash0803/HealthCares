import React from "react";
import {
FaHome,
FaList,
FaUser,
FaUserMd,
FaUsers,
FaEnvelope,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import {setUserInfo} from "../redux/reducers/rootSlice";
import { toast } from "react-toastify";
import "../styles/sidebar.css"

const Sidebar=()=>{
    const dispatch= useDispatch();
    const navigate=useNavigate();

    const handleLogout=()=>{
        dispatch(setUserInfo({}));
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        navigate("/login");
    }
    const activeStyle = {
  color: "#ffffff",
  background: "linear-gradient(135deg, #007bff, #0056b3)",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
  padding: "10px 15px",
  fontWeight: "bold",
  transition: "all 0.3s ease",
  textDecoration: "none",
};

const inactiveStyle = {
  color: "#333",
  backgroundColor: "#f1f1f1",
  borderRadius: "8px",
  padding: "10px 15px",
  transition: "all 0.3s ease",
  textDecoration: "none",
};

    const sidebar=[
        {
            name:"Home",
            icon:<FaHome/>,
            path:"/",
        },
        {
            name:"Doctors",
            icon:<FaUserMd/>,
            path:"/doctors",
        },
        {
            name:"Appointments",
            icon:<FaList/>,
            path:"/appointments"
        },{
             name: "Profile",
            path: "/profile",
             icon: <FaUser />,
        },
        {
            name: "Contact Us",
            icon: <FaEnvelope />,
            path:"/#contact"
        }
    ];
    return(
        <section className="sidebar-section flex-center">
            <div className="sidebar-container">
                <ul>
                    {sidebar.map((item,index)=>{
                        return(
                            <li key={index}>
                                {item.icon}
                                <NavLink
                                    to={item.path}
                                    style={({ isActive }) =>
                                        isActive ? activeStyle : inactiveStyle
                                    }
                                    >{item.name}</NavLink>
                            </li>
                        );
                    })}
                </ul>
                <div className="logout-container">
            <MdLogout />
            <p onClick={handleLogout}>Logout</p>
          </div>
            </div>
        </section>
    )
}
export default Sidebar;