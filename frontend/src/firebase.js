import firebase from "firebase/app";
import "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrdgtWNFpIV9BRiOoUti5Zu8_k1qNnq_0",
  authDomain: "ecommerce-85d6c.firebaseapp.com",
  projectId: "ecommerce-85d6c",
  storageBucket: "ecommerce-85d6c.appspot.com",
  messagingSenderId: "1085967664378",
  appId: "1:1085967664378:web:6222913b5f455b07157543",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
