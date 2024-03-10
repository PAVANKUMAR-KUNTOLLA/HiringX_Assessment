import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Api from "../../components/Api";
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const SignupView = () => {
  const navigate = useNavigate();

  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    username: ""
  });

  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const uploadedFileName = e.target.files[0].name;
    setFileName(uploadedFileName);
  };
  const [showAlert, setShowAlert] = useState({
    isAlert: false,
    alertTitle: "",
    alertText: "",
    severity: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = Api.signup;

    // Get the form data
    const formData = new FormData(event.target);

    // Append the file to the form data
    formData.append('profilePicture',fileName);
    console.log(formData)

    try {
      const response = await axios({
        method: "POST",
        url: `http://localhost:8080${url}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle response
      const { status, data } = response; // Destructure status and data from response

      if (status === 201) {
        // Success: Redirect, display message, etc.
        console.log("Signup successful:", data); // Modified to "Signup successful"
        setShowAlert({
          isAlert: true,
          alertText: "Signup successful. Check your mail to verify.",
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
          navigate("/login");
        }, 6000); 
       
      } else {
        // Handle other status codes
        console.log("Signup failed:", data); // Modified to "Signup failed"
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
      }
    } catch (error) {
      // Handle errors, e.g., display error message
      console.error("Signup error:", error); // Modified to "Signup error"
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


  const handleTermsChange = (event) => {
    setAgreeTerms(event.target.checked);
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
            Sign up for an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

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


            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username {" "}(Optional)
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="janesmith"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                Photo {" "}(Optional)
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                <button
                  type="button"
                  className="relative rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer rounded-md font-semibold text-indigo-600 "
                  >
                    <span>Upload Photo</span>
                    <input id="file-upload" name="profilePicture" type="file" className="sr-only" onChange={handleFileUpload} />
                  </label>
                </button>
              </div> 
              {fileName && <div className="text-sm font-semibold text-indigo-700 ml-2">{fileName}</div>}

            </div>

            <div className="mt-4 flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={handleTermsChange}
                  required
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the Terms and Conditions
                </label>
              </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>


          <p className="mt-5 text-center text-sm text-gray-500">
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

export default SignupView;
