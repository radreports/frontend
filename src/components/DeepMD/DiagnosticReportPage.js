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
import {UploadDICOM} from './UploadDICOM';
import axios from 'axios';
import config from "./config";
import FHIR from "fhirclient"
import { OverlayPanel } from 'primereact/overlaypanel';
import { Link } from "react-router-dom";
const DiagnosticReportPage = () => {
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
        status: ""
    };
    
    
    const apiURL = config.API_URL +"/studies";
    const vieweerURL = config.VIEWER_URL;
    
    const [diagnosticReports, setDiagnosticReports] = useState(null);
    const [selectedReports, setSelectedReports] = useState(null);

    // const [diagnosticReport, setDiagnosticReport] = useState(null);
    // const [selectedDiagnosticReport, setSelectedDiagnosticReport] = useState(null);
    
    const [studies, setStudies] = useState(null);
    const [seriesID, setSeries] = useState(null);
    const [selectedStudies, setSelectedStudies] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const [radioValue, setRadioValue] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const getSelection = (e) => {
        let val = e;
        console.log("Selection is ::");
        console.log(e);
        // console.log("resource is ::",e.resource.id);
        // const id = e.resource.id;
        setSelectedReports(val);
        console.log("SelectedDiagnosticReports::",selectedReports)
        
        
        
    }
