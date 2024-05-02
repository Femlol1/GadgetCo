import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../custom-hooks/useAuth";
import { db } from "../firebase.config";

// Define the AdminProtectedRoute component
const AdminProtectedRoute = () => {
	// Define the AdminProtectedRoute component
	const { currentUser, loading, error } = useAuth();
	// Define state variables for admin status and whether the admin check has completed
	const [isAdmin, setIsAdmin] = useState(false);
	const [adminCheckCompleted, setAdminCheckCompleted] = useState(false);

	// Use an effect to check the admin status of the current user when the user changes
	useEffect(() => {
		if (currentUser) {
			const fetchAdminStatus = async () => {
				// Get a reference to the document for the current user
				try {
					const docRef = doc(db, "users", currentUser.uid);
					// Fetch the document
					const docSnap = await getDoc(docRef);

					// If the document exists and the user is an admin, set isAdmin to true
					if (docSnap.exists() && docSnap.data().isAdmin) {
						setIsAdmin(true);
					} else {
						setIsAdmin(false);
					}
				} catch (error) {
					// Log any error and show a toast notification
					console.error("Error fetching admin status:", error);
					toast.error("Failed to fetch admin privileges.");
				}
				setAdminCheckCompleted(true);
			};

			// Call the fetchAdminStatus function
			fetchAdminStatus();
		} else {
			// If there is no current user, set adminCheckCompleted to true
			setAdminCheckCompleted(true);
		}
	}, [currentUser]);
	// If the auth state is still loading or the admin check has not completed, show a loading message
	if (loading || !adminCheckCompleted) {
		return <div>Loading...</div>;
	}
	// If there was an error, show an error message
	if (error) {
		toast.error(error.message);
		return <div>Error: {error.message}</div>;
	}
	// If there is no current user or the user is not an admin, show a warning and navigate to the login page
	if (!currentUser && !isAdmin) {
		toast.warn("You need admin privileges to access this page.", {
			position: "top-center",
			autoClose: 500,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};

export default AdminProtectedRoute;
