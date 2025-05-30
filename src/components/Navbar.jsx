import {NavLink, useNavigate} from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "../styles/navbar.css";
import { FiMenu } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";

const Navbar=()=>{
    return(
        <>
          <nav className="nav-active">
            <h2 className="nav-logo">
                <NavLink to={"/"}>HealthCare</NavLink>

            </h2>
            <ul className="nav-links">
                <li>
                    <NavLink to ={"/"}>Home</NavLink>
                </li>
                <li>
                    <NavLink to={"/doctors-appointment"}>Doctors</NavLink>
                </li>
                <li>
                    <NavLink to={"/appointments"}>Appointments</NavLink>
                </li>
                <li>
                    <NavLink to={"/notifications"}>Notifications</NavLink>
                </li>
                <li>
                <HashLink to={"/#contact"}>Contact Us</HashLink>
              </li>
              <li>
                <NavLink
                  className="btn"
                  to={"/login"}
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="btn"
                  to={"/register"}
                >
                  Register
                </NavLink>
              </li>
            </ul>
          </nav>
        </>
    )
}

export default Navbar;