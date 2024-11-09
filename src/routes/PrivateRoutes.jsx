import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Home from "../pages/Dashboard/Home";
import Profile from "../pages/Dashboard/Profile";
import Friends from "../pages/Dashboard/Friends";

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  // console.log("isAuthenticated", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/friends" element={<Friends />} />
        {/* <Route path="/admin" element={isAuthenticated ? <AdminPanel /> : <Login />} /> */}
      </Routes>
    </div>
  );
};

export default PrivateRoutes;
