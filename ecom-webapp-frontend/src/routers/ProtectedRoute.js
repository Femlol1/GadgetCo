import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../custom-hooks/useAuth";

// I define the ProtectedRoute component
const ProtectedRoute = () => {
	// I use the custom hook useAuth to get the current user, loading state, and any error
	const { currentUser, loading, error } = useAuth();

	// If the auth state is still loading, I show a loading message
	if (loading) {
		return <div>Loading...</div>;
	}
	// If there was an error, I show an error message
	if (error) {
		return <div>Error: {error.message}</div>;
	}

	// If there is no current user, I show a warning and navigate to the login page
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
