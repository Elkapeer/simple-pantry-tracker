// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBhb8xHIj9nQvBymwKKk5C9SbOlxSEh-ow",
    authDomain: "headstarter-project-2-40d67.firebaseapp.com",
    projectId: "headstarter-project-2-40d67",
    storageBucket: "headstarter-project-2-40d67.appspot.com",
    messagingSenderId: "711941096211",
    appId: "1:711941096211:web:0ce85bccc11f2de7de10e6",
    measurementId: "G-V5XHZB726K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };