import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Sidebar } from 'primereact/sidebar';
import { TabView, TabPanel } from 'primereact/tabview';
import axios from 'axios';

const PatientDataTable = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [imagingStudies, setImagingStudies] = useState([]);
    const [diagnosticReports, setDiagnosticReports] = useState([]);

    useEffect(() => {
        axios.get('https://ehr.radassist.ai/fhir/Patient')
            .then(response => {
                setPatients(response.data.entry.map(e => {
                    // Ensuring proper data structure mapping
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
                console.log("DiagnosticReport",response.data.entry)
                setDiagnosticReports(response.data.entry.map(e => e.resource));
            })
            .catch(error => {
                console.error('Error fetching diagnostic reports: ', error);
            });
    };

    return (
        <div>
            <DataTable value={patients} paginator rows={10} selectionMode="single"
                       onSelectionChange={onPatientSelect} responsiveLayout="scroll"
                       sortMode="multiple">
                <Column field="id" header="Patient ID" sortable></Column>
                <Column field="fullName" header="Patient Name" sortable></Column>
                <Column field="birthDate" header="Date of Birth" sortable></Column>
            </DataTable>

            <Sidebar visible={sidebarVisible} onHide={() => setSidebarVisible(false)}
                     fullScreen modal>
                <TabView>
                    <TabPanel header="Imaging Studies">
                        <DataTable value={imagingStudies} responsiveLayout="scroll">
                            <Column field="id" header="Study ID" sortable></Column>
                            <Column field="description" header="Description" sortable></Column>
                            <Column field="started" header="Study Date" sortable></Column>
                            <Column field="numberOfSeries" header="Number of Series" sortable></Column>
                            <Column field="numberOfInstances" header="Number of Instances" sortable></Column>
                        </DataTable>
                    </TabPanel>
                    <TabPanel header="Diagnostic Reports">
                        <DataTable value={diagnosticReports} responsiveLayout="scroll">
                            <Column field="id" header="Report ID" sortable></Column>
                            <Column field="status" header="Status" sortable></Column>
                            <Column field="conclusion" header="Conclusion" sortable></Column>
                            <Column field="effectiveDateTime" header="Effective Date" sortable></Column>
                        </DataTable>
                    </TabPanel>
                </TabView>
            </Sidebar>
        </div>
    );
};

export default PatientDataTable;
