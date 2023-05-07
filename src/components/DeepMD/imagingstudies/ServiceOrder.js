import React, { useState, useEffect, useRef, Fragment } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import config from "../config";
import FHIR from "fhirclient"
import axios from "axios";
const ServiceOrder = () => {
    // console.log("Service ID called::",window.serviceID);
    const [bodypartItem, setBodypartItem] = useState(null);
    const [patientItem, setPatientItem] = useState(null);
    const [practitionerItem, setPractitionerItem] = useState(null);
    const [reason, SetReason] = useState("");
    const [patientItems, SetPatientItems] = useState(null)
    const [practitionerItems, SetPractitionerItems] = useState(null)
    const [bodypartItems, SetBodypartItems] = useState(null)
    const bodypart_Items = [
        { name: 'Intracranial Haemmorage', code: '27410004' },
        { name: 'Ischemic Stroke', code: '230690007' },
        { name: 'Cerebral Aneurysm', code: '233983001' },
        { name: 'MSK', code: 'Option 4' },
        { name: 'Covid CT', code: '840539006' },
        { name: 'Coronary artery disease', code: '414024009' },
        { name: 'Breast Mammography', code: '71651007' },
        { name: 'Breast MRI', code: '432634008' },
        { name: 'Brain Tumor', code: '276826005' },
        { name: 'Colon Cancer', code: '275978004' },
        { name: 'Head and Neck Cancer', code: 'Option 11' },
        { name: 'HnC OAR', code: 'Option 12' },
        { name: 'Lung Nodules', code: '786838002' },
        { name: 'Liver Tumor', code: '93870000' },
        { name: 'Pancreas', code: '363418001' },
        { name: 'Prostate', code: '399068003' },
        
        { name: 'OAR Abdoman', code: 'Abdoman' },
        { name: 'OAR Thoractic', code: 'thor' },
    ];
   
    const createOder= () => {
        console.log("save clicked::" +patientItem["code"] + " "+patientItem)
        const Service_request = {
            resourceType: "ServiceRequest",
            status: "active",
            intent : "order",
            priority : "routine",
            subject: {
                "reference": "Patient/"+patientItem["code"]
              },
              requester: {
                "reference": "Practitioner/" + practitionerItem["code"]
              },
              bodySite: [ {
                coding: [ {
                  system: "http://www.snomedct.info",
                  code: bodypartItem["code"],
                  display: bodypartItem["name"]
                } ]
              } ],
              note: [ {
                text: reason
              } ]
        }
        console.log(Service_request)
        const req = JSON.stringify(Service_request);
        axios.post(EHR_URL+ "/ServiceRequest",Service_request
        )
        .then(res => {
            console.log(res.data.id);
            // props.signalIfValid(true);
            window.serviceID = res.data.id;
            const serviceID = window.serviceID;
    
            console.log("Service ID::",serviceID);
        })

    }
    // var bodypartItems = [
    //     { name: 'Intracranial Haemmorage', code: 'Option 1' },
    //     { name: 'Ischemic Stroke', code: 'Option 2' },
    //     { name: 'Cerebral Anauresm', code: 'Option 3' },
    //     { name: 'MSK', code: 'Option 4' },
    //     { name: 'Covid CT', code: 'Option 5' },
    //     { name: 'MSK', code: 'Option 6' },
    //     { name: 'Mammogram', code: 'Option 7' },
    //     { name: 'Breast MRI', code: 'Option 8' },
    //     { name: 'Brain Tumor', code: 'Option 9' },
    //     { name: 'Colon', code: 'Option 10' },
    //     { name: 'Head and Neck Cancer', code: 'Option 11' },
    //     { name: 'HnC OAR', code: 'Option 12' },
    //     { name: 'Lung Nodules', code: 'Option 13' },
    //     { name: 'Liver Tumor', code: 'Option 14' },
    //     { name: 'Pancreas', code: 'Option 15' },
    //     { name: 'Prostate', code: 'Option 16' },
    //     { name: 'Lung Nodules', code: 'Option 17' },
    //     { name: 'Liver Tumor', code: 'Option 18' },
    //     { name: 'OAR Thoractic', code: 'Option 19' },
    // ];
    // var patientItems = [
       
    // ];
    // var practitionerItems = [
        
    // ];
    
    const EHR_URL = config.EHR_URL;
    const client = new FHIR.client(EHR_URL);
    useEffect(() => {
    SetBodypartItems(bodypart_Items);
        var temp_patients = []
    // setBodypartItem(bodypart_Items);
    client.request(`/Patient`, {})
    .then(data => {
        try {
        // console.log(data.entry);
        var result = data.entry;
        
        for (var i=0; i< result.length; i++ ){
            const resource = result[i].resource;
            // console.log(resource);
            const id = resource.id;
            const name = resource.name[0];

            const given = name.given[0];
            const family = name.family;
            const fullName = given + " " + family;
            // console.log("id: " +id);
            // console.log(fullName);
            const patient = {
                name: fullName + "  " +id,
                code : id
            }
            // console.log(patient)
            temp_patients.push(patient);
            
        }
        
        }
        catch(err){}
        console.log(temp_patients);
        SetPatientItems(temp_patients);
    
});

    client.request(`/Practitioner`, {})
    .then(data => {
        var temp_practitioner = [];
        console.log("Inside then");
        try {
        // console.log(data.entry);
        var result = data.entry;
        for (var i=0; i< result.length; i++ ){
            const resource = result[i].resource;
            // console.log(resource);
            const id = resource.id;
            const name = resource.name[0];

            const given = name.given[0];
            const family = name.family;
            const fullName = given + " " + family;
            // console.log("id: " +id);
            // console.log(fullName);
            const practioner = {
                name: fullName + "  " +id,
                code : id
            }
            // console.log(practioner)
            temp_practitioner.push(practioner);
            
        }
        }
        catch(err){}
        SetPractitionerItems(temp_practitioner);
        console.log("exiting then");
    })
  
    
},[EHR_URL]);
    return (
        // <div className="grid">
 
            <div className="col-12">
                <div className="card">
                    <h5>Advanced</h5>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="patient">Patient </label>
                            {/* <InputText id="firstname2" type="text" /> */}
                            <Dropdown id="patient" value={patientItem} onChange={(e1) => setPatientItem(e1.value)} options={patientItems} optionLabel="name" placeholder="Select Patient"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="practitioner">Refering Physician</label>
                            {/* <InputText id="lastname2" type="text" /> */}
                            <Dropdown id="practitioner" value={practitionerItem} onChange={(e) => setPractitionerItem(e.value)} options={practitionerItems} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="bodypart">Bodypart to be examined</label>
                            {/* <InputText id="city" type="text" /> */}
                            <Dropdown id="bodypart" value={bodypartItem} onChange={(e) => setBodypartItem(e.value)} options={bodypartItems} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        {/* <div className="field col-12 md:col-3">
                            <label htmlFor="zip">Zip</label>
                            <InputText id="zip" type="text" />
                        </div> */}
                        <div className="field col-12">
                            <label htmlFor="reason">Note to Radiologit</label>
                            <InputTextarea id="reason" rows="4" onChange={(evt) => { console.log("from reason",evt.target.value);SetReason(evt.target.value); }} />
                        </div>
                        <div>
                        <Button label="Save" icon="pi pi-plus" className="p-button-success mr-2" onClick={createOder} />
                        </div>
                        {/* <div className="field col-12 md:col-3">
                            <label htmlFor="state">Urgency</label>
                            <Dropdown id="state" value={dropdownItem} onChange={(e) => setDropdownItem(e.value)} options={dropdownItems} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div> */}
                        
                    </div>
                </div>
            </div>
        // </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    // return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(ServiceOrder, comparisonFn);
