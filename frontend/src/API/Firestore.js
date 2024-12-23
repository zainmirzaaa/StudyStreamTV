import {db} from '../Keys/FirebaseConfig.js'
import { collection, addDoc } from "firebase/firestore"; 


export async function addUserData(email, username){
    try {
        const docRef = await addDoc(collection(db, "users"), {
          email: email,
          username: username
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}