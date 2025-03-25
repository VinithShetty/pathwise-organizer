
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
// Replace with your own Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyDEm-rKNgZaLFnz9L8ZMr3VwF1VsSMZ2BE",
  authDomain: "pathwise-app.firebaseapp.com",
  projectId: "pathwise-app",
  storageBucket: "pathwise-app.appspot.com",
  messagingSenderId: "409427396703",
  appId: "1:409427396703:web:0c7cc1fee26c9ca84be9a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export default app;
