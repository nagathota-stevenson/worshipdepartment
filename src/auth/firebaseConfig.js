// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwhGUYbS9NRjCamjuVuXzn-TOkFoHRXqI",
  authDomain: "worshipdepartment-b36a0.firebaseapp.com",
  projectId: "worshipdepartment-b36a0",
  storageBucket: "worshipdepartment-b36a0.appspot.com",
  messagingSenderId: "442823940043",
  appId: "1:442823940043:web:39b88ca948deeb5bee484e",
  measurementId: "G-00MYNECNDK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);