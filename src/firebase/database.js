import app from "./firebaseSetup.js"
import { getFirestore, collection, setDoc, doc, getDoc, getDocs, query, where, increment, updateDoc, orderBy, arrayUnion} from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {getUserId} from "./account.js"
const storage = getStorage(app);
const db = getFirestore(app);

//NOTE: image field should be a File or Blob object when inserting data into database, but should be a URL when getting data.
class Post{
    constructor(author, title, description, species, image, latitude, longitude, date, rating=0, id=-1){
        this.author = author;
        this.title = title;
        this.description = description;
        this.species = species;
        this.image = image;
        this.latitude = latitude;
        this.longitude = longitude;
        this.date = date;
        this.rating = rating;
        this.id = id;
    }
}

class Comment{
    constructor(text, author, date, rating=0, id=-1){
        this.text = text;
        this.author=author;
        this.rating=rating;
        this.date = date;
        this.id = id;
    }
}

class SpeciesIdentification extends Comment{
    constructor(species, text, author, date, rating=0, id=-1){
        super(text, author, date, rating, id);
        this.species=species;
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
                date: post.date,
                rating: post.rating,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Post(data.author, data.title, data.description, data.species, data.image, data.latitude, data.longitude, data.date, data.rating, snapshot.id);
    }
};

