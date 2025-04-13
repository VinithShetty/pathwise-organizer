
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
// Replace with your own Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCQGNSpPCdVx2edqmKnOCk0KTd445p9LyY",
  authDomain: "learningpathorganizer.firebaseapp.com",
  projectId: "learningpathorganizer",
  storageBucket: "learningpathorganizer.appspot.com",
  messagingSenderId: "434411046513",
  appId: "1:434411046513:web:7ab544302cd743c52f3dd0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
