import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBvCjASJQ4opvGCBG_SqY-6pamlKdo2pxM",
  authDomain: "lg-trust-edge.firebaseapp.com",
  projectId: "lg-trust-edge",
  storageBucket: "lg-trust-edge.firebasestorage.app",
  messagingSenderId: "690685225889",
  appId: "1:690685225889:web:0911e2243f0e67003df9e0",
  measurementId: "G-0DGNSSPPZR"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
