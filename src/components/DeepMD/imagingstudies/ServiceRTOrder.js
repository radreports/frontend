import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import config from "../config";
import FHIR from "fhirclient"
import axios from "axios";

const ServiceRTOrder = (props) => {
    const [isValidState, setIsValidState] = useState(false);
    const [bodypartItem, setBodypartItem] = useState(null);
    const [patientItem, setPatientItem] = useState(null);
    const [practitionerItem, setPractitionerItem] = useState(null);
    const [reason, setReason] = useState("");
    const [patientItems, setPatientItems] = useState(null);
    const [practitionerItems, setPractitionerItems] = useState(null);
    const [bodypartItems, setBodypartItems] = useState(null);
    
    const signalParent = (isValid) => {
        setIsValidState(isValid);
        props.signalIfValid(isValid);
    }

    useEffect(() => {
        signalParent(isValidState);
    }, []);

    const bodypart_Items = [

        {
            label: 'Contours',
            items: [
                { name: 'Full Organ', code: 'totalseg' },
                { name: 'OAR Abdoman Multi Organ', code: 'amos' },
                { name: 'OAR Abdoman', code: 'Abdoman' },
                { name: 'OAR Thoractic', code: 'thor' },
                { name: 'Head and Neck', code: 'Head_Neck_OAR' }
            ]
        }
    ];

    useEffect(() => {
        setBodypartItems(bodypart_Items);
        const tempPatients = [];
        client.request(`/Patient`, {})
        .then(data => {
            try {
                const result = data.entry;
                for (let i = 0; i < result.length; i++) {
                    const resource = result[i].resource;
                    const id = resource.id;
                    const name = resource.name[0];
                    const given = name.given[0];
                    const family = name.family;
                    const fullName = `${given} ${family}`;
                    const patient = { name: `${fullName}  ${id}`, code: id };
                    tempPatients.push(patient);
                }
            } catch (err) {}
            setPatientItems(tempPatients);
        });

        client.request(`/Practitioner`, {})
        .then(data => {
            const tempPractitioner = [];
            try {
                const result = data.entry;
                for (let i = 0; i < result.length; i++) {
                    const resource = result[i].resource;
                    const id = resource.id;
                    const name = resource.name[0];
                    const given = name.given[0];
                    const family = name.family;
                    const fullName = `${given} ${family}`;
                    const practitioner = { name: `${fullName}  ${id}`, code: id };
                    tempPractitioner.push(practitioner);
                }
            } catch (err) {}
            setPractitionerItems(tempPractitioner);
        });
    }, []);

    const createOrder = () => {
        const Service_request = {
            resourceType: "ServiceRequest",
            status: "active",
            intent: "order",
            priority: "routine",
            subject: { "reference": `Patient/${patientItem.code}` },
            requester: { "reference": `Practitioner/${practitionerItem.code}` },
            bodySite: [{
                coding: [{ system: "http://www.snomedct.info", code: bodypartItem.code, display: bodypartItem.name }]
            }],
            note: [{ text: reason }]
        };

        axios.post(`${EHR_URL}/ServiceRequest`, Service_request)
        .then(res => {
            window.serviceID = res.data.id;
            signalParent(true);
        });
    };

    const EHR_URL = config.EHR_URL;
    const client = new FHIR.client(EHR_URL);

    const hierarchicalItemTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <span>{option.name}</span>
            </div>
        );
    };

    return (
        <div className="col-12">
            <div className="card">
                <h5>Advanced</h5>
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="patient">Patient</label>
                        <Dropdown id="patient" value={patientItem} onChange={(e1) => setPatientItem(e1.value)} options={patientItems} optionLabel="name" placeholder="Select Patient"></Dropdown>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="practitioner">Refering Physician</label>
                        <Dropdown id="practitioner" value={practitionerItem} onChange={(e) => setPractitionerItem(e.value)} options={practitionerItems} optionLabel="name" placeholder="Select One"></Dropdown>
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="bodypart">Bodypart to be examined</label>
                        <Dropdown id="bodypart" value={bodypartItem} onChange={(e) => setBodypartItem(e.value)} options={bodypartItems} optionLabel="name" optionGroupLabel="label" optionGroupChildren="items" itemTemplate={hierarchicalItemTemplate} placeholder="Select One"></Dropdown>
                    </div>
                    <div className="field col-12">
                        <label htmlFor="reason">Note to Radiologist</label>
                        <InputTextarea id="reason" rows="4" onChange={(evt) => setReason(evt.target.value)} />
                    </div>
                    <div>
                        <Button label="Save" icon="pi pi-plus" className="p-button-success mr-2" onClick={createOrder} disabled={false} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// const comparisonFn = (prevProps, nextProps) => {
//     return prevProps.location.pathname === nextProps.location.pathname;
// };

// export default React.memo(ServiceOrder, comparisonFn);

export default React.memo(ServiceRTOrder);

