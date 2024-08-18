import 'react-app-polyfill/ie11';
import { useState, useEffect } from "react";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import * as serviceWorker from './serviceWorker';
import { HashRouter } from 'react-router-dom'
import ScrollToTop from './ScrollToTop';
import Keycloak from 'keycloak-js';
import { initializeApp } from 'firebase/compat/app';
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "firebase/compat/auth";
// import firebase from "firebase/app";
// import "firebase/auth";
import firebase from 'firebase/compat/app';
import { getMessaging, getToken,onMessage } from "firebase/messaging";
import { onBackgroundMessage } from "firebase/messaging/sw";
import SignInScreen from './SignInScreen';
// const [isSignedIn, setIsSignedIn] = useState(false);
let keycloak = Keycloak('./keycloak.json');
// const provider = new GoogleAuthProvider();
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
// provider.setCustomParameters({
//     'login_hint': 'user@example.com'
//   });

// const auth = getAuth();
// const firebaseConfig = {
//     apiKey: 'AIzaSyBqwzPmF0MqcvGXj-6Z0jTjbuxk2uqF9Sk',
//     appId: '1:489104179920:web:a7251cb801d03a9601d4d5',
//     messagingSenderId: '489104179920',
//     projectId: 'project-889954314933',
//     authDomain: 'localhost',
//     storageBucket: 'radreports-b6f17.appspot.com',
//     measurementId: 'G-E2XQ8YR5YY',
//   };
  // const config = {
  //   apiKey: "AIzaSyBRETnvKbUf-27kWxQBBNz3NRDJH4EQQNs",
  //   authDomain: "app.radassist.ai",
  //   projectId: "webapp-5f6fb",
  // //   storageBucket: "YOUR_STORAGE_BUCKET",
  // //   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  //   appId: "webapp",
  // };
  // firebase.initializeApp(config);
  
ReactDOM.render(
    <HashRouter>
        <ScrollToTop>
            <App></App>
        </ScrollToTop>
    </HashRouter>,
    document.getElementById('root')
);
