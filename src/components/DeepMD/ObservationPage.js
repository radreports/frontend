import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import config from "./config";

const ObservationPage = ({ diagnosticReportId }) => {
  const [observations, setObservations] = useState([]);
  const EHR_URL = config.EHR_URL;

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const reportResponse = await axios.get(`${EHR_URL}/DiagnosticReport/${diagnosticReportId}`);
        const observationLinks = reportResponse.data.result || []; // Ensuring there's a fallback
        const observationPromises = observationLinks.map(link =>
          axios.get(`${EHR_URL}/${link.reference}`)
        );
        const observationResults = await Promise.all(observationPromises);
        const formattedData = observationResults.map(res => ({
          id: res.data.id,
          typeCode: res.data.code.coding[0].code,  // Accessing the first coding entry
          typeDisplay: res.data.code.coding[0].display,
          value: res.data.valueQuantity.value,
          unit: res.data.valueQuantity.unit
        }));
        setObservations(formattedData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchObservations();
  }, [diagnosticReportId]);

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Radiomic Feature</h5>
    </div>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <DataTable value={observations}
                     className="datatable-responsive"
                     header={header}
                     responsiveLayout="scroll">
            <Column field="id" header="ID"></Column>
            <Column field="typeCode" header="Code"></Column>
            <Column field="typeDisplay" header="Description"></Column>
            <Column field="value" header="Value"></Column>
            <Column field="unit" header="Unit"></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default ObservationPage;
