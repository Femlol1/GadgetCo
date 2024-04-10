import { useEffect, useState } from "react";
import { auth } from "../firebase";

const UserController = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				// User is signed in
				setUser(authUser);
			} else {
				// User is signed out
				setUser(null);
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<div>
			{user ? (
				<p>Welcome, {user.displayName}</p>
			) : (
				<p>Please sign in to continue</p>
			)}
		</div>
	);
};

export default UserController;
