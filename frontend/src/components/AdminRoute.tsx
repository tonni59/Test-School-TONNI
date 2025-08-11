import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface Props {
  children: JSX.Element;
}

export default function AdminRoute({ children }: Props) {
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth.accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (auth.user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
