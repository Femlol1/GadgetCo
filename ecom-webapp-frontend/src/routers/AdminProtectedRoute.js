import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../custom-hooks/useAuth";
import { db } from "../firebase.config";

const AdminProtectedRoute = () => {
	const { currentUser, loading, error } = useAuth();
	const [isAdmin, setIsAdmin] = useState(false);
	const [adminCheckCompleted, setAdminCheckCompleted] = useState(false);

	useEffect(() => {
		if (currentUser) {
			const fetchAdminStatus = async () => {
				try {
					const docRef = doc(db, "users", currentUser.uid);
					const docSnap = await getDoc(docRef);

					if (docSnap.exists() && docSnap.data().isAdmin) {
						setIsAdmin(true);
					} else {
						setIsAdmin(false);
					}
				} catch (error) {
					console.error("Error fetching admin status:", error);
					toast.error("Failed to fetch admin privileges.");
				}
				setAdminCheckCompleted(true);
			};

			fetchAdminStatus();
		} else {
			setAdminCheckCompleted(true);
		}
	}, [currentUser]);

	if (loading || !adminCheckCompleted) {
		return <div>Loading...</div>;
	}

	if (error) {
		toast.error(error.message);
		return <div>Error: {error.message}</div>;
	}

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
