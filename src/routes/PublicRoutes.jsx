import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "../pages/Auth/LoginForm";
import SignUpForm from "../pages/Auth/SignUpForm";
import Mfa from "../pages/Auth/Mfa";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/mfa/:userId" element={<Mfa />} /> 
      <Route path="*" element={<Navigate to="/signup" />} />
    </Routes>
  );
};

export default PublicRoutes;
