import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1iIWc3Lv6pgeA0Gp5r7-sVvC-6B6psbA",
  authDomain: "clinicconnect-132cb.firebaseapp.com",
  databaseURL: "https://clinicconnect-132cb-default-rtdb.firebaseio.com",
  projectId: "clinicconnect-132cb",
  storageBucket: "clinicconnect-132cb.firebasestorage.app",
  messagingSenderId: "1048793089002",
  appId: "1:1048793089002:web:7972feaf3bf17954a6e893"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app; 