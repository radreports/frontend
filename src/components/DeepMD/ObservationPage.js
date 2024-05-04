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
  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const reportResponse = await axios.get(`${EHR_URL}/DiagnosticReport/${diagnosticReportId}`);
        console.log(reportResponse.data.result);
        const observationLinks = reportResponse.data.result; // Adjust according to the FHIR resource structure

        const observationPromises = observationLinks.map(link =>
          axios.get(`${EHR_URL}/${link.reference}`) // Assumes full URL needs to be constructed
        );

        const observationResults = await Promise.all(observationPromises);
        setObservations(observationResults.map(res => res.data));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchObservations();
  }, [diagnosticReportId]);

  return (
    <div>
      <DataTable value={observations}>
        <Column field="id" header="ID"></Column>
        <Column field="code.text" header="Type"></Column>
        <Column field="valueQuantity.value" header="Value"></Column>
        <Column field="valueQuantity.unit" header="Unit"></Column>
      </DataTable>
    </div>
  );
};

export default ObservationPage;
