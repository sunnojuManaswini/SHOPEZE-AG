import React from "react";
import { Navigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useShop();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
