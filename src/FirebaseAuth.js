// src/FirebaseAuth.js
import React, { useEffect } from 'react';
import firebase from './firebase';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

const FirebaseAuth = () => {
  useEffect(() => {
    const uiConfig = {
      signInFlow: 'popup',
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
    };

    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  }, []);

  return (
    <div>
      <h1>Sign in</h1>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
};

export default FirebaseAuth;
