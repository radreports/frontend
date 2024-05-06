import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import config from "./config";
import FHIR from "fhirclient"

const ObservationPage = ({ diagnosticReportId }) => {
  const [observations, setObservations] = useState([]);
  const EHR_URL = config.EHR_URL;
  const client = new FHIR.client(EHR_URL);
  console.log("diagnosticReportId is ::",diagnosticReportId);
//   useEffect(() => {
//     const EHR_URL = config.EHR_URL;
//     // const client = new FHIR.client(" http://hapi.fhir.org/baseR4/");
//     const client = new FHIR.client(EHR_URL);
//     const getPath = client.getPath;
//     var my_resource = [] ;
//     client.request(`/DiagnosticReport/${diagnosticReportId}`, {
//         pageLimit: 0 ,
//         // resolveReferences: [ "subject","result","study"]
//     })
//     .then(data => {
//         console.log("From diagnostic report details ::",data);
//         try{
//             // const results = data[0].entry;
            
//         }
//         catch(e){}
//     })
//     .catch(err => {
//         console.log(err);
//      });

// },[]);
    
  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const reportResponse = await axios.get(`${EHR_URL}/DiagnosticReport/${diagnosticReportId}`);
        console.log(reportResponse.data.result);
        const observationLinks = reportResponse.data.result; // Adjust according to the FHIR resource structure
        console.log("observationLinks::",observationLinks);
        const observationPromises = observationLinks.map(link =>
            
            axios.get(`${EHR_URL}/${link.reference}`) // Assumes full URL needs to be constructed
        );

        const observationResults = await Promise.all(observationPromises);
        console.log("observationResults",observationResults);
        setObservations(observationResults.map(res => res.data));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchObservations();
  }, [diagnosticReportId]);
  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Image Radiomics</h5>
      {/* <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span> */}
    </div>
  );
  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
      <DataTable value={observations}
      className="datatable-responsive"
      header={header}
      responsiveLayout="scroll"
      >
        <Column field="id" header="ID"></Column>
        <Column field="code.text" header="Type"></Column>
        <Column field="valueQuantity.value" header="Value"></Column>
        <Column field="valueQuantity.unit" header="Unit"></Column>
      </DataTable>
      </div>
      </div>
    </div>
  );
};

export default ObservationPage;
