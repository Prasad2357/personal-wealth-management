// import { initializeApp } from "firebase/app";

 import { getAuth, GoogleAuthProvider } from "firebase/auth";
 import { getFirestore, doc, setDoc } from "firebase/firestore";



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH2NuZZqfUo3kk_FDD07-ejd1Y2SlV458",
  authDomain: "personal-finance-tracker-e74e8.firebaseapp.com",
  projectId: "personal-finance-tracker-e74e8",
  storageBucket: "personal-finance-tracker-e74e8.appspot.com",
  messagingSenderId: "404865798315",
  appId: "1:404865798315:web:ea8c3783809af8ba87e7ee",
  measurementId: "G-X4TVSTGJW4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };












