// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, addDoc } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBI-bf_fmT7aNBKE5wRfFodDA_2gs0nvys",
  authDomain: "florafauna-d7d60.firebaseapp.com",
  projectId: "florafauna-d7d60",
  storageBucket: "florafauna-d7d60.appspot.com",
  messagingSenderId: "912979841637",
  appId: "1:912979841637:web:2b4c0430f5dbfaeb576c8c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
