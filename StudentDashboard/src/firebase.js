import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDsUFG3AJyYSuDMBI0BEcd5GnauqQVjcok",
  authDomain: "studentdashboard-2f6e6.firebaseapp.com",
  projectId: "studentdashboard-2f6e6",
  storageBucket: "studentdashboard-2f6e6.firebasestorage.app",
  messagingSenderId: "650968186943",
  appId: "1:650968186943:web:73d5015f9e03d32755388a",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);