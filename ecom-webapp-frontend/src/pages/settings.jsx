import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import Helmet from "../components/Helmet/helmet";
import CommonSection from "../components/UI/CommonSection";
import { db, storage } from "../firebase.config"; // Import your Firestore configuration

function SettingsPage() {
	const [username, setUsername] = useState("");
	// const [profilePicture, setProfilePicture] = useState("");
	const [profilePictureUrl, setProfilePictureUrl] = useState("");
	const [userDocId, setUserDocId] = useState("");

	const userId = "current_user_id";

	useEffect(() => {
		// Fetch user data from Firestore
		const fetchUserData = async () => {
			const docRef = doc(db, "users", userId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const data = docSnap.data();
				setUsername(data.username);
				setProfilePictureUrl(data.profilePicture);
				setUserDocId(docSnap.id);
			} else {
				console.log("No such user!");
			}
		};

		fetchUserData();
	}, [userId]);

	const handleProfilePictureChange = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
		await uploadBytes(storageRef, file);

		const downloadUrl = await getDownloadURL(storageRef);
		setProfilePictureUrl(downloadUrl);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const userRef = doc(db, "users", userDocId);
		await updateDoc(userRef, {
			username: username,
			profilePicture: profilePictureUrl,
		});
	};

	return (
		<Helmet title="Settings">
			<CommonSection title="Settings" />
			<div>
				<h1>Settings</h1>
				<form onSubmit={handleSubmit}>
					<label>
						Username:
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</label>

					<br />
					<label>
						Profile Picture:
						<input type="file" onChange={handleProfilePictureChange} />
					</label>
					{profilePictureUrl && <img src={profilePictureUrl} alt="Profile" />}
					<br />
					<button type="submit">Save</button>
				</form>
			</div>
		</Helmet>
	);
}

export default SettingsPage;
