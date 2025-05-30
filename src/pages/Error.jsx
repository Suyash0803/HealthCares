import React from "react";
import "../styles/error.css";
import { NavLink } from "react-router-dom";


const Error=()=>{
    return(
        <div className="error-page">
        <div className="error">
            <h2>Error! Page Not Found</h2>
            <NavLink to={"/"} className="btn">
                Go to Home
            </NavLink>
        </div>
        </div>
    )
};
export default Error;