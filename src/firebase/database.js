import app from "./firebaseSetup.js"
import { getFirestore, collection, setDoc, doc, getDoc, getDocs } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage(app);
const db = getFirestore(app);

//NOTE: image field should be a File or Blob object when inserting data into database, but should be a URL when getting data.
class Post{
    constructor(author, title, description, species, image, latitude, longitude, rating=0, id=-1){
        this.author = author;
        this.title = title;
        this.description = description;
        this.species = species;
        this.image = image;
        this.latitude = latitude;
        this.longitude = longitude;
        this.rating = rating;
        this.id = id;
    }
}

const postConverter = {
    toFirestore: (post) => {
        return {
                author: post.author,
                title: post.title,
                description: post.description,
                species: post.species,
                image: post.image,
                latitude: post.latitude,
                longitude: post.longitude,
                rating: post.rating,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Post(data.author, data.title, data.description, data.species, data.image, data.latitude, data.longitude, data.rating, snapshot.id);
    }
};

async function addNewPost(post){
    const newPostRef = doc(collection(db, "posts")).withConverter(postConverter);

    let imagePath = 'images/' + newPostRef.id;
    const storageRef = ref(storage, imagePath);
    await uploadBytes(storageRef, post.image);

    let imageURL = "";
    await getDownloadURL(ref(storage, imagePath))
    .then((url) => {
      imageURL = url;
    });
    
    post.image = imageURL;
    setDoc(newPostRef,post);
}

async function getPostById(id){
    const ref = doc(db, "posts", id).withConverter(postConverter);
    const docSnap = await getDoc(ref);
    return docSnap.data();
}

//Returns a map of id (string) -> Post objects
async function getAllPosts(){
    const ref = collection(db, "posts").withConverter(postConverter)
    const querySnapshot = await getDocs(ref);
    let map = new Map();
    querySnapshot.forEach((doc) => {
        map.set(doc.id, doc.data());
    });
    return map;
}

export {Post, addNewPost, getPostById, getAllPosts};