import app from "./firebaseSetup.js"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(app);
