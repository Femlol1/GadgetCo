import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase.config";

const useAuth = () => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			auth,
			(user) => {
				setLoading(false);
				if (user) {
					setCurrentUser(user);
				} else {
					setCurrentUser(null);
				}
			},
			(error) => {
				setError(error);
				setLoading(false);
			}
		);

		return () => unsubscribe();
	}, []);

	return { currentUser, loading, error };
};

export default useAuth;
