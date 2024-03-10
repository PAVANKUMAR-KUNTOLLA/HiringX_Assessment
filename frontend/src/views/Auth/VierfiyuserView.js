import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Api from "../../components/Api";

const VerifyUserView = () => {
  const navigate = useNavigate();
  const { email, token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [error, setError] = useState(null);

  const [showAlert, setShowAlert] = useState({
    isAlert: false,
    alertTitle: "",
    alertText: "",
    severity: "",
  });


  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = Api.verify;

    // Get the form data
    const requestData = {
    email,
      token,
    };

    try {
      const response = await axios({
        method: "POST",
        url: `http://localhost:8080${url}`,
        data: requestData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle response
      const { status, data } = response; // Destructure status and data from response

      if (status === 200) {
        // Success: Redirect, display message, etc.
        console.log("Email verification successful:", data);
        setShowAlert({
            isAlert: true,
            alertText: "Email successfully verified! You can now proceed to log in.",
            severity: "success",
            alertTitle: "",
          });
          setTimeout(() => {
            setShowAlert({
              isAlert: false,
              alertText: "",
              severity: "",
              alertTitle: "",
            });
            navigate("/login")
          }, 6000); // Hide alert after 6 seconds
        // You might want to redirect to a different page or show a success message here
      } else {
        // Handle other status codes
        console.log("Email verification failed:", data);
      const message = data.message;

        setShowAlert({
            isAlert: true,
            alertText: message,
            severity: "error",
            alertTitle: "",
          });
          setTimeout(() => {
            setShowAlert({
              isAlert: false,
              alertText: "",
              severity: "",
              alertTitle: "",
            });
          }, 6000);
        // You might want to display an error message to the user
      }
    } catch (error) {
      // Handle errors, e.g., display error message
      console.error("Email verification error:", error);
      const message = error.response.data.message;

      setShowAlert({
        isAlert: true,
        alertText: message,
        severity: "error",
        alertTitle: "",
      });
      setTimeout(() => {
        setShowAlert({
          isAlert: false,
          alertText: "",
          severity: "",
          alertTitle: "",
        });
      }, 6000); // Hide alert after 6 seconds
    }
  };

  return (
    <>
    { showAlert.isAlert && showAlert.severity === "error"? (
        <div className="p-4 mb-4 text-sm text-center text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span className="font-medium">Error! {" "}</span> {showAlert.alertText}
        </div>) : showAlert.isAlert && showAlert.severity === "success" ? (

        <div className="p-4 mb-4 text-sm text-center text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <span className="font-medium">Success! {" "}</span> {showAlert.alertText}
        </div>)
        : null
      }
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Verify your email
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
        <div className="flex justify-center">
            <button
            type="submit"
            className="mt-6 w-medium px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:border-indigo-700 focus:outline-none focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
            >
            Verify Email
            </button>
        </div>
        </form>


        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            onClick={() => navigate("/login")}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            style={{ cursor: "pointer" }}
          >
            Sign in
          </a>
        </p>
      </div>
    </>
  );
};

export default VerifyUserView;
