// eslint-disable-next-line
// import React, { useRef } from 'react';
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import config from "./config";
import axios from 'axios';
import { NULL } from 'sass';
import { Dropdown } from 'primereact/dropdown';



const UploadDICOM = () => {
    const citySelectItems = [
        {label: 'Lung Nodules', value: 'lung'},
        {label: 'Liver Tumor', value: 'liver'},
        {label: 'ICH', value: 'ich'},
        {label: 'CXR', value: 'cxr'},
        {label: 'Prostate', value: 'prostate'},
        {label: 'Colon', value: 'Colon'},
        {label: 'Kidneys', value: 'Kidneys'},
        {label: 'Brain Tumor', value: 'Brain'},
        {label: 'Pancreas', value: 'Pancreas'}
    ];
    const [selected, setSelected] = useState(null);
    const setSelectedValue = (value) =>{
        console.log(value);
        setSelected(value);
        console.log("selected::",selected);
    }
    
    const url = config.API_URL + "/studies";
   
    
    const fileRef = useRef(null);
    
    const [totalSize, setTotalSize] = useState(10);
    const onEmptyTemplate = (event) => {
        console.log("onEmptyTemplate called")
        setTotalSize(0);
        // Toast.show({severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode'});
    
    }
    const Upload = (event) => {
        //event.files == files to upload
        console.log("files to upload ::",event.files);
        const formData = new FormData();
        event.files.forEach(file=>{
            formData.append("files", file);
          });
        axios({
            method: "POST",
            url: url,
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
              "userID": window.name,
              "Task":selected
            }
    }).then(res => {
        
        console.log(res);
        
        setTotalSize(0);
        // fileRef?.clear();
        // fileRef?.clear() ;
        
        // event.target.value = null;
        onEmptyTemplate(event);
      })
    //   fileRef?.clear();
    // fileRef.current.value = '';
    fileRef.current.clear();
    // event.clear();
    event.files = "";
    event = "";
    console.log(event)
    // event.files = null;
    // event.target.reset();
    // document.getElementById("create-course-form").value = "";
    // setTotalSize(0);
    // onEmptyTemplate(event);
    
}
//<FileUpload name="files" url={url}  action="post" onUpload={onUpload} multiple accept="*/*" maxFileSize={100000000} />
        // if (totalSize === 0)  
        // return (
        //     <div className="flex align-items-center flex-column">
        //         <i className="pi pi-image mt-3 p-5" style={{'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)'}}></i>
        //         <span style={{'fontSize': '1.2em', color: 'var(--text-color-secondary)'}} className="my-5">Drag and Drop Image Here</span>
        //     </div>
        // )   
        if(selected ==null){
            console.log("from if selected::",selected);
            // const modalityTemplate = () =>{
             return (
             <>
             <span> 
             </span>
              <Dropdown value={selected} options={citySelectItems} onChange={(e) => setSelectedValue(e.value)} placeholder="Select  Study"/>
            
          </>
        )
    // }
        // modalityTemplate();
    }
                
    return (
        <div >
            <div className="col-12">
            <div className="card">
            
        {/* <Dropdown value={selected} options={citySelectItems} onChange={(e) => setSelectedValue(e.value)} placeholder="Select Task"/> */}
 
                    
            </div>
                <div className="card">
                    <h5>Upload DICOM</h5>

                    
                    <FileUpload ref={fileRef} id="create-course-form" name="files" url={url}  action="post"  customUpload uploadHandler={Upload}  multiple accept="*/*" maxFileSize={100000000 } ref={fileRef}/>
                    
                </div>
            </div>
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(UploadDICOM, comparisonFn);
