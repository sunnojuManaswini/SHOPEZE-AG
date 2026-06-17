import React from "react";
import { Navigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const ProtectedAdminRoute = ({ children }) => {
  const { currentUser } = useShop();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "admin") {
    // Redirect standard customers to home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
