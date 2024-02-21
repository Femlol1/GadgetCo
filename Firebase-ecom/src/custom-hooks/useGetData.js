import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase.config";

const useGetData = (collectionName) => {
	const [data, setData] = useState([]);
	const [loading, setloading] = useState(true);
	const collectionRef = collection(db, collectionName);

	useEffect(() => {
		const getData = async () => {
			// === firebase firestore realtime update data ====
			await onSnapshot(collectionRef, (snapshot) => {
				setData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
				setloading(false);
			});
		};

		getData();
	}, [collectionRef]);
	return { data, loading };
};

export default useGetData;
