/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { FaHome, FaUserMd, FaFileMedical, FaCalendarAlt, FaQuestionCircle, FaUser } from "react-icons/fa";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Logo from "/logo.jpg";
import DoctorImage from "../assets/Doctor.png";
import PatientImage from "../assets/Patient.png";
import "../../styles/Dashboard.css";

const Sidebar = ({ user, onSelectItem }) => {
  if (!user) return null; // Ensure user data is loaded

  // Define sidebar items based on user role
  const menuItems =
    user.role === 1 // Patient
      ? [
          { icon: <FaHome />, text: "Home", key: "Home" },
          { icon: <FaUserMd />, text: "Find a Doctor", key: "FindDoctor" },
          { icon: <FaFileMedical />, text: "Medical Reports", key: "MedicalReports" },
          { icon: <FaCalendarAlt />, text: "Schedule", key: "Schedule" },
          { icon: <FaQuestionCircle />, text: "Help", key: "Help" },
        ]
      : // Doctor or Assistant
        [
          { icon: <FaHome />, text: "Home", key: "Home" },
          { icon: <FaUser />, text: "Patients", key: "Patients" },
          { icon: <FaFileMedical />, text: "Medical Reports", key: "MedicalReports" },
          { icon: <FaCalendarAlt />, text: "Schedule", key: "Schedule" },
          { icon: <FaQuestionCircle />, text: "Help", key: "Help" },
        ];

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo" />
      </div>
      {menuItems.map((item) => (
        <NavItem key={item.key} icon={item.icon} text={item.text} onClick={() => onSelectItem(item.key)} />
      ))}
    </div>
  );
};

const NavItem = ({ icon, text, onClick }) => {
  return (
    <div className="nav-item" onClick={onClick}>
      {icon} {text}
    </div>
  );
};

const TopBar = ({ user }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleProfileClick = () => navigate("/editprofile");
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const userImage = user?.role === 1 ? PatientImage : DoctorImage;
  const userTitle = user?.role === 1 ? '' : 'Doctor ';

  return (
    <div className="topbar">
      <h2 className="welcome-text">
        Welcome {userTitle} {user?.firstName || "User"}! 
        <img src={userImage} alt="User Role" className="user-role-image" />
      </h2>
      <div className="topbar-icons">
        <FaUser className="icon" onClick={handleClick} />
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

const DashboardContent = ({ selectedItem, user }) => {
  const roleMapping = { 0: "Doctor", 1: "Patient", 2: "Assistant" };
  const formattedDOB = user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "N/A";
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (selectedItem === "FindDoctor") {
      fetchDoctors();
    }
  }, [selectedItem]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:5156/api/doctors");
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        console.error("Failed to fetch doctors");
      }
    } catch (error) {
      console.error("Error fetching doctors", error);
    }
  };

  //All doctors return
  if (selectedItem === "FindDoctor") {
    return (
      <div className="dashboard-content">
        <h2>Find a Doctor</h2>
        <div className="doctor-list">
          {doctors.map((doctor) => (
            <div key={doctor.Id} className="doctor-card" onClick={() => alert(`Selected Doctor: ${doctor.firstName} ${doctor.lastName}`)}>
              <h3>{doctor.firstName} {doctor.lastName}</h3>
              <p>Specialization: {doctor.specialization || "N/A"}</p>
              <p>License: {doctor.licenseNumber || "N/A"}</p>
              <button className="book-button">Book Appointment</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  //default return
  return (
    <div className="dashboard-content">
      {selectedItem === "Home" && (
        <>
          <div className="card">Personal Information 
            <p>&nbsp;&nbsp;&nbsp;&nbsp;First Name: {user?.firstName}</p> 
            <p>&nbsp;&nbsp;&nbsp;&nbsp;Last Name: {user?.lastName}</p> 
            <p>&nbsp;&nbsp;&nbsp;&nbsp;Email: {user?.email}</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;Role: {roleMapping[user?.role] || "Unknown"}</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;Date of Birth: {formattedDOB}</p>
          </div>
          <div className="card">Notifications Here</div>
          <div className="card">Next Appointments Here</div>
        </>
      )}
      {/* {selectedItem === "FindDoctor" && 
        <div className="card">Find a Doctor Content</div>
      } */}
      {selectedItem === "Patients" && 
        <div className="card">Patients Content</div>
      }
      {selectedItem === "MedicalReports" && 
        <div className="card">Medical Reports Content</div>
      }
      {selectedItem === "Schedule" && 
        <div className="card">Schedule Content</div>
      }
      {selectedItem === "Help" && 
        <div className="card">Help Content</div>
      }
    </div>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState("Home"); // Default view
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5156/api/auth/me`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user data");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        navigate("/");
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="app-container">
      <Sidebar onSelectItem={setSelectedItem} user={user}/>
      <div className="dashboard">
        <TopBar user={user} />
        <DashboardContent selectedItem={selectedItem} user={user} />
      </div>
    </div>
  );
};

export default Dashboard;
