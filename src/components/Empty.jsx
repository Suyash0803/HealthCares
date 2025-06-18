import React from "react";
import "../styles/error.css";
import { NavLink } from "react-router-dom";


const Empty=()=>{
    return(
        <div className="error-page">
        <div className="error">
            <h2>Nothing Here</h2>
            <br></br>
            <NavLink to={"/"} className="btn">
                Go to Home
            </NavLink>
        </div>
        </div>
    )
};
export default Empty;