import app from "./firebaseSetup.js"
import { getFirestore, doc, updateDoc} from "firebase/firestore"; 
import { getUserProfileStatistics } from "./database.js";
import { getUsername } from "./account.js";
const db = getFirestore(app);

var profile;

async function isUserModerator(){
    if(profile === undefined){
        let username = await getUsername();
        profile = await getUserProfileStatistics(username);
    }
    return profile.isModerator;
}

async function pinSpeciesIdentification(postId, speciesIdentificationId){
    const speciesIdentificationRef = doc(db, "species_identification", postId);
    await updateDoc(speciesIdentificationRef,{
        pinnedspeciesidentification: speciesIdentificationId,
    });
}

async function setStatus(postId, status){
    const speciesIdentificationRef = doc(db, "species_identification", postId);
    await updateDoc(speciesIdentificationRef,{
        status: status,
    });
}

export{isUserModerator, pinSpeciesIdentification, setStatus}
