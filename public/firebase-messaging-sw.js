importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: 'AIzaSyBqwzPmF0MqcvGXj-6Z0jTjbuxk2uqF9Sk',
    appId: '1:489104179920:web:a7251cb801d03a9601d4d5',
    messagingSenderId: '489104179920',
    projectId: 'radreports-b6f17',
    authDomain: 'radreports-b6f17.firebaseapp.com',
    storageBucket: 'radreports-b6f17.appspot.com',
    measurementId: 'G-E2XQ8YR5YY',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();
// onMessage(messaging, (payload) => {
//   console.log('Message received. ', payload);
//   // ...
// });
// messaging.onBackgroundMessage(function(payload) {
//   console.log('Received background message ', payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});