import app from "./firebaseSetup.js"
import { getFirestore, collection, setDoc, doc, getDoc, getDocs, query, where, increment, updateDoc, orderBy} from "firebase/firestore"; 
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

var currentUserVotedPosts;

var currentUserVotedComments;
var votedCommentsPost;

var currentUserVotedSpeciesIdentifications;
var votedSpeciesIdentificationsPost;

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

async function incrementPostRating(postId, postAuthor){
    let repeatVoteCheck = await hasUserLikedPost(postId);
    if(repeatVoteCheck){
        return false;
    }
    else{
        currentUserVotedPosts.set(postId, true);
        let userid = await getUserId();
        const userRef = doc(db, "users", userid);
        let path = 'votedposts.' + postId;
        await updateDoc(userRef,{
            [path]: true,
        });
    }
    
    const ref = doc(collection(db, 'posts'), postId);
    await updateDoc(ref,{
        rating: increment(1)
    });

    const authorRef = collection(db, "users");
    const q = query(authorRef, where("username", "==", postAuthor));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        updateDoc(doc.ref,{
            totalpostrating: increment(1)
        })
    });

    return true;
}

async function decrementPostRating(postId, postAuthor){
    let repeatVoteCheck = await hasUserDislikedPost(postId);
    if(repeatVoteCheck){
        return false;
    }
    else{
        currentUserVotedPosts.set(postId, false);
        let userid = await getUserId();
        const userRef = doc(db, "users", userid);
        let path = 'votedposts.' + postId;
        await updateDoc(userRef,{
            [path]: false,
        });
    }   
    
    const ref = doc(collection(db, 'posts'), postId);
    await updateDoc(ref,{
        rating: increment(-1)
    });

    const authorRef = collection(db, "users");
    const q = query(authorRef, where("username", "==", postAuthor));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        updateDoc(doc.ref,{
            totalpostrating: increment(-1)
        })
    });

    return true;
}

async function incrementCommentRating(postId, commentId, commentAuthor){
    let repeatVoteCheck = await hasUserLikedComment(postId, commentId);
    if(repeatVoteCheck){
        return false;
    }
    else{
        currentUserVotedComments.set(commentId, true);
        let userid = await getUserId();
        const userRef = doc(db, "users", userid);
        let path = 'votedcomments.' + postId + '.' + commentId;
        await updateDoc(userRef,{
            [path]: true,
        });
    }
    const ref = doc(collection(db, "comments/" + postId + "/comments"), commentId);
    updateDoc(ref,{
        rating: increment(1)
    });

    const authorRef = collection(db, "users");
    const q = query(authorRef, where("username", "==", commentAuthor));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        updateDoc(doc.ref,{
            totalcommentrating: increment(1)
        })
    });

    return true;
}

async function decrementCommentRating(postId, commentId, commentAuthor){
    let repeatVoteCheck = await hasUserDislikedComment(postId, commentId);
    if(repeatVoteCheck){
        return false;
    }
    else{
        currentUserVotedComments.set(commentId, false);
        let userid = await getUserId();
        const userRef = doc(db, "users", userid);
        let path = 'votedcomments.' + postId + '.' + commentId;
        await updateDoc(userRef,{
            [path]: false,
        });
    }
    const ref = doc(collection(db, "comments/" + postId + "/comments"), commentId);
    updateDoc(ref,{
        rating: increment(-1)
    });

    const authorRef = collection(db, "users");
    const q = query(authorRef, where("username", "==", commentAuthor));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        updateDoc(doc.ref,{
            totalcommentrating: increment(-1)
        })
    });

    return true;
}

async function incrementSpeciesIdentificationRating(postId, speciesIdentificationId, speciesIdentificationAuthor){
    let repeatVoteCheck = await hasUserLikedSpeciesIdentification(postId, speciesIdentificationId);
    if(repeatVoteCheck){
        return false;
    }
    else{
        currentUserVotedSpeciesIdentifications.set(speciesIdentificationId, true);
        let userid = await getUserId();
        const userRef = doc(db, "users", userid);
        let path = 'votedspeciesidentifications.' + postId + '.' + speciesIdentificationId;
        await updateDoc(userRef,{
            [path]: true,
        });
    }

    const ref = doc(collection(db, "species_identification/" + postId + "/comments"), speciesIdentificationId);
    updateDoc(ref,{
        rating: increment(1)
    });

    const authorRef = collection(db, "users");
    const q = query(authorRef, where("username", "==", speciesIdentificationAuthor));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        updateDoc(doc.ref,{
            totalspeciesidentificationrating: increment(1)
        })
    });

    return true;
}

