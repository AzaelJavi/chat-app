import React from "react";
import useCurrentUser from "../customHooks/useCurrentUser";
import { Navigate, Outlet } from "react-router-dom";
import authService from "../services/authService";

function ProtectedRoute(props) {
	const user = authService.getCurrentUser();

	// If localStorage for user is empty, proceed to /login
	if (!user) {
		authService.logout();
		return <Navigate to={"/login"} replace={true} />;
	}
	return <Outlet />;
}

export default ProtectedRoute;
