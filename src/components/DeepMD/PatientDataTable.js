import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { TabView, TabPanel } from 'primereact/tabview';
import axios from 'axios';
import config from './config';

const PatientDataTable = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [imagingStudies, setImagingStudies] = useState([]);
    const [diagnosticReports, setDiagnosticReports] = useState([]);
    const [observations, setObservations] = useState([]);
    const [observationsVisible, setObservationsVisible] = useState(false);

    const EHR_URL = config.EHR_URL;
    const vieweerURL = config.VIEWER_URL;
    useEffect(() => {
        
        axios.get(`${EHR_URL}/Patient`)
            .then(response => {
                console.log("Patient::",response.data.entry)
                setPatients(response.data.entry.map(e => {
                    
                    return {
                        ...e.resource,
                        fullName: `${e.resource.name[0].given.join(' ')} ${e.resource.name[0].family}`
                    }
                }));
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);

    const onPatientSelect = (e) => {
        setSelectedPatient(e.value);
        setSidebarVisible(true);
        fetchImagingStudies(e.value.id);
        fetchDiagnosticReports(e.value.id);
    };

    const fetchImagingStudies = (patientId) => {
        axios.get(`https://ehr.radassist.ai/fhir/ImagingStudy?patient=${patientId}`)
            .then(response => {
                setImagingStudies(response.data.entry.map(e => e.resource));
            })
            .catch(error => {
                console.error('Error fetching imaging studies: ', error);
            });
    };

    const fetchDiagnosticReports = (patientId) => {
        axios.get(`https://ehr.radassist.ai/fhir/DiagnosticReport?patient=${patientId}`)
            .then(response => {
                setDiagnosticReports(response.data.entry.map(e => {
                    const conclusionCode = e.resource.conclusionCode && e.resource.conclusionCode.length > 0
                        ? e.resource.conclusionCode[0].coding[0].code : 'N/A';
                    const observationIds = e.resource.result ? e.resource.result.map(obs => obs.reference.split('/').pop()) : [];
                    return {
                        ...e.resource,
                        conclusionCodeDisplay: conclusionCode,
                        observationIds: observationIds
                    };
                }));
            })
            .catch(error => {
                console.error('Error fetching diagnostic reports: ', error);
            });
    };

    const fetchObservations = (observationIds) => {
        const requests = observationIds.map(id =>
            axios.get(`https://ehr.radassist.ai/fhir/Observation/${id}`)
        );
        Promise.all(requests)
            .then(responses => {
                setObservations(responses.map(res => res.data));
                setObservationsVisible(true);
            })
            .catch(error => {
                console.error('Error fetching observations: ', error);
            });
    };

    const openViewer = (id) => {
        // console.log(id);
        // window.open("https://demo.deepmd.io/viewer-ohif/viewer/" +id, "_blank")
        window.open(vieweerURL + id, '_blank');
      };
    const observationButton = (rowData) => {
        return (
            <Button label="Observations" icon="pi "
            className="p-button-success mr-2" onClick={() => fetchObservations(rowData.observationIds)} />
        );
    };
    const dicomButton = (rowData) => {
        console.log(rowData.conclusionCode[0].coding[0].code);
        const imageID = rowData.conclusionCode[0].coding[0].code;
        return (
            <Button label="DICOM" icon="pi "
            className="p-button-success mr-2" onClick={() => openViewer(imageID)} />
        );
    };

    const patientheader = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
          <h5 className="m-0">Patients</h5>
          {/* <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                </span> */}
        </div>
      );
      const observationheader = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
          <h5 className="m-0">Observations</h5>
          {/* <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                </span> */}
        </div>
      );
      const diagnosticheader = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
          <h5 className="m-0">DiagnosticReports</h5>
          {/* <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                </span> */}
        </div>
      );
      const imagingheader = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
          <h5 className="m-0">Imaging Studies</h5>
          {/* <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                </span> */}
        </div>
      );
    return (
        <div>
            <DataTable value={patients} paginator rows={10} selectionMode="single"
                       onSelectionChange={onPatientSelect} responsiveLayout="scroll"
                       header = {patientheader}
                       sortMode="multiple">
                <Column field="id" header="Patient ID" sortable></Column>
                <Column field="fullName" header="Patient Name" sortable></Column>
                <Column field="birthDate" header="Date of Birth" sortable></Column>
            </DataTable>

            <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)}
                     fullScreen modal>
                <TabView>
                    
                    <TabPanel header="Diagnostic Reports">
                        <DataTable value={diagnosticReports} header = {diagnosticheader} responsiveLayout="scroll">
                            <Column field="id" header="Report ID" sortable></Column>
                            <Column field="status" header="Status" sortable></Column>
                            {/* <Column field="conclusionCodeDisplay" header="Conclusion Code" sortable></Column> */}
                            <Column body={dicomButton} header="Conclusion Code"></Column>
                            <Column field="effectiveDateTime" header="Effective Date" sortable></Column>
                            <Column body={observationButton} header="Observations"></Column>
                        </DataTable>
                    </TabPanel>
                    <TabPanel header="Imaging Studies">
                        <DataTable value={imagingStudies} header={imagingheader}  responsiveLayout="scroll">
                            <Column field="id" header="Study ID" sortable></Column>
                            <Column field="description" header="Description" sortable></Column>
                            <Column field="started" header="Study Date" sortable></Column>
                            <Column field="numberOfSeries" header="Number of Series" sortable></Column>
                            <Column field="numberOfInstances" header="Number of Instances" sortable></Column>
                        </DataTable>
                    </TabPanel>
                </TabView>
            </Sidebar>

            {/* Observations Sidebar */}
            <Sidebar visible={observationsVisible} onHide={() => setObservationsVisible(false)} fullScreen modal>
                <DataTable value={observations} header = {observationheader} responsiveLayout="scroll">
                    <Column field="id" header="Observation ID" sortable></Column>
                    <Column field="status" header="Status" sortable></Column>
                    <Column field="category[0].text" header="Category" sortable></Column>
                    <Column field="code.text" header="Description" sortable></Column>
                    <Column field="valueQuantity.value" header="Value"></Column>
                    <Column field="valueQuantity.unit" header="Unit"></Column>
                </DataTable>
            </Sidebar>
        </div>
    );
};

export default PatientDataTable;
