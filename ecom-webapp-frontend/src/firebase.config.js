import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDrbUMJa60APbJWI3s2RUqmOXP7iE5Qbl8",
  authDomain: "gadgetco-3794d.firebaseapp.com",
  projectId: "gadgetco-3794d",
  storageBucket: "gadgetco-3794d.appspot.com",
  messagingSenderId: "198680379635",
  appId: "1:198680379635:web:764903c378afed2cf7f786"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app