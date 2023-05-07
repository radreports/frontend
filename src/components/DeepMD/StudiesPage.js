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
import { Sidebar } from 'primereact/sidebar';
import UploadDICOM from './UploadDICOM';
import ServicerequestNew from "./ServicerequestNew";
import axios from 'axios';
import config from "./config";
import FHIR from "fhirclient"
import { OverlayPanel } from 'primereact/overlaypanel';
import StepWizard from "react-step-wizard";
import Wizard from "./wizards/wizard"
const StudiesPage = () => {
    // let user = JSON.parse(sessionStorage.getItem('authentication'));
    let token = sessionStorage.getItem('authentication');
    console.log(sessionStorage);
    // console.log("User toke::----->" + token)
    // const basicDialogFooter = <Button type="button" label="Dismiss" onClick={() => setDisplayBasic(false)} icon="pi pi-check" className="p-button-secondary" />;
    
    let emptyStudy = {
        "bodypart_examined" : "",
        "patient_sex" : "",
        "infer_date" : "",
        "patient_name" : "",
        "patient_mrn" : "",
        "findings" : "",
        "infer_status" : "",
        "patient_age" : "",
        "referring_physician_name" : "",
        "study_id" : "",
        "study_instance_uid" : "",
        "user_id" : ""
    
    };
    const op = useRef(null);
    const apiURL = config.API_URL +"/studies";
    const ehrURL = config.EHR_URL;
    const niftiURL = config.API_URL +"/nifti?id=";
    const predictURL = config.API_URL +"/predict?id=";
    const vieweerURL = config.VIEWER_URL;
    const downloadURL = config.API_URL +"/dicom?id=";
    // const [displayBasic, setDisplayBasic] = useState(false);
    const [visibleFullScreen, setVisibleFullScreen] = useState(false);
    
    const [studies, setStudies] = useState(null);
    const [seriesID, setSeries] = useState(null);
    const [selectedStudies, setSelectedStudies] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const [radioValue, setRadioValue] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

////

    useEffect(() => {
        const client = new FHIR.client(ehrURL);
    const getPath = client.getPath;
    client.request(`/ImagingStudy`, {
        // resolveReferences: "patientReference"
        resolveReferences: [ "practitioner","subject","basedon"]
    })
    .then(data => {
        // console.log(data);
        try{
        var result = data.entry;
        for (var i=0; i< result.length; i++ ){
            console.log(result[i]);
            console.log(result[i].resource.series);
        }
        setStudies(result);
        }
        catch(err){
            
        }

    });},[apiURL]);
    // .then(data => data.entry.map(item => {
    //     const res = item.resource;
    //     console.log(res);
    //     // console.log(res.subject);
    //     // const patients = res.subject;
    //     const series = res.series;
    //     const status = res.status;
    //     setStudies(res);
    // }
    // ));},[apiURL]);
    

    const confirmDeleteSelected = () => {
    
        console.log("Delete clicked",selectedStudies);
        for (var study of selectedStudies) {
            const header = {
                headers:{
                    "userID": window.name ,
                    "Authorization": token
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
         const toggle = (event) => {
            op.current.toggle(event);
        };
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
               <div >

               <Sidebar visible={visibleFullScreen} onHide={() => setVisibleFullScreen(false)} baseZIndex={1000} fullScreen>
               <Wizard />
               {/* <UploadDICOM/> */}
                </Sidebar>
                 {/* <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={() => setVisibleFullScreen(true)} /> */}
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={toggle} />
                
                 <OverlayPanel ref={op} appendTo={document.body} showCloseIcon>
                 
                    {/* <UploadDICOM/> */}
                    <Wizard />
                  
                </OverlayPanel>
                
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
        console.log("from overlay");
        return (
           <>
            <OverlayPanel ref={op} appendTo={document.body} showCloseIcon>
            <UploadDICOM/>
            </OverlayPanel>
            {/* <OverlayPanel >
                
            
            </OverlayPanel> */}
            </>
        )
    }
    const patientTemplate = (rowData) =>{
        try {
            // console.log("Patient::",rowData.resource.subject)
            return (
            
                <>
                {/* createId(); */}
                 <span className="p-column-title">Name</span>
                    Name: {rowData.resource.subject.name[0].given}
                   <br></br> <span className="p-column-title">Patient ID</span>
                   ID:  {rowData.resource.subject.id}
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
    
    var BodyPartExamined = "";
    const BodypartTemplate = (rowData) =>{
         
         try {
            BodyPartExamined = rowData.resource.series[0].bodySite.display;
         return (
            <>
                <span className="p-column-title">BodyPartExamined</span>
                {BodyPartExamined}
           </>
           )
         }
         catch(e){

         }
    }

    var modality = "";
    const modalityTemplate = (rowData) =>{
        try {
            const series = rowData.resource.series;
            for (var i=0; i < series.length; i++){
             var modality = rowData.resource.series[i].modality.code;
            }
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

   var referrer = "";
   const referrerTemplate = (rowData) =>{
        
        try {
            referrer = rowData.resource.referrer.reference;
        return (
           <>
               {/* <span className="p-column-title">BodyPartExamined</span> */}
               {referrer}
          </>
          )
        }
        catch(e){

        }
   }

   var note = "";
   const studyNoteTemplate = (rowData) =>{
        
        try {
            note = rowData.resource.note[0].text;
        return (
           <>
               <span className="p-column-title">BodyPartExamined</span>
               {note}
          </>
          )
        }
        catch(e){

        }
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
   
    const openViewer = (rowData) =>{
        const series = rowData.resource.series[0].uid;
            // for (var i=0; i < series.length; i++){
            //  var modality = rowData.resource.series[i].modality.code;
            // }
        // console.log(id);
        // window.open("https://demo.deepmd.io/viewer-ohif/viewer/" +id, "_blank") 
        window.open(vieweerURL +series, "_blank") 
    }
    
    const viewerTemplate = (rowData) =>{
        // const viewerURL = "https://demo.deepmd.io/viewer-ohif/viewer/" +{rowData.MainDicomTags.StudyInstanceUID};
        return (
            <>
             <div>

            <Button label="  .View "  className="p-button-raised p-button-info" onClick={() =>openViewer(rowData)} />
            </div>
            
            </>
            
        )
    }
  

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Imaging Studies</h5>
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
    <DataTable ref={dt} value={studies} selection={selectedStudies} onSelectionChange={(e) => setSelectedStudies(e.value)}
        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                       
        // Above two are added
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} studies"
        globalFilter={globalFilter} emptyMessage="No Studies found." header={header} responsiveLayout="scroll">
        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
        <Column field="patient" header="Patient" sortable body={patientTemplate} headerStyle={{ width: '34%', minWidth: '10rem' }}></Column>
        <Column field="referringphysician" header="Refering Physician" sortable body={referrerTemplate} headerStyle={{ width: '34%', minWidth: '10rem' }}></Column>
        <Column field="note" header="Note" sortable body={studyNoteTemplate} headerStyle={{ width: '34%', minWidth: '10rem' }}></Column>
        {/* <Column field="AccessionNumber" header="AccessionNumber" sortable body={AccessionNumberTemplate} headerStyle={{ width: '34%', minWidth: '10rem' }}></Column>                          */}
        <Column field="modaality" header="Modality" sortable body={modalityTemplate} headerStyle={{ width: '34%', minWidth: '10rem' }}></Column>
        {/* <Column field="Status" header="Study Status" sortable body={InferStatusTemplate} headerStyle={{ width: '34%', minWidth: '10rem' }}></Column> */}
        {/* <Column field="Findings" header="Findings" sortable body={InferResultTemplate} headerStyle={{ width: '34%', minWidth: '10rem' }}></Column> */}
                        
        <Column field="series" header="Seies" sortable body={viewerTemplate} headerStyle={{ width: '34%', minWidth: '10rem' }}></Column>
           
        {/* <Column field="view" header="Viewer"  body={viewerTemplate} headerStyle={{ width: '34%', minWidth: '10rem' }}></Column> */}
                        
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

export default React.memo(StudiesPage, comparisonFn);