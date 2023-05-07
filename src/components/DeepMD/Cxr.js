// eslint-disable-next-line
// import React, { useRef,useState } from 'react';
// import { FileUpload } from 'primereact/fileupload';
// import config from "./config";
// import axios from "axios";
// import { DropzoneArea } from "material-ui-dropzone";
import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import http from "./http-common";
// const url = "http://104.171.202.250:5000/cxr/predict"
const url = "http://models.deepmd.io/cxr/predict"
const Cxr = () => {
    const [previewImage, setPreviewImage] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    const handleUploadImage = () => {
        const data = new FormData();
        data.append('files[]', previewImage);

        // fetch(url, { method: 'POST',mode: 'cors',  data ,headers: {
        //     "Content-Type": "multipart/form-data",
        //   }}).then(async (response) => {
        //     const imageResponse = await response.json();
        //     setUploadedImage(imageResponse);
        // }).catch((err) => {

        // });
        http.post(url, data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
           
          });

    }

    const handleSelectImage = (event) => {
        const file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            setPreviewImage(fileReader.result);
        });
        fileReader.readAsDataURL(file);
    }

    return (
        <div>
            <input type="file" onChange={handleSelectImage} />
            {
                previewImage ?
                    <img src={previewImage} width={250} height={250} alt="preview-image" />
                :
                    null
            }
            {
                uploadedImage ?
                    <img src={uploadedImage} width={250} height={250} alt="uploaded-image" />
                :
                    null
            }
            <button onClick={handleUploadImage}>Upload</button>
        </div>
    );
}
     
export default React.memo(Cxr);
