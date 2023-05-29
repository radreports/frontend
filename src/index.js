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
// const [isSignedIn, setIsSignedIn] = useState(false);
let keycloak = Keycloak('./keycloak.json');
// const provider = new GoogleAuthProvider();
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
// provider.setCustomParameters({
//     'login_hint': 'user@example.com'
//   });

// const auth = getAuth();
const firebaseConfig = {
    apiKey: 'AIzaSyBqwzPmF0MqcvGXj-6Z0jTjbuxk2uqF9Sk',
    appId: '1:489104179920:web:a7251cb801d03a9601d4d5',
    messagingSenderId: '489104179920',
    projectId: 'radreports-b6f17',
    authDomain: 'radreports-b6f17.firebaseapp.com',
    storageBucket: 'radreports-b6f17.appspot.com',
    measurementId: 'G-E2XQ8YR5YY',
  };
  
  const app = firebase.initializeApp(firebaseConfig);
  const auth = getAuth(app);
  console.log("auth ::",auth);

  const messaging = getMessaging(app);
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    // ...
  });

  // onBackgroundMessage(messaging, (payload) => {
  //   console.log('[firebase-messaging-sw.js] Received background message ', payload);
  //   // Customize notification here
  //   const notificationTitle = 'Background Message Title';
  //   const notificationOptions = {
  //     body: 'Background Message body.',
  //     icon: '/firebase-logo.png'
  //   };
  
    // self.registration.showNotification(notificationTitle,
    //   notificationOptions);
  // });
  // getToken(messaging, {vapidKey: "BCYX-E3xunnPIFyWHS32nkQGZSsarku0vZww7ykS2dk6x79D10-Q76dClnoU5sD6wcvARn4UvRAUO5O1OfcxA7A"});

  getToken(messaging, { vapidKey: 'BCYX-E3xunnPIFyWHS32nkQGZSsarku0vZww7ykS2dk6x79D10-Q76dClnoU5sD6wcvARn4UvRAUO5O1OfcxA7A' }).then((currentToken) => {
    if (currentToken) {
      console.log("currentToken::",currentToken);
      // Send the token to your server and update the UI if necessary
      // ...
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });
  
  // useEffect(() => {
  //   if (firebase.apps.length) {
  //     const unregisterAuthObserver = firebase
  //       .auth()
  //       .onAuthStateChanged((user) => {
  //         setIsSignedIn(!!user);
  //       });
  //     return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  //   }
  // }, []);
ReactDOM.render(
    <HashRouter>
        <ScrollToTop>
            <App></App>
        </ScrollToTop>
    </HashRouter>,
    document.getElementById('root')
);
// window.name = "dummy";
//Initialization of the keycloak instance
// keycloak.init({ onLoad: 'login-required' }).success((authenticated) => {
 
//    if (!authenticated) {
//     //    window.location.reload();
//    } else {
    
//     keycloak.loadUserInfo().then(userInfo => {
//         console.log("token parsed",keycloak.tokenParsed.realm_access);
//         console.log("userInfo--",userInfo);
//         console.log(userInfo.preferred_username);
//         window.name = userInfo.preferred_username;
//         console.log(userInfo.sub);
//         window.keycloak = keycloak;
        

//         //   // id = userInfo.sub;
//         //   //    authenticated = true;
//         //   // alert(userInfo.sub);
//         //   // console.log(userInfo.sub);

//          })
//        console.info("Authenticated");
//    }

// ReactDOM.render(
//     <HashRouter>
//         <ScrollToTop>
//             <App></App>
//         </ScrollToTop>
//     </HashRouter>,
//     document.getElementById('root')
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: http://bit.ly/CRA-PWA
// //serviceWorker.unregister();

// sessionStorage.setItem('authentication', keycloak.token);
//    sessionStorage.setItem('refreshToken', keycloak.refreshToken);
 
// //to regenerate token on expiry
// setTimeout(() => {
//        keycloak.updateToken(70).success((refreshed) => {
//            if (refreshed) {
//                console.debug('Token refreshed' + refreshed);
//            } else {
//                console.warn('Token not refreshed, valid for '
//                    + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
//            }
//        }).error(() => {
//            console.error('Failed to refresh token');
//        });
 
 
//    }, 60000)
 
// }).error(() => {
//    console.error("Authenticated Failed");
// });