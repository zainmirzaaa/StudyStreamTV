import { db } from '../Keys/FirebaseConfig'; // Import your Firebase config
import { doc, setDoc, getDoc, collection, query, where, runTransaction } from "firebase/firestore"; // Import necessary Firestore methods

// Add or update user data in Firestore
export async function addUserData(email, username) {
  try {
    // Check if the username already exists in the 'usersByUsername' collection
    const usernameDocRef = doc(db, "usersByUsername", username);
    const usernameDocSnap = await getDoc(usernameDocRef);

    if (usernameDocSnap.exists()) {
      alert("Username already exists.");
      return "not allowed"; // Exit if the username exists
    }

    // Check if the email already exists in the 'usersByEmail' collection
    const emailDocRef = doc(db, "usersByEmail", email);
    const emailDocSnap = await getDoc(emailDocRef);

    if (emailDocSnap.exists()) {
      alert("Email already exists.");
      return "not allowed"; // Exit if the email exists
    }

    // Use Firestore transaction to handle both writes atomically
    await runTransaction(db, async (transaction) => {
      // Set data for the 'usersByEmail' collection using the email as the document ID
      transaction.set(emailDocRef, {
        email: email,
        username: username
      });

      // Set data for the 'usersByUsername' collection using the username as the document ID
      transaction.set(usernameDocRef, {
        email: email,
        username: username
      });
    });

    console.log("User data added successfully");
    return "User data added successfully";

  } catch (e) {
    console.error("Error adding document: ", e);
    alert(e.message || "An error occurred. Please try again later.");
    return "error";
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
