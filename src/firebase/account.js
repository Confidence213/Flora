import app from "./firebaseSetup.js"

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth"
import { getFirestore , doc, setDoc } from "firebase/firestore"; 

const db = getFirestore(app);

const auth = getAuth(app);

export async function makeUser(username, email, password) {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const ref = doc(db, "users", res.user.uid);
        await setDoc(ref, {
          username: username
        });
        await updateProfile(auth.currentUser, {
          displayName: username,
        });
      } catch (err) {
        alert(err.message);
        return false;
      }
    return true;
}

export async function signIn (email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        alert("Wrong email and/or password");
        return false;
      }
    return true;
}

export async function getUsername() {
  const isLoggedIn = await userLoggedIn();
  if(isLoggedIn)
    return auth.currentUser.displayName;
  else
    return null;
}


export async function signOutUser() {
    await signOut();
}

export async function getUserId(){
  const isLoggedIn = await userLoggedIn();
  if(isLoggedIn)
    return auth.currentUser.uid;
  else
    return null;
}

export const userLoggedIn = () => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
      resolve(!!user);
    })
  });
}
