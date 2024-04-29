import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Helmet from "../components/Helmet/helmet";
import CommonSection from "../components/UI/CommonSection";
import useAuth from "../custom-hooks/useAuth";
import { db, storage } from "../firebase.config";
import "../styles/settings.css";

function SettingsPage() {
	const [username, setUsername] = useState("");
	const [profilePicture, setProfilePicture] = useState(null); // Store the file, not URL
	const { currentUser } = useAuth(); // Assumed to be the Firebase auth user
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		if (currentUser) {
			setUsername(currentUser.displayName || "");
			// For profile picture, you can use currentUser.photoURL to show current picture
		}
	}, [currentUser]);

	const handleProfilePictureChange = (e) => {
		if (e.target.files[0]) {
			setProfilePicture(e.target.files[0]);
		}
		// setProfilePicture(e.target.files[0]); // Store the file object
	};

	const handleUpdateProfile = async (event) => {
		event.preventDefault();
		if (!username) {
			toast.error("Username cannot be empty.");
			return;
		}
		setLoading(true);
		try {
			let downloadURL = currentUser.photoURL; // Default to existing URL

			if (profilePicture) {
				const storageRef = ref(storage, `images/${Date.now() + username}`);
				const snapshot = await uploadBytesResumable(storageRef, profilePicture);
				downloadURL = await getDownloadURL(snapshot.ref);
			}

			await updateProfile(currentUser, {
				displayName: username,
				photoURL: downloadURL,
			});

			const userRef = doc(db, "users", currentUser.uid);
			await updateDoc(userRef, {
				displayName: username,
				photoURL: downloadURL,
			});

			toast.success("Profile updated successfully!");
		} catch (error) {
			toast.error("Failed to update profile: " + error.message);
		} finally {
			setLoading(false);
		}
	};
	if (!currentUser) {
		return <div>Loading...</div>;
	}

	return (
		<Helmet title="Settings">
			<CommonSection title="Settings" />
			<div className="settings-form">
				<form onSubmit={handleUpdateProfile}>
					<label>
						<h4>Current username: {username}</h4>
					</label>
					<label>
						Input new username:
						<input type="text" onChange={(e) => setUsername(e.target.value)} />
					</label>
					<label>
						Profile Picture:
						<input type="file" onChange={handleProfilePictureChange} />
						{currentUser.photoURL && (
							<div className="profile-picture-preview">
								<img src={currentUser.photoURL} alt="Profile" />
							</div>
						)}
					</label>
					<button type="submit" disabled={isLoading}>
						{isLoading ? "Updating..." : "Update Profile"}
					</button>
				</form>
			</div>
		</Helmet>
	);
}

export default SettingsPage;