////

    useEffect(() => {
    const EHR_URL = config.EHR_URL;
    // const client = new FHIR.client(" http://hapi.fhir.org/baseR4/");
    const client = new FHIR.client(EHR_URL);
    const getPath = client.getPath;
    var my_resource = [] ;
    client.request(`/DiagnosticReport`, {
        pageLimit: 0 ,
        resolveReferences: [ "subject","result","study"]
    })
    .then(data => {
        console.log("From diagnostic report",data);
        try{
            const results = data.entry;
            setDiagnosticReports(results);
        }
        catch(e){}
    })
    .catch(err => {
        console.log(err);
     });

},[apiURL]);
    
    

    const confirmDeleteSelected = () => {
    
        console.log("Delete clicked",selectedStudies);
        for (var study of selectedStudies) {
            const header = {
                headers:{
                    "userID": "window.name" ,
                    "Authorization": "token"
                 }
              };
            axios.delete(apiURL+"/"+study.study_id,header).then((response) => {
                // console.log(response.data[0].Studies.patient_mrn);
                // console.log(response.data);
                // setStudies(response.data);
                axios.get(apiURL,header).then((response) => {
                    setStudies(response.data);
                });
              });
            console.log(study.study_id);
         }
         }
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={displayOverlay} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedStudies || !selectedStudies.length} />
                </div>
            </React.Fragment>
        )
    }
   
    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < studies.length; i++) {
            if (studies[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }
    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
    const displayOverlay = (e) =>{
        const dd = ""
        return (
           <>
            <OverlayPanel >
                
            
            </OverlayPanel>
            </>
        )
    }
    const idTemplate = (rowData) =>{
        try {
            // console.log("patient data ::",rowData);
            const id = rowData.resource.id;

            return (
            
                <>
                {/* createId(); */}
                 <span className="p-column-title">Name</span>
                 {id}
                 {/* <Link to="/drdetails">{id}</Link> */}
                   
                   
                </>
                
            )
          }
          catch(err) {
            
          }
        
    }
    const patientTemplate = (rowData) =>{
        try {
            // console.log("patient data ::",rowData);
            const subject = rowData.resource.subject;
            const b_date = subject.birthDate;
            // console.log("patient data ::",subject);
            var name = subject.name;
            var fName = name[0].given[0];
            var givenName = name[0].family;

            // console.log("subject data ::",rowData.subject.reference);
            // console.log("Patient::",rowData.resource.subject)
            return (
            
                <>
                {/* createId(); */}
                 <span className="p-column-title">Name</span>
                   {fName + " "+ givenName}
                   {/* <br></br> <span className="p-column-title">Patient ID</span> */}
                   {/* ID:  {rowData.resource.subject.id} */}
                    <br></br><span className="p-column-title">Patient Sex</span>
                    Sex: {rowData.resource.subject.gender}
                    <br></br><span className="p-column-title">Patient DOB</span>
                    DOB: {rowData.resource.subject.birthDate}
                </>
                
            )
          }
          catch(err) {
            
          }
        
    }
    const resultTemplate = (rowData) =>{
        try {
            
            const result = rowData.resource.conclusion;
            // pi-thumbs-up
            // pi-exclamation-triangle
            if (result.toLowerCase().includes("negative")){
            
                return (
                    <>
                    {/* createId(); */}
                    <span className="p-column-title">Name</span>
                    <i className="pi pi-check" ></i>
                    {/* <i class="pi pi-check" style="font-size: 2rem"></i> */}
                    {"  " +rowData.resource.conclusion}
                    
                    </>
                    
                )
            }
            return (
                <>
                {/* createId(); */}
                 <span className="p-column-title">Name</span>
                 <i className="pi pi-exclamation-triangle"></i>
                   {"  " +rowData.resource.conclusion}
                  
                </>
                
            )
          }
          catch(err) {
            
          }
        
    }
    var BodyPartExamined = "";
    const BodypartTemplate = (rowData) =>{
         
         try {
            // console.log("Bodypart examined ::",rowData.resource.result[0].bodySite);
            const result = rowData.resource.result[0].bodySite.text;
            // BodyPartExamined = rowData.resource.series[0].bodySite.display;
         return (
            <>
                <span className="p-column-title">BodyPartExamined</span>
                {result}
           </>
           )
         }
         catch(e){

         }
    }

    var modality = "";
    const modalityTemplate = (rowData) =>{
         
         try {
            modality = rowData.resource.code.text;
         return (
            <>
                <span className="p-column-title">BodyPartExamined</span>
                {modality}
           </>
           )
         }
         catch(e){

         }
    }
    var AccessionNumber = "";
    const AccessionNumberTemplate = (rowData) =>{
        AccessionNumber = rowData.AccessionNumber;
        return (
           <>
               <span className="p-column-title">infer_status</span>
               {AccessionNumber}
          </>
          )
   }
   var studyStatus = "";
   const studyStatusTemplate = (rowData) =>{
        
        try {
            studyStatus = rowData.resource.status;
        return (
           <>
               <span className="p-column-title">BodyPartExamined</span>
               {studyStatus}
          </>
          )
        }
        catch(e){

        }
   }
   var inference_findings = "";
   const InferResultTemplate = (rowData) =>{
    inference_findings = rowData.inference_findings;
    return (
       <>
           <span className="p-column-title">inference_findings</span>
           {inference_findings}
      </>
      )
}
   
    const openViewer = (id) =>{
        // console.log(id);
        // window.open("https://demo.deepmd.io/viewer-ohif/viewer/" +id, "_blank") 
        window.open(vieweerURL +id, "_blank") 
    }
    
    const viewerTemplate = (rowData) =>{
       const study_instance_uid =  rowData.resource.conclusionCode[0].coding[0].code;
        // const viewerURL = "https://demo.deepmd.io/viewer-ohif/viewer/" +{rowData.MainDicomTags.StudyInstanceUID};
        return (
            <>
             <div>

            <Button label="  .View "  className="p-button-raised p-button-info" onClick={() =>openViewer(study_instance_uid)} />
            </div>
            
            </>
            
        )
    }
  

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">DiagnosticReports</h5>
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
                <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>
    <DataTable ref={dt} value={diagnosticReports} selection={selectedReports} onSelectionChange={(e) =>getSelection(e.value)}
        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                       
        // Above two are added
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} studies"
        globalFilter={globalFilter} emptyMessage="No Reports found." header={header} responsiveLayout="scroll">
        {/* <Column selectionMode="single" headerStyle={{ width: '3rem'}}></Column> */}
        <Column field="id" header="ID" sortable body={idTemplate} headerStyle={{ width: '5%', minWidth: '10rem' }}></Column>
        <Column field="patient" header="Patient" sortable body={patientTemplate} headerStyle={{ width: '34%', minWidth: '10rem' }}></Column>
        <Column field="result" header="Result" sortable body={resultTemplate} headerStyle={{ width: '34%', minWidth: '10rem' }}></Column>
        <Column field="bodypart" header="Bodypart Examined" sortable body={BodypartTemplate} headerStyle={{ width: '34%', minWidth: '10rem' }}></Column>
        <Column field="modality" header="Modality" sortable body={modalityTemplate} headerStyle={{ width: '34%', minWidth: '10rem' }}></Column>
        <Column field="view" header="Image"  body={viewerTemplate} headerStyle={{ width: '34%', minWidth: '10rem' }}></Column>
        <Column field="status" header="Status" sortable body={studyStatusTemplate} headerStyle={{ width: '34%', minWidth: '10rem' }}></Column>
    </DataTable>

                  
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};
export default React.memo(DiagnosticReportPage, comparisonFn);