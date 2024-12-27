import { db } from '../Keys/FirebaseConfig'; // Import your Firebase config
import { doc, setDoc, getDoc } from "firebase/firestore"; // Import necessary Firestore methods

// Add or update user data in Firestore
export async function addUserData(email, username) {
  try {
    // Create a reference to the 'users' collection with the email as the document ID
    const docRef = doc(db, "users", email);

    // Set data for the document (this will overwrite the document if it already exists)
    await setDoc(docRef, {
      email: email,
      username: username
    });

    console.log("Document written with ID: ", email); // You can use the email as the doc ID
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Get user data from Firestore
export async function getUsername(email) {
  try {
    // Create a reference to the document using the email as the document ID
    const docRef = doc(db, "users", email);

    // Get the document snapshot
    const docSnap = await getDoc(docRef);

    // Check if the document exists
    if (docSnap.exists()) {
      return docSnap.data().username; // Log the document data
    } else {
      return "No such document!";
    }
  } catch (e) {
    return "Error getting document";
  }
}
