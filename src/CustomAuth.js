import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './CustomAuth.css';
import './App.scss';
const CustomAuth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');  // New state for display name
    const [authError, setAuthError] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);

    if (!firebase.apps.length) {
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_AUTH_DOMAIN",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_STORAGE_BUCKET",
            messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
            appId: "YOUR_APP_ID",
        };
        firebase.initializeApp(firebaseConfig);
    }

    const handleEmailLogin = async () => {
        try {
            if (isRegistering) {
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                
                // Update the user profile with the display name
                await userCredential.user.updateProfile({
                    displayName: displayName
                });
            } else {
                await firebase.auth().signInWithEmailAndPassword(email, password);
            }
            setAuthError(null);
        } catch (error) {
            setAuthError(error.message);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await firebase.auth().signInWithPopup(provider);
            setAuthError(null);
        } catch (error) {
            setAuthError(error.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{isRegistering ? 'Sign Up' : 'Login'}</h2>

                {isRegistering && (
                    <div className="p-field p-col-12 p-md-4">
                        <label style={{ color: 'black' }} htmlFor="displayName">Display Name</label>
                        <InputText
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Enter your display name"
                            className="p-inputtext-sm p-d-block"
                        />
                    </div>
                )}

                <div className="p-field p-col-12 p-md-4">
                    <label style={{ color: 'black' }} htmlFor="email">Email</label>
                    <InputText
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter your email"
                        className="p-inputtext-sm p-d-block"
                    />
                </div>

                <div className="p-field p-col-12 p-md-4">
                    <label style={{ color: 'black' }} htmlFor="password">Password</label>
                    <Password
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        feedback={false}
                        toggleMask
                        className="p-inputtext-sm p-d-block"
                    />
                </div>

                {authError && (
                    <Message severity="error" text={authError} className="p-mb-3" />
                )}

                <div className="p-d-flex p-flex-column p-ai-center p-mt-2">
                    <Button
                        label={isRegistering ? "Sign Up" : "Login"}
                        icon="pi pi-user"
                        onClick={handleEmailLogin}
                        className="p-button p-button-success p-mb-2"
                    />

                    <Button
                        label="Login with Google"
                        icon="pi pi-google"
                        className="p-button p-button-secondary p-mb-2"
                        onClick={handleGoogleLogin}
                    />

                    <Divider />

                    <Button
                        label={isRegistering ? "Switch to Login" : "Switch to Register"}
                        className="p-button p-button-secondary"
                        onClick={() => setIsRegistering(!isRegistering)}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomAuth;
