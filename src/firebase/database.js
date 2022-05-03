import app from "./firebaseSetup.js"
import { getFirestore , collection, setDoc, doc } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";

const storage = getStorage(app);
const db = getFirestore(app);

//NOTE: image field should be a File or Blob object when inserting data into database, but should be a URL when getting data.
class Post{
    constructor(author, title, description, species, image, latitude, longitude, rating=0){
        this.author = author;
        this.title = title;
        this.description = description;
        this.species = species;
        this.image = image;
        this.latitude = latitude;
        this.longitude = longitude;
        this.rating = rating;
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
        return new Post(data.author, data.title, data.description, data.species, data.image, data.latitude, data.longitude, data.rating);
    }
};

async function addNewPost(post){
    const newPostRef = doc(collection(db, "posts")).withConverter(postConverter);

    let imagePath = 'images/' + newPostRef.id;
    const storageRef = ref(storage, imagePath);
    await uploadBytes(storageRef, post.image).then((snapshot) => {
        console.log('Uploaded a blob or file!');
    });

    let imageURL = "";
    await getDownloadURL(ref(storage, imagePath))
    .then((url) => {
      imageURL = url;
    });
    
    post.image = imageURL;
    setDoc(newPostRef,post);
}

export {Post, addNewPost};