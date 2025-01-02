import { db } from '../Keys/FirebaseConfig'; // Import your Firebase config
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore"; // Import necessary Firestore methods

// Add or update user data in Firestore
export async function addUserData(email, username) {
  try {
    // Check if the username already exists in the 'usersByUsername' collection
    const usernameQuery = query(collection(db, "usersByUsername"), where("username", "==", username));
    const usernameSnapshot = await getDocs(usernameQuery);

    if (!usernameSnapshot.empty) {
      alert("Username already exists.");
      return "not allowed"; // Exit if the username exists
    }

    // Check if the email already exists in the 'usersByEmail' collection
    const emailQuery = query(collection(db, "usersByEmail"), where("email", "==", email));
    const emailSnapshot = await getDocs(emailQuery);

    if (!emailSnapshot.empty) {
      alert("Email already exists.");
      return "not allowed"; // Exit if the email exists
    }

    // Create a reference to the 'usersByEmail' collection using the email as the document ID
    const emailDocRef = doc(db, "usersByEmail", email);

    // Set data for the document (this will overwrite the document if it already exists)
    await setDoc(emailDocRef, {
      email: email,
      username: username
    });
    console.log("Document written in usersByEmail with ID: ", email); 

    // Create a reference to the 'usersByUsername' collection using the username as the document ID
    const usernameDocRef = doc(db, "usersByUsername", username);

    // Set data for the document (this will overwrite the document if it already exists)
    await setDoc(usernameDocRef, {
      email: email,
      username: username
    });
    console.log("Document written in usersByUsername with ID: ", username); 

  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Get user data from Firestore
export async function getUsername(email) {
  try {
    // Create a reference to the document using the email as the document ID
    const docRef = doc(db, "usersByEmail", email);

    // Get the document snapshot
    const docSnap = await getDoc(docRef);

    // Check if the document exists
    if (docSnap.exists()) {
      return docSnap.data().username; // Return the username
    } else {
      return "No such document!";
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    return "Error getting document";
  }
}
