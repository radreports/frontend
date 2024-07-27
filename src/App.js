import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Route, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { initializeApp } from 'firebase/app';
import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppConfig } from './AppConfig';
import config from "./components/DeepMD/config";
import axios from 'axios';
import Dashboard from './components/Dashboard';
import ButtonDemo from './components/ButtonDemo';
import ChartDemo from './components/ChartDemo';
import Documentation from './components/Documentation';
import FileDemo from './components/FileDemo';
import FloatLabelDemo from './components/FloatLabelDemo';
import FormLayoutDemo from './components/FormLayoutDemo';
import InputDemo from './components/InputDemo';
import ListDemo from './components/ListDemo';
import MenuDemo from './components/MenuDemo';
import MessagesDemo from './components/MessagesDemo';
import MiscDemo from './components/MiscDemo';
import OverlayDemo from './components/OverlayDemo';
import MediaDemo from './components/MediaDemo';
import PanelDemo from './components/PanelDemo';
import TableDemo from './components/TableDemo';
import TreeDemo from './components/TreeDemo';
import InvalidStateDemo from './components/InvalidStateDemo';
import BlocksDemo from './components/BlocksDemo';
import IconsDemo from './components/IconsDemo';

import Crud from './pages/Crud';
import EmptyPage from './pages/EmptyPage';
import TimelineDemo from './pages/TimelineDemo';

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';

import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/demo/flags/flags.css';
import './assets/demo/Demos.scss';
import './assets/layout/layout.scss';
import './App.scss';
// import "./assets/main.css";
import StudiesPage from "./components/DeepMD/StudiesPage";
import Dictation from './components/DeepMD/Speech';
import UploadDICOM from "./components/DeepMD/UploadDICOM";
import DiagnosticReportPage from "./components/DeepMD/DiagnosticReportPage";
// import WizardComponent from "./components/DeepMD/WizardComponent";
import PatientDataTable from "./components/DeepMD/PatientDataTable"
import NewServiceOrder from "./components/DeepMD/imagingstudies/NewServiceOrder"
import ServiceOrder from './components/DeepMD/imagingstudies/ServiceOrder';
import DiagnosticReportDetails from "./components/DeepMD/DiagnosticReportDetails";
// import Cxr from "./components/DeepMD/Cxr";
import CreateDicom from "./components/CreateDicom/CreateDicom"
import HandlingImage from "./components/CornerStone/pages/HandlingImage";