async function decrementSpeciesIdentificationRating(postId, speciesIdentificationId, speciesIdentificationAuthor){
    let repeatVoteCheck = await hasUserDislikedSpeciesIdentification(postId, speciesIdentificationId);
    if(repeatVoteCheck){
        return false;
    }
    else{
        currentUserVotedSpeciesIdentifications.set(speciesIdentificationId, false);
        let userid = await getUserId();
        const userRef = doc(db, "users", userid);
        let path = 'votedspeciesidentifications.' + postId + '.' + speciesIdentificationId;
        await updateDoc(userRef,{
            [path]: false,
        });
    }

    const ref = doc(collection(db, "species_identification/" + postId + "/comments"), speciesIdentificationId);
    updateDoc(ref,{
        rating: increment(-1)
    });

    const authorRef = collection(db, "users");
    const q = query(authorRef, where("username", "==", speciesIdentificationAuthor));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        updateDoc(doc.ref,{
            totalspeciesidentificationrating: increment(-1)
        })
    });

    return true;
}

async function hasUserLikedPost(postId){
    if(currentUserVotedPosts === undefined){
        await getVotedPosts();
    }

    if(currentUserVotedPosts.get(postId) === true){
        return true;
    }
    return false;
}
async function hasUserDislikedPost(postId){
    if(currentUserVotedPosts === undefined){
        await getVotedPosts();
    }

    if(currentUserVotedPosts.get(postId) === false){
        return true;
    }
    return false;
}

async function hasUserLikedComment(postId, commentId){
    if(currentUserVotedComments === undefined || votedCommentsPost !== postId){
        await getVotedComments(postId);
    }
    if(currentUserVotedComments.get(commentId) === true){
        return true;
    }
    return false;
}
async function hasUserDislikedComment(postId, commentId){
    if(currentUserVotedComments === undefined || votedCommentsPost !== postId){
        await getVotedComments(postId);
    }

    if(currentUserVotedComments.get(commentId) === false){
        return true;
    }
    return false;
}

async function hasUserLikedSpeciesIdentification(postId, speciesIdentificationId){
    if(currentUserVotedSpeciesIdentifications === undefined || votedSpeciesIdentificationsPost !== postId){
        await getVotedSpeciesIdentifications(postId);
    }
    if(currentUserVotedSpeciesIdentifications.get(speciesIdentificationId) === true){
        return true;
    }
    return false;
}
async function hasUserDislikedSpeciesIdentification(postId, speciesIdentificationId){
    if(currentUserVotedSpeciesIdentifications === undefined || votedSpeciesIdentificationsPost !== postId){
        await getVotedSpeciesIdentifications(postId);
    }
    if(currentUserVotedSpeciesIdentifications.get(speciesIdentificationId) === false){
        return true;
    }
    return false;
}

//Helper functions, ignore
//TODO: Move liked posts/comments/speciesidentifications in another directory other than "users" such as "users_likes"
async function getVotedPosts(){
    let userid = await getUserId();
    const userRef = doc(db, "users", userid);
    const docSnap = await getDoc(userRef);
    if(docSnap.data().votedposts === undefined){
        currentUserVotedPosts = new Map();
    }
    else{
        currentUserVotedPosts = new Map(Object.entries(docSnap.data().votedposts));
    }
}

async function getVotedComments(postId){
    let userid = await getUserId();
    const userRef = doc(db, "users", userid);
    const docSnap = await getDoc(userRef);
    if(docSnap.data().votedcomments === undefined || docSnap.data().votedcomments[postId] === undefined){
        currentUserVotedComments = new Map();
    }
    else{
        currentUserVotedComments = new Map(Object.entries(docSnap.data().votedcomments[postId]));
    }
    votedCommentsPost = postId;
}

async function getVotedSpeciesIdentifications(postId){
    let userid = await getUserId();
    const userRef = doc(db, "users", userid);
    const docSnap = await getDoc(userRef);
    if(docSnap.data().votedspeciesidentifications === undefined || docSnap.data().votedspeciesidentifications[postId] === undefined){
        currentUserVotedSpeciesIdentifications = new Map();
    }
    else{
        currentUserVotedSpeciesIdentifications = new Map(Object.entries(docSnap.data().votedspeciesidentifications[postId]));
    }
    votedSpeciesIdentificationsPost = postId;
}

export {Post, Comment, SpeciesIdentification, 
    addNewPost, getPostById, getAllPosts, getPostsBySpecies, getPostsByLocation, getPostsBySpeciesAndLocation, 
    addCommentToPost, getCommentsByPost, 
    addSpeciesIdentification, getSpeciesIdentificationByPost,
    hasUserLikedPost, hasUserDislikedPost, hasUserLikedComment, hasUserDislikedComment, hasUserLikedSpeciesIdentification, hasUserDislikedSpeciesIdentification,
    //These following functions have a second/third parameter *Author which is the author of the post/comment/species identification. This parameter is here to reduce the amount of
    //communication needed to the cloud because these functions are assumed to only be used once you already have gotten data from the document
    //which includes the post author.
    incrementPostRating, decrementPostRating, incrementCommentRating, decrementCommentRating, incrementSpeciesIdentificationRating, decrementSpeciesIdentificationRating
    };