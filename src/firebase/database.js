// Import the functions you need from the SDKs you need
import app from "./firebaseSetup.js"
import { getFirestore , collection, addDoc } from "firebase/firestore"; 

const db = getFirestore(app);

async function addPinpoint(x, y){
    try {
        const test = await addDoc(collection(db, "posts"), {
            xCoordinate: x,
            yCoordinate: y,
        });
        console.log("Document written with ID: ", test.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
export {addPinpoint};