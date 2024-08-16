import React, { useState, useEffect, useRef, Fragment } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { UploadDICOM } from './UploadDICOM';
import axios from 'axios';
import config from './config';
import FHIR from 'fhirclient';
import { OverlayPanel } from 'primereact/overlaypanel';
import NewServiceRTOrder from './imagingstudies/NewServiceRTOrder';
import { Link } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import ObservationPage from './ObservationPage';
import { Sidebar } from 'primereact/sidebar';

const ImagingStudiesPagePage = () => {
  // let user = JSON.parse(sessionStorage.getItem('authentication'));
  let token = sessionStorage.getItem('authentication');
  console.log(sessionStorage);
  // console.log("User toke::----->" + token)
  // const basicDialogFooter = <Button type="button" label="Dismiss" onClick={() => setDisplayBasic(false)} icon="pi pi-check" className="p-button-secondary" />;
  let emptyDiagnosticReport = {
    id: null,
    patient: null,
    result: null,
    bodypart: null,
    modality: null,
    view: null,
    status: '',
  };

  const apiURL = config.API_URL + '/studies';
  const vieweerURL = config.VIEWER_URL;
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible, setVisible] = useState(false);
  const [diagnosticReports, setDiagnosticReports] = useState(null);
  const [selectedReports, setSelectedReports] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // const [diagnosticReport, setDiagnosticReport] = useState(null);
  // const [selectedDiagnosticReport, setSelectedDiagnosticReport] = useState(null);

  const [studies, setStudies] = useState(null);
  const [seriesID, setSeries] = useState(null);
  const [selectedStudies, setSelectedStudies] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [radioValue, setRadioValue] = useState(null);
  const [diagnosticId, setDiagnosticId] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const op = useRef(null);
  const op2 = useRef(null);
  const op3 = useRef(null);
  // ?_include=DiagnosticReport:subject&_include=DiagnosticReport:imagingStudy&_include=DiagnosticReport:result
  const [reports, setReports] = useState([]);
  const EHR_URL = config.EHR_URL;


  const fetchReports = async () => {
    try {
      const response = await axios.get(
        'https://ehr.radassist.ai/fhir/ImagingStudy?_count=1000&_include=ImagingStudy:subject&reason=123456'
      );
      console.log('From axios', response.data);
      // console.log("included resources::",response.data.included)

      const entries = response.data.entry || [];

      // Separate DiagnosticReports, Patients, and Observations
      const diagnosticReports = [];
      const patients = [];
    //   const observations = [];
      entries.forEach((entry) => {
        const resource = entry.resource;
        if (resource.resourceType === 'ImagingStudy') {
          diagnosticReports.push(resource);
        } else if (resource.resourceType === 'Patient') {
          patients.push(resource);
        } 
      });
      const patientMap = new Map(
        patients.map((patient) => [patient.id, patient])
      );
      const enrichedReports = diagnosticReports.map((report) => {
        report.subject = patientMap.get(
          report.subject.reference.split('/').pop()
        );
        
        return report;
      });

      console.log('Enriched Diagnostic Reports:', enrichedReports);

      setDiagnosticReports(enrichedReports || []);
    } catch (error) {
      // console.error('Failed to fetch diagnostic reports:', error);
      // console.error('Error fetching data:', error.response.data);
    }
  };
  useEffect(() => {
    fetchReports();
  }, []);
  const getSelection = (e) => {
    let val = e;
    console.log(e.id);
    // console.log("resource is ::",e.resource.id);
    // const id = e.resource.id;
    setSelectedReports(val);
    setDiagnosticId(e.id);
    console.log('diagnostic id::', diagnosticId);
    console.log('SelectedDiagnosticReports::', selectedReports);
  };
  // const fetchReports = async () => {
  const deleteReport = async (e) => {
    let report_id = e.id;
    const response = await axios.delete(
      'https://ehr.radassist.ai/fhir/ImagingStudy/' + report_id
    );
    fetchReports();
    console.log('From axios', response.data);
  };

  const deleteButton = (rowData) => {
   
    return (
      <>
          <div>
            <Button
              label="  Delete "
              className="p-button-raised p-button-info"
              onClick={() => deleteReport(rowData)}
            />
          </div>
        </>
    );
  };


  const handlePageChange = (e) => {
    setCurrentPage(e.page + 1); // Adjust page index (DataTable is zero-indexed)
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          {/* <Button
            label="New"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={(e) => op.current.toggle(e)}
          /> */}

          {/* <OverlayPanel
            style={{ width: '95%', height: '95%', marginTop: '120px' }}
            ref={op}
            showCloseIcon
            dismissable
          >
            
            <NewServiceRTOrder />;
          </OverlayPanel>
           */}
          {/* <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedStudies || !selectedStudies.length}
          />
           */}
          <Sidebar
            visible={visible2}
            onHide={() => setVisible2(false)}
            fullScreen
          >
            <NewServiceRTOrder />;
          </Sidebar>
          <Button
            label="New"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={() => setVisible2(true)}
          />
        </div>
      </React.Fragment>
    );
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < studies.length; i++) {
      if (studies[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };
  const createId = () => {
    let id = '';
    let chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };
  const displayOverlay = (e) => {
    const dd = '';
    return (
      <>
        <OverlayPanel ref={op} showCloseIcon dismissable>
          <NewServiceRTOrder />;
        </OverlayPanel>
      </>
    );
  };
  const idTemplate = (rowData) => {
    try {
      // console.log("patient data ::",rowData);
      const id = rowData.id;
      //   console.log("Diagnostic Report id is ::",id);
      //   const op2 = React.useRef();

      const handleClick = (e) => {
        console.log('Button id!', id);
        setDiagnosticId(id);
        console.log('Button clicked!', e);
        op2.current.toggle(e);
      };
      const handleClick2 = () => {
        console.log('Button id!', id);
        setDiagnosticId(id);
        // console.log('Button clicked!',e);
        // op2.current.toggle(e);
        setVisible3(true);
      };

      return (
        <>
          {/* createId(); */}
          <span className="p-column-title">Name</span>

          {/* <Button
            label={id}
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={handleClick}
          /> */}

          <Sidebar
            visible={visible3}
            onHide={() => setVisible3(false)}
            fullScreen
          >
            <ObservationPage diagnosticReportId={diagnosticId} />
          </Sidebar>
          <Button
            label="Measurements"
            icon="pi "
            className="p-button-success mr-2"
            onClick={handleClick2}
          />
        </>
      );
    } catch (err) {}
  };
  const patientTemplate = (rowData) => {
    try {
      // console.log("patient data ::",rowData.subject);
      const subject = rowData.subject;
      const b_date = subject.birthDate;
      // console.log("patient data ::",subject);
      var name = subject.name;
      // console.log("Name::",name[0].given[0]);
      var fName = name[0].given[0];
      var givenName = name[0].family;

      // console.log("subject data ::",rowData.subject.reference);
      // console.log("Patient::",rowData.resource.subject)
      return (
        <>
          {/* createId(); */}
          <span className="p-column-title">Name</span>
          {fName + ' ' + givenName}
          {/* <br></br> <span className="p-column-title">Patient ID</span> */}
          {/* ID:  {rowData.resource.subject.id} */}
          <br></br>
          <span className="p-column-title">Patient Sex</span>
          Sex: {rowData.subject.gender}
          <br></br>
          <span className="p-column-title">Patient DOB</span>
          DOB: {rowData.subject.birthDate}
        </>
      );
    } catch (err) {}
  };
  const resultTemplate = (rowData) => {
    try {
      console.log('rowData::', rowData.conclusion);
      const result = rowData.conclusion;
      // pi-thumbs-up
      // pi-exclamation-triangle
      if (result.toLowerCase().includes('positive')) {
        return (
          <>
            {/* createId(); */}
            <span className="p-column-title">Name</span>
            {/* <i className="pi pi-check" ></i> */}
            <i className="pi pi-exclamation-triangle"></i>

            {/* <i class="pi pi-check" style="font-size: 2rem"></i> */}
            {/* {'  ' + rowData.conclusion} */}
          </>
        );
      }
      return (
        <>
          {/* createId(); */}
          <span className="p-column-title">Name</span>
          <i className="pi pi-check"></i>
          {/* <i className="pi pi-exclamation-triangle"></i> */}
          {'  ' + rowData.conclusion}
        </>
      );
    } catch (err) {}
  };
  var BodyPartExamined = '';
  const BodypartTemplate = (rowData) => {
    try {
      // console.log("Bodypart examined ::",rowData.resource.result[0].bodySite);
      const result = rowData.result[0].bodySite.text;
      // BodyPartExamined = rowData.resource.series[0].bodySite.display;
      return (
        <>
          <span className="p-column-title">BodyPartExamined</span>
          {result}
        </>
      );
    } catch (e) {}
  };

  var modality = '';
  const modalityTemplate = (rowData) => {
    try {
      modality = rowData.resource.code.text;
      return (
        <>
          <span className="p-column-title">BodyPartExamined</span>
          {modality}
        </>
      );
    } catch (e) {}
  };
  var AccessionNumber = '';
  const AccessionNumberTemplate = (rowData) => {
    AccessionNumber = rowData.AccessionNumber;
    return (
      <>
        <span className="p-column-title">infer_status</span>
        {AccessionNumber}
      </>
    );
  };
  var studyStatus = '';
  const studyStatusTemplate = (rowData) => {
    try {
      studyStatus = rowData.status;
      return (
        <>
          <span className="p-column-title">BodyPartExamined</span>
          {studyStatus}
        </>
      );
    } catch (e) {}
  };
  var inference_findings = '';
  const InferResultTemplate = (rowData) => {
    inference_findings = rowData.inference_findings;
    return (
      <>
        <span className="p-column-title">inference_findings</span>
        {inference_findings}
      </>
    );
  };

  const openViewer = (id) => {
    // console.log(id);
    // window.open("https://demo.deepmd.io/viewer-ohif/viewer/" +id, "_blank")
    window.open(vieweerURL + id, '_blank');
  };

  const viewerTemplate = (rowData) => {
    const study_instance_uid = ""+rowData.series[0].uid;
    console.log("Instance id::",rowData.series[0].uid);
    // rowData.conclusionCode[0].coding[0].code;
    // const viewerURL = "https://demo.deepmd.io/viewer-ohif/viewer/" +{rowData.MainDicomTags.StudyInstanceUID};
    return (
      <>
        <div>
          <Button
            label="  DICOM "
            className="p-button-raised p-button-info"
            onClick={() => openViewer(study_instance_uid)}
          />
        </div>
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">OAR Contours</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
          <DataTable
            ref={dt}
            value={diagnosticReports}
            selection={selectedReports}
            onSelectionChange={(e) => getSelection(e.value)}
            dataKey="id"
            paginator
            rows={20}
            rowsPerPageOptions={[5, 10, 20]}
            className="datatable-responsive"
            // Above two are added
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} reports"
            globalFilter={globalFilter}
            emptyMessage="No Reports found."
            header={header}
            responsiveLayout="scroll"
            // totalRecords={totalRecords}
            // onPage={handlePageChange}
          >
            <Column
              // selectionMode="single"
              headerStyle={{ width: '3rem' }}
            ></Column>
            <Column
              field="id"
              header="Study ID"
              sortable
              headerStyle={{ width: '10%', minWidth: '10rem' }}
            ></Column>
            {/* deleteButton */}
            {/* <Column
              field="Delete"
              header="Image"
              body={deleteButton}
              headerStyle={{ width: '34%', minWidth: '10rem' }}
            ></Column> */}
            <Column
              field="patient"
              header="Patient"
              body={patientTemplate}
              headerStyle={{ width: '20%', minWidth: '10rem' }}
            ></Column>

            {/* <Column
              field="result"
              header=""
              body={resultTemplate}
              headerStyle={{ width: '1%' }}
            ></Column> */}

            <Column
              field="description"
              header="description"
              sortable
              headerStyle={{ width: '20%', minWidth: '10rem' }}
            ></Column>
            {/* <Column
              field="bodypart"
              header="Bodypart Examined"
              sortable
              body={BodypartTemplate}
              headerStyle={{ width: '34%', minWidth: '10rem' }}
            ></Column> */}
            {/* <Column
              field="modality"
              header="Modality"
              sortable
              body={modalityTemplate}
              headerStyle={{ width: '34%', minWidth: '10rem' }}
            ></Column> */}
            <Column
              field="view"
              header="Image"
              body={viewerTemplate}
              headerStyle={{ width: '10%', minWidth: '10rem' }}
            ></Column>
            {/* <Column
              field="id"
              header="Measurements"
              body={idTemplate}
              headerStyle={{ width: '5%', minWidth: '10rem' }}
            ></Column> */}
            <Column
              field="status"
              header="Status"
              sortable
              body={studyStatusTemplate}
              headerStyle={{ width: '30%', minWidth: '10rem' }}
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

const comparisonFn = function (prevProps, nextProps) {
  return prevProps.location?.pathname === nextProps.location?.pathname;
};

export default React.memo(ImagingStudiesPagePage, comparisonFn);
