import React, { useState, useEffect, useRef, Fragment } from 'react';
import StepWizard from "react-step-wizard";
import wizard from "./wizards/wizard"
import UploadDICOM from './UploadDICOM';
const ServicerequestNew = () => {
    
    
    return (
        <StepWizard>
           <wizard/>
      
</StepWizard>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(ServicerequestNew, comparisonFn);