const commentConverter ={
    toFirestore: (comment) => {
        return {
            text: comment.text,
            author: comment.author,
            rating: comment.rating,
            date: comment.date
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Comment(data.text, data.author, data.date, data.rating, snapshot.id);
    }
}

const speciesIdentificationConverter ={
    toFirestore: (speciesIdentification) => {
        return {
            species: speciesIdentification.species,
            text: speciesIdentification.text,
            author: speciesIdentification.author,
            rating: speciesIdentification.rating,
            date: speciesIdentification.date
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new SpeciesIdentification(data.species, data.text, data.author, data.date, data.rating, snapshot.id);
    }
}

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
    await setDoc(newPostRef,post);

    let userid = await getUserId();
    const userRef = doc(db, "users", userid);
    await updateDoc(userRef,{
        totalposts: increment(1),
    });

    return true;
}

async function addCommentToPost(comment, postId){
    const ref = doc(collection(db, 'comments/' + postId + '/comments')).withConverter(commentConverter);
    await setDoc(ref, comment);

    let userid = await getUserId();
    const userRef = doc(db, "users", userid);
    await updateDoc(userRef,{
        totalcomments: increment(1),
    });
}

async function addSpeciesIdentification(speciesIdentification, postId){
    const ref = doc(collection(db, 'species_identification/' + postId + '/comments')).withConverter(speciesIdentificationConverter);
    await setDoc(ref, speciesIdentification);

    let userid = await getUserId();
    const userRef = doc(db, "users", userid);
    await updateDoc(userRef,{
        totalspeciesidentifications: increment(1),
    });
}

async function getPostById(id){
    const ref = doc(db, "posts", id).withConverter(postConverter);
    const docSnap = await getDoc(ref);
    return docSnap.data();
}

//Returns a map of id (string) -> Post objects
async function getAllPosts(){
    const ref = collection(db, "posts").withConverter(postConverter);
    const q = query(ref, orderBy("rating","desc"));
    const querySnapshot = await getDocs(q);
    let map = new Map();
    querySnapshot.forEach((doc) => {
        map.set(doc.id, doc.data());
    });
    return map;
}

async function getPostsBySpecies(species){
    const ref = collection(db, "posts").withConverter(postConverter);
    const q = query(ref, where("species", "==", species), orderBy("rating","desc"));
    const querySnapshot = await getDocs(q);
    let map = new Map();
    querySnapshot.forEach((doc) => {
        map.set(doc.id, doc.data());
    });
    return map;
}

async function getPostsByLocation(longMax, longMin, latMax, latMin){
    const ref = collection(db, "posts").withConverter(postConverter);
    const q = query(ref, where("longitude", "<=", longMax), where("longitude", ">=", longMin));
    const querySnapshot = await getDocs(q);

    let arr = [];
    querySnapshot.forEach((doc) => {
        let currentLatitude = doc.data().latitude;
        if(currentLatitude <= latMax && currentLatitude >= latMin){
            arr.push(doc.data());
        }
    });

    arr.sort((a,b) => b.rating - a.rating);
    let map = new Map(arr.map(post => [post.id, post]));
    return map;
}

async function getPostsBySpeciesAndLocation(species, longMax, longMin, latMax, latMin){
    const ref = collection(db, "posts").withConverter(postConverter);
    const q = query(ref, where("species", "==", species), where("longitude", "<=", longMax), where("longitude", ">=", longMin));
    const querySnapshot = await getDocs(q);

    let arr = [];
    querySnapshot.forEach((doc) => {
        let currentLatitude = doc.data().latitude;
        if(currentLatitude <= latMax && currentLatitude >= latMin){
            arr.push(doc.data());
        }
    });
    arr.sort((a,b) => b.rating - a.rating);
    let map = new Map(arr.map(post => [post.id, post]));
    return map;
}

//Warning: Does not check if document with id postId exists
async function getCommentsByPost(postId){
    const ref = collection(db, "comments/" + postId + "/comments").withConverter(commentConverter);
    const q = query(ref, orderBy("rating","desc"));
    const querySnapshot = await getDocs(q);
    let map = new Map();
    querySnapshot.forEach((doc) => {
        map.set(doc.id, doc.data());
    });
    return map;
}

async function getSpeciesIdentificationByPost(postId){
    const ref = collection(db, "species_identification/" + postId + "/comments").withConverter(speciesIdentificationConverter);
    const q = query(ref, orderBy("rating","desc"));
    const querySnapshot = await getDocs(q);
    let map = new Map();
    querySnapshot.forEach((doc) => {
        map.set(doc.id, doc.data());
    });
    return map;
}

async function incrementPostRating(postId){
    //TODO: Check if user has already liked/disliked post
    const ref = doc(collection(db, 'posts'), postId);
    updateDoc(ref,{
        rating: increment(1)
    });
}

async function decrementPostRating(postId){
    //TODO: Check if user has already liked/disliked post
    const ref = doc(collection(db, 'posts'), postId);
    updateDoc(ref,{
        rating: increment(-1)
    });
}

async function incrementCommentRating(postId, commentId){
    //TODO: Check if user has already liked/disliked post
    const ref = doc(collection(db, "comments/" + postId + "/comments"), commentId);
    updateDoc(ref,{
        rating: increment(1)
    });
}

async function decrementCommentRating(postId, commentId){
    //TODO: Check if user has already liked/disliked post
    const ref = doc(collection(db, "comments/" + postId + "/comments"), commentId);
    updateDoc(ref,{
        rating: increment(-1)
    });
}

async function incrementSpeciesIdentificationRating(postId, speciesIdentificationId){
    //TODO: Check if user has already liked/disliked post
    const ref = doc(collection(db, "species_identification/" + postId + "/comments"), speciesIdentificationId);
    updateDoc(ref,{
        rating: increment(1)
    });
}

async function decrementSpeciesIdentificationRating(postId, speciesIdentificationId){
    //TODO: Check if user has already liked/disliked post
    const ref = doc(collection(db, "species_identification/" + postId + "/comments"), speciesIdentificationId);
    updateDoc(ref,{
        rating: increment(-1)
    });
}


export {Post, Comment, SpeciesIdentification, addNewPost, getPostById, getAllPosts, getPostsBySpecies, getPostsByLocation, getPostsBySpeciesAndLocation, addCommentToPost, getCommentsByPost, incrementPostRating, decrementPostRating, incrementCommentRating, decrementCommentRating};
export {addSpeciesIdentification, getSpeciesIdentificationByPost, incrementSpeciesIdentificationRating, decrementSpeciesIdentificationRating};