import { StyledFirebaseAuth } from "react-firebaseui";
// import "./styles.css";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { Image } from 'primereact/image';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "firebase/messaging";
import { getMessaging, getToken,onMessage } from "firebase/messaging";
import { Toast } from 'primereact/toast';
// import {toast} from "react-toastify";
const App = () => {

    let url = config.API_URL + "/Token" ;
    const myToast = useRef(null);
    const [layoutMode, setLayoutMode] = useState('overlay');
    // const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('dark')
    // const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [myToken,setMyToken] = useState(false);
    PrimeReact.ripple = true;
    const showToast = (severityValue, summaryValue, detailValue) => {   
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue,life:6000});   
      }
    let menuClick = false;
    let mobileTopbarMenuClick = false;
    
    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;
        console.log("onMobileSubTopbarMenuClick ...");
        setLayoutColorMode((prevState) => (prevState === 'dark' ? 'light' : 'dark'));
        // window.keycloak.logout();
        // firebase.auth().signOut();

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        console.log("onMenuItemClick ...");
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const menu = [
        // {
        //     label: 'Home',
        //     items: [{
        //         label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'
        //     }]
        // },
       
        {
            label: 'Radiology', icon: 'pi pi-fw pi-clone',
            items: [
                
                {label: 'Diagnostic Reports', icon: 'pi pi-fw pi-id-card', to: '/diagnosticreport' },
                {label: 'Patients', icon: 'pi pi-fw pi-id-card', to:'/patients'},
                // {label: 'Diagnostic Details', icon: 'pi pi-fw pi-id-card', to: '/drdetails' },
                // {label: 'New ServiceRequest', icon: 'pi pi-fw pi-id-card', to: '/servicerequest' },
                {label: 'Dictation', icon: 'pi pi-fw pi-id-card', to: '/dictation' },
                
                // {LABEL:'Wizard',icon:'pi pi-fw pi-id-card',to:'/wizard'},
                // {label: 'Imaging Studies', icon: 'pi pi-fw pi-id-card', to: '/studies' },
                // {label: 'Icons', icon: 'pi pi-fw pi-id-card', to: '/icons' },
                
                // {label: 'New Study', icon: 'pi pi-fw pi-id-card', to: '/study' },
                
                // {label: 'Chest X-ray', icon: 'pi pi-fw pi-id-card', to: '/Cxr' },
                // CreateDicom
                // {label: 'CreateDicomy', icon: 'pi pi-fw pi-id-card', to: '/CreateDicom' },
                // HandlingImage
                // {label: 'HandlingImage', icon: 'pi pi-fw pi-id-card', to: '/HandlingImage' },
                // { label: 'menu', icon: 'pi pi-fw pi-user-edit', to: '/menu' },
                // { label: 'Crud', icon: 'pi pi-fw pi-user-edit', to: '/crud' },
                // { label: 'forms', icon: 'pi pi-fw pi-user-edit', to: '/formlayout' },
                // { label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/timeline' },
                // { label: 'Empty', icon: 'pi pi-fw pi-circle-off', to: '/empty' }
            ]
        },
        // {
        //     label: 'ER', icon: 'pi pi-fw pi-search',
        //     items: [
        //         // OverlayDemo
        //         {label: 'Chest X-ray', icon: 'pi pi-fw pi-id-card', to: '/Cxr' },
        //         {label: 'Overlay', icon: 'pi pi-fw pi-id-card', to: '/overlay' },
                      
        //     ]
        // },
        // {
        //     label: 'Get Started',
        //     items: [
        //         { label: 'Documentation', icon: 'pi pi-fw pi-question', command: () => { window.location = "#/documentation" } },
        //         { label: 'View Source', icon: 'pi pi-fw pi-search', command: () => { window.location = "https://github.com/primefaces/sakai-react" } }
        //     ]
        // }
    ];

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            <Toast ref={myToast} />
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />

            <div className="layout-sidebar" onClick={onSidebarClick}>
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
            </div>

            <div className="layout-main-container">
                <div className="layout-main">
                    <Route path="/" exact render={() => <DiagnosticReportPage colorMode={layoutColorMode} location={location} />} />
                    <Route path="/formlayout" component={FormLayoutDemo} />
                    <Route path="/input" component={InputDemo} />
                    <Route path="/floatlabel" component={FloatLabelDemo} />
                    <Route path="/HandlingImage" component={HandlingImage} />
                    <Route path="/invalidstate" component={InvalidStateDemo} />
                    <Route path="/button" component={ButtonDemo} />
                    <Route path="/table" component={TableDemo} />
                    <Route path="/list" component={ListDemo} />
                    <Route path="/tree" component={TreeDemo} />
                    <Route path="/panel" component={PanelDemo} />
                    <Route path="/overlay" component={OverlayDemo} />
                    <Route path="/media" component={MediaDemo} />
                    <Route path="/menu" component={MenuDemo} />
                    <Route path="/messages" component={MessagesDemo} />
                    <Route path="/blocks" component={BlocksDemo} />
                    <Route path="/icons" component={IconsDemo} />
                    <Route path="/file" component={FileDemo} />
                    <Route path="/chart" render={() => <ChartDemo colorMode={layoutColorMode} location={location} />} />
                    <Route path="/misc" component={MiscDemo} />
                    <Route path="/timeline" component={TimelineDemo} />
                    <Route path="/crud" component={Crud} />
                    <Route path="/studies" component={StudiesPage} />
                    <Route path="/servicerequest" component={NewServiceOrder} />
                    <Route path="/reports" component={DiagnosticReportPage} />
                    <Route path="/study" component={ServiceOrder} />
                    <Route path="/dictation" component={Dictation} />
                    {/* <Route path="/wizard" component={WizardComponent} /> */}
                    
                    <Route path="/patients" component={PatientDataTable} />

                    
                    <Route path="/drdetails" component={DiagnosticReportDetails} />
                    {/* CreateDicom */}
                    <Route path="/diagnosticreport" component={DiagnosticReportPage} />
                    
                    <Route path="/upload" component={UploadDICOM} />
                    <Route path="/CreateDicom" component={CreateDicom} />
                    <Route path="/empty" component={EmptyPage} />
                    <Route path="/documentation" component={Documentation} />
                </div>

                <AppFooter layoutColorMode={layoutColorMode} />
            </div>

            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>

        </div>
    );

}

export default App;
