import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  GoogleAuthProvider,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "../index";
import { handleError } from "@repo/shared-types";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    console.log("User signed in successfully:", result.user.email);
    return result;
  } catch (error) {
    handleError(error, "Google sign-in failed");
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    handleError(error, "Sign out failed");
  }
};

export const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};
