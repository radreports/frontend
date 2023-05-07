import React, { useState, useEffect, useRef, Fragment } from 'react';
import ReactDOM from 'react-dom'
import MultiStep from 'react-multistep'
import ServiceOrder from './ServiceOrder'
import NewImaging from './NewImaging';
import TemplateDemo from "./TemplateDemo";
import UploadDICOM from '../UploadDICOM';
import "./css/main.css"
import { Button } from 'primereact/button';
import "./css/app.css"
import "./css/normilize.css"
import StepZilla from "react-stepzilla";
import "./css/skeleton.css"

const NewServiceOrder = () => {
   
    const steps =
    [
        
    //   {name: 'Step 1', component: <ServiceOrder/> },
    //   {name: 'Step 2', component: <NewImaging/> },
    {name: 'Step1', component: <ServiceOrder getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
    {name: 'Step2', component: <TemplateDemo getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      
    // {name: 'Step3', component: <NewImaging getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      
    ]
    const [isValidstate,setisValidstate ] = useState(false)
    // props.signalIfValid(false);

return (
    <div className='container'>
      <MultiStep activeStep={0} prevButton={{style:{ background: 'white', height: "50px" }, title: 'prev step'}} >
        <ServiceOrder title='  Service Request'/>
        {/* <TemplateDemo title=' Upload Images'/> */}
        <NewImaging title='Upload Images'/>
        {/* <StepThree title='Step 3'/>
        <StepFour title='Step 4'/> */}
      </MultiStep>
     
    </div>
    // <div className='container'>
    // <div className='step-progress'>
    //     <StepZilla steps={steps}/>
    // </div>
    // </div>
  )
}
  const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(NewServiceOrder, comparisonFn);
