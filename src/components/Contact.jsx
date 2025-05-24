import React,{useState} from "react";
import "../styles/contact.css";
const Contact=()=>{
    const [formDetails,setFormDetails]=useState({
        name:"",
        email:"",
        message:""
    });
    const inputChange=(e)=>{
        const {name,value}=e.target;
        setFormDetails({
            ...formDetails,
            [name]:value
        });
    };

    return(
        <section className="register-section flex-center" id="contact">
            <div className="contact-container flex-center contact">
                <h2 className="form-heading">Contact Us</h2>
                <form action="" className="register-form">
                    <input type="text" name="name" className="form-input" placeholder="Enter your name" value={formDetails.name} onChange={inputChange}/>
                    <input type="email" name="email" className="form-input" placeholder="Enter your email" value={formDetails.email} onChange={inputChange}/>
                    <textarea name="message" className="form-input" placeholder="Enter your message" value={formDetails.message} onChange={inputChange}></textarea>
                    <button type="submit" className="btn form-btn">Submit</button>
                </form>
            </div>
        </section>
    )
}
export default Contact;