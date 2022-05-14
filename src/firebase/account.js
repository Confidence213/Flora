import app from "./firebaseSetup.js"
import { useAuthState } from "react-firebase-hooks/auth";

import {
    getAuth,
    EmailAuthCredential,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    currentUser,
} from "firebase/auth"
import { getFirestore , collection, addDoc } from "firebase/firestore"; 

const db = getFirestore(app);

const auth = getAuth(app);

export async function makeUser(username, email, password) {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          username,
          authProvider: "local",
          email,
        });
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
}

export async function signIn (email, password) {
    try {
        await signInWithEmailAndPassword(email, password);
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
}

export async function getUsername() {
    return auth.currentUser.displayName;
}

export async function signOutUser() {
    signOut()
}