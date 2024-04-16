import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../custom-hooks/useAuth";

const ProtectedRoute = () => {
	const { currentUser, loading, error } = useAuth();

	console.log({ currentUser, loading, error });

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
