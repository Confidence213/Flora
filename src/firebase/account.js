import app from "./firebaseSetup.js"
import { useAuthState } from "react-firebase-hooks/auth";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
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
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
}

export async function getUsername() {
  const isLoggedIn = await userLoggedIn();
  if(isLoggedIn)
    return auth.currentUser.email;
  else
    return null;
}


export async function signOutUser() {
    signOut()
}

export const userLoggedIn = () => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
      resolve(!!user);
    })
  });
}
