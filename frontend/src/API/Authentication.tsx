import { auth } from "../Keys/FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addUserData } from "./Firestore.js";

// Create User function - Async with await
export async function createUser(email: string, username: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    addUserData(email, username);
    const user = userCredential.user;
    console.log("User created successfully:", user);
    return user; // Return the created user object
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(`Error: ${errorCode} - ${errorMessage}`);
    throw error; // Propagate the error
  }
}

// Sign In User function - Async with await
export async function signInUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed in successfully:", user);
    return user; // Return the signed-in user object
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(`Error: ${errorCode} - ${errorMessage}`);
    throw error; // Propagate the error
  }
}

export async function signOutUser() {
    try {
      await signOut(auth); // Log the user out
      console.log("User signed out successfully");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error signing out: ${errorCode} - ${errorMessage}`);
    }
  }