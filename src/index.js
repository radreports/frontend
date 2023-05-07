import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import * as serviceWorker from './serviceWorker';
import { HashRouter } from 'react-router-dom'
import ScrollToTop from './ScrollToTop';
import Keycloak from 'keycloak-js';
 
let keycloak = Keycloak('./keycloak.json');
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