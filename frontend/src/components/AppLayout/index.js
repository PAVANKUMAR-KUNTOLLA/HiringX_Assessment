import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import Api from "../Api";

import Navbar from "./Navbar";

const AppLayout = () => {
  const [showAlert, setShowAlert] = useState({
    isAlert: false,
    alertTitle: "",
    alertText: "",
    severity: "",
  });

  const navigate = useNavigate(); // Initialize navigate

  const handleFetchProfile = async () => {
    const url = Api.profile
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8080${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User profile:", response.data);
      const message = response.data.userProfile.email;

      setShowAlert({
        isAlert: true,
        alertText: message,
        severity: "success",
        alertTitle: "",
      });
      setTimeout(()=> {
        setShowAlert({
          isAlert: false,
          alertText: "",
          severity: "",
          alertTitle: "",
        });
      },6000)

    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      handleFetchProfile(); // Call handleFetchProfile when the token changes
    }
  }, [localStorage.getItem("token")]); // Add handleFetchProfile to dependency array

  return (
    <>
      <div>
        <div>
          <Navbar />
        </div>
        <div>

        { showAlert.isAlert && showAlert.severity === "error"? (
        <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span class="font-medium">Error! {" "}</span> {showAlert.alertText}
        </div>) : showAlert.isAlert && showAlert.severity === "success" ? (

        <div className="p-4 mb-4 text-sm text-center text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
        <span className="font-medium"></span> Welcome {showAlert.alertText}, We're excited to have you join us. 
        </div>)
          : null
          }
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AppLayout;
