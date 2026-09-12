// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-marketplace-54c17.firebaseapp.com",
  projectId: "real-estate-marketplace-54c17",
  storageBucket: "real-estate-marketplace-54c17.firebasestorage.app",
  messagingSenderId: "817127288257",
  appId: "1:817127288257:web:18f90bb5f65274eb4d5340",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
