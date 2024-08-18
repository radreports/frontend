// src/firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBRETnvKbUf-27kWxQBBNz3NRDJH4EQQNs",
  authDomain: "localhost:3000",
  projectId: "webapp-5f6fb",
  storageBucket: "webapp-5f6fb.appspot.com",
  messagingSenderId: "889954314933",
  appId: "1:889954314933:web:169a3fde633b2a22a2ecfc"
  };

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export default firebase;
