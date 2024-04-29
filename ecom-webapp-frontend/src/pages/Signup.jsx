import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container, Form, FormGroup, Row } from "reactstrap";
import Helmet from "../components/Helmet/helmet";

import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import { auth, db, storage } from "../firebase.config";
import "../styles/login.css";

const Signup = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const signup = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			const storageRef = ref(storage, `images/${Date.now() + username}`);
			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				"state_changed",
				(snapshot) => {},
				(error) => {
					toast.error(error.message);
					setLoading(false);
				},

				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
						//update user profile
						await updateProfile(user, {
							displayName: username,
							photoURL: downloadURL,
						});
						//store user data in firestore
						await setDoc(doc(db, "users", user.uid), {
							uid: user.uid,
							displayName: username,
							email,
							photoURL: downloadURL,
						});
					});
				}
			);
			setLoading(false);
			toast.success("Created Account");
			navigate("/home");
		} catch (error) {
			setLoading(false);
			toast.error("something went wrong");
		}
	};
	const handleFileValidation = (file) => {
		if (!file) return; // Do nothing if no file is selected

		const fileType = file.type;
		const validImageTypes = ["image/jpeg", "image/png", "image/gif"]; // Add more if needed

		if (!validImageTypes.includes(fileType)) {
			alert("Please choose a valid image file (JPEG, PNG, GIF).");
			// Optionally, you can clear the file input field or perform other actions
			// Here's an example to clear the file input:
			document.getElementById("profilePicture").value = ""; // Clear the file input
			return;
		}

		// Proceed with setting the file to state or other actions
		setFile(file);
	};

	return (
		<Helmet title="Signup">
			<section>
				<Container>
					<Row>
						{loading ? (
							<Col lg="12" className="text-center">
								<h5 className="fw-bold">Loading':/|\' </h5>
							</Col>
						) : (
							<Col lg="6" className="m-auto text-center">
								<h3 className="fw-bold mb-4">Signup</h3>
								<Form className="auth__form" onSubmit={signup}>
									<FormGroup className="form__group">
										<input
											type="text"
											placeholder="Username"
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											required
										/>
									</FormGroup>
									<FormGroup className="form__group">
										<input
											type="email"
											placeholder="Enter your email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</FormGroup>
									<FormGroup className="form__group">
										<input
											type="password"
											placeholder="Enter your password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
									</FormGroup>
									<FormGroup className="form__group">
										<label htmlFor="profilePicture" style={{ color: "white" }}>
											Choose profile picture
										</label>
										<input
											type="file"
											id="profilePicture"
											accept="image/*"
											onChange={(e) => handleFileValidation(e.target.files[0])}
											required
										/>
									</FormGroup>
									<button type="submit" className="buy__btn auth__btn">
										Signup
									</button>
									<p>
										Already have an account? <Link to="/login">Login</Link>
									</p>
								</Form>
							</Col>
						)}
					</Row>
				</Container>
			</section>
		</Helmet>
	);
};

export default Signup;
