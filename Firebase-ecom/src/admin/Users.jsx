import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { toast } from "react-toastify";
import { Col, Container, Row } from "reactstrap";
import useGetData from "../custom-hooks/useGetData";
import { db } from "../firebase.config";

const Users = () => {
	const { data: usersData, loading } = useGetData("users");
	const deleteUser = async (id) => {
		await deleteDoc(doc(db, "users", id));
		toast.success("the user has been deleted");
	};

	return (
		<section>
			<Container>
				<Row>
					<Col lg="12">
						<h4 className="fw-bold">Users</h4>
					</Col>
					<Col lg="12">
						{loading ? (
							<h5 className="pt-5 fw-bold">Loading...</h5>
						) : (
							<table className="table">
								<thead>
									<tr>
										<th>Image</th>
										<th>Username</th>
										<th>Email</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									{usersData.map((user) => (
										<tr key={user.uid}>
											<td>
												<img src={user.photoURL} alt={user.displayName} />
											</td>
											<td>{user.displayName}</td>
											<td>{user.email}</td>
											<td>
												<button
													className="btn btn-danger"
													onClick={() => {
														deleteUser(user.uid);
													}}
												>
													Delete
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default Users;
