import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export const AppTopbar = (props) => {

    const handleLogout = () => {
        firebase.auth().signOut().then(() => {
            // Optionally redirect to a different page or show a message
            console.log("User signed out");
        }).catch((error) => {
            console.error("Sign out error:", error);
        });
    };

    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={props.layoutColorMode === 'light' ? 'assets/layout/images/logo-dark.svg' : 'assets/layout/images/logo-white.svg'} alt="logo"/>
                <span>RadAssist</span>
            </Link>

            <button type="button" className="p-link layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars"/>
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <ul className={classNames("layout-topbar-menu lg:flex origin-top", {'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                <li>
                    <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-user"/>
                        <span>Profile</span>
                    </button>
                </li>
                <li>
                    <button className="p-link layout-topbar-button" onClick={handleLogout}>
                        <i className="pi pi-sign-out"/>
                        <span>Logout</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}
