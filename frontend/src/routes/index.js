import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loadable from "../components/Loadable";
import LoginView from "../views/Auth/LoginView";
import SignupView from "../views/Auth/SignupView";
import ForgetPasswordView from "../views/Auth/ForgetpasswordView";
import ResetPasswordView from "./../views/Auth/ResetpasswordView";
import VerifyUserView from "../views/Auth/VierfiyuserView";
import PrivateRoute from "../components/PrivateRoute";
import HomePage from "../views/Home/home.page";
import AppLayout from "../components/AppLayout";



//-----------------------|| ROUTING RENDER ||-----------------------//
const AppRoutes = () => {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route
        path="/app/home"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/app/home" element={ <HomePage /> } />
      </Route>

      {/* Login route */}
      
      <Route path="/login" element={<LoginView />} />
      <Route path="/signup" element={<SignupView />} />
      <Route path="/forgot-password" element={<ForgetPasswordView />} />
      <Route
        path="/reset-password/:email/:token"
        element={<ResetPasswordView />}
      />
       <Route
        path="/verify-email/:email/:token"
        element={<VerifyUserView />}
      />
    </Routes>
  );
};

export default AppRoutes;
