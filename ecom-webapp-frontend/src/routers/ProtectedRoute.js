import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../custom-hooks/useAuth";

const ProtectedRoute = () => {
	const { currentUser, loading, error } = useAuth();

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	if (!currentUser) {
		toast.warn("You need to login to checkout", {
			position: "top-center",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
		return <Navigate to="/login" />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
