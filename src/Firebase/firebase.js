// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMYFBVd7qozfaQ2xyhTON1tVazAxRdV2o",
  authDomain: "town-team-96276.firebaseapp.com",
  projectId: "town-team-96276",
  storageBucket: "town-team-96276.firebasestorage.app",
  messagingSenderId: "480857308305",
  appId: "1:480857308305:web:f3217bc68e75ff99245330",
  measurementId: "G-8G9GCM0DQE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics

const auth = getAuth(app);
export { auth };
