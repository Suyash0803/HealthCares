import React from "react";
import Sidebar from "../components/Sidebar";

const Dashboard=()=>{
    return(
        <section className="layout-section">
            <div className="layout-container">
                <Sidebar />
                <div className="dashboard-content">
                    <h1>Dashboard</h1>
                    <p>Welcome to the dashboard! Here you can manage your account, view statistics, and more.</p>
                    {/* Add more dashboard content here */}
                </div>
            </div>
        </section>
    )
}
export default Dashboard;