import app from "./firebaseSetup.js"

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth"
import { getFirestore , doc, setDoc, query, collection, where, getDocs} from "firebase/firestore"; 

const db = getFirestore(app);

const auth = getAuth(app);

export async function makeUser(username, email, password) {
    try {

        const repeatUsernameCheck = collection(db, "users");
        const q = query(repeatUsernameCheck, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        var usernameIsTaken = false;
        querySnapshot.forEach((doc) => {
          alert("Username already taken");
          usernameIsTaken = true;
        });
        if(usernameIsTaken){return false;}

        const res = await createUserWithEmailAndPassword(auth, email, password);
        const ref = doc(db, "users", res.user.uid);
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        await setDoc(ref, {
          username: username,
          ismoderator: false,
          totalpostrating: 0,
          totalposts: 0,
          totalcommentrating: 0,
          totalcomments: 0,
          totalspeciesidentificationrating: 0,
          totalspeciesidentifications: 0,
          accountcreationdate: date,
        });

        const likeref = doc(db, "users_likes", res.user.uid);
        await setDoc(likeref, {
          username: username,
        })

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
