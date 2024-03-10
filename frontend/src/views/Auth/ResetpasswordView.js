import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Api from "../../components/Api";
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const ResetPasswordView = () => {
  const navigate = useNavigate();
  const { email, token } = useParams();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showAlert, setShowAlert] = useState({
    isAlert: false,
    alertTitle: "",
    alertText: "",
    severity: "",
  });

  const [formData, setFormData] = useState({
    password: "",
    confirmpassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = Api.resetPassword;

    // Get the form data
    const requestData = {
      password: formData.password,
      confirmpassword: formData.confirmpassword,
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
        console.log("Password reset successful:", data);
        setShowAlert({
          isAlert: true,
          alertText: "Password reset successful:. Please Login.",
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
        }, 6000);
        // You might want to redirect to a different page or show a success message here
      } else {
        // Handle other status codes
        console.log("Password reset failed:", data);
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
      console.error("Password reset error:", error);
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
      }, 6000); 
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            Reset Your Password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 py-1"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
            </div>

            <div>
              <label
                htmlFor="confirmpassword"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="confirmpassword"
                  name="confirmpassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.confirmpassword}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 py-1"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Reset Password
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
      </div>
    </>
  );
};

export default ResetPasswordView;
