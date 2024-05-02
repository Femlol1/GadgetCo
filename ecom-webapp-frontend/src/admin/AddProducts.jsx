import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Container, Form, FormGroup, Row } from "reactstrap";
import { db, storage } from "../firebase.config";

const AddProducts = () => {
	const [enterTitle, setEnterTitle] = useState("");
	const [enterShortDesc, setEnterShortDesc] = useState("");
	const [enterDescription, setEnterDescription] = useState("");
	const [enterCategory, setEnterCategory] = useState("");
	const [enterPrice, setEnterPrice] = useState("");
	const [enterProductImg, setEnterProductImg] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const addProduct = async (e) => {
		e.preventDefault();
		setLoading(true); // Set loading to true to indicate the process is starting

		try {
			const storageRef = ref(
				storage,
				`productImages/${Date.now() + enterProductImg.name}`
			);
			const uploadTask = uploadBytesResumable(storageRef, enterProductImg);

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					// Observe state change events such as progress, pause, and resume
				},
				(error) => {
					// Handle unsuccessful uploads
					console.error("Upload failed: ", error);
					toast.error("Image is unable to upload.");
					setLoading(false); // Reset loading state
				},
				() => {
					// Handle successful uploads on complete
					getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
						await addDoc(collection(db, "products"), {
							productName: enterTitle,
							shortDesc: enterShortDesc,
							description: enterDescription,
							category: enterCategory,
							price: enterPrice,
							imgUrl: downloadURL,
						});
					});
				}
			);
			setLoading(false); // Reset loading state
			toast.success("The product has been added.");
			navigate("/dashboard/all-products");
		} catch (error) {
			console.error("Error adding document: ", error);
			toast.error("Failed to add the product.");
			setLoading(false); // Ensure loading state is reset on error
		}
	};
	return (
		<section>
			<Container>
				<Row>
					<Col lg="12">
						{loading ? (
							<h4 className="py-5">Loading../|\..</h4>
						) : (
							<>
								<h4 className="mb-5">Add Product</h4>
								<Form onSubmit={addProduct}>
									<FormGroup className="form__group">
										<span>Product title</span>
										<input
											type="text"
											placeholder="Double Sofa"
											value={enterTitle}
											onChange={(e) => setEnterTitle(e.target.value)}
											required
										/>
									</FormGroup>
									<FormGroup className="form__group">
										<span>Short Description</span>
										<input
											type="text"
											placeholder="Nice and Comfy...."
											value={enterShortDesc}
											onChange={(e) => setEnterShortDesc(e.target.value)}
											required
										/>
									</FormGroup>
									<FormGroup className="form__group">
										<span>Description</span>
										<input
											type="text"
											placeholder="Description"
											value={enterDescription}
											onChange={(e) => setEnterDescription(e.target.value)}
											required
										/>
									</FormGroup>
									<div className="d-flex align-items-center justify-content-between gap-5">
										<FormGroup className="form__group w-50">
											<span>Price</span>
											<input
												type="number"
												placeholder="£123"
												value={enterPrice}
												onChange={(e) => setEnterPrice(e.target.value)}
												required
											/>
										</FormGroup>
										<FormGroup
											className="form__group w-50"
											value={enterCategory}
											onChange={(e) => setEnterCategory(e.target.value)}
										>
											<span>Category</span>
											<select className="w-100 p-2">
												<option>Select category</option>
												<option value="chair">Chair</option>
												<option value="sofa">Sofa</option>
												<option value="watch">Watch</option>
												<option value="mobile">Mobile</option>
												<option value="wireless">Wireless</option>
											</select>
										</FormGroup>
									</div>
									<div>
										<FormGroup className="form__group">
											<span>Product Image</span>
											<input
												type="file"
												onChange={(e) => setEnterProductImg(e.target.files[0])}
												required
											/>
										</FormGroup>
									</div>
									<button className="buy__btn" type="submit">
										Add Product
									</button>
								</Form>
							</>
						)}
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default AddProducts;
