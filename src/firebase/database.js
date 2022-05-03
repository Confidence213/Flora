// Import the functions you need from the SDKs you need
import app from "./firebaseSetup.js"
import { getFirestore , collection, addDoc } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage(app);
const db = getFirestore(app);

function uploadImage(file){
    let name = 'images/' + file.name;
    const storageRef = ref(storage, name);
    uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
    });
}

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
export {addPinpoint, uploadImage};