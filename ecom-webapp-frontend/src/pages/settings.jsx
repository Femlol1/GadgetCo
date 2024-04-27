import React, { useState } from "react";
import Helmet from "../components/Helmet/helmet";
import CommonSection from "../components/UI/CommonSection";

function SettingsPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [profilePicture, setProfilePicture] = useState("");

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleProfilePictureChange = (event) => {
		setProfilePicture(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		setUsername("");
		setPassword("");
		setProfilePicture("");
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
							onChange={handleUsernameChange}
						/>
					</label>
					<br />
					<label>
						Password:
						<input
							type="password"
							value={password}
							onChange={handlePasswordChange}
						/>
					</label>
					<br />
					<label>
						Profile Picture:
						<input
							type="file"
							value={profilePicture}
							onChange={handleProfilePictureChange}
						/>
					</label>
					<br />
					<button type="submit">Save</button>
				</form>
			</div>
		</Helmet>
	);
}

export default SettingsPage;
