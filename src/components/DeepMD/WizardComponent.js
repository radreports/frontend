import React, { useState } from 'react';
import { Steps } from 'primereact/steps';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import axios from 'axios';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './styles.css';

const WizardComponent = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [requestType, setRequestType] = useState(null);
    const [subOption, setSubOption] = useState(null);
    const [serviceRequestId, setServiceRequestId] = useState(null);

    const items = [
        { label: 'Create Service Request' },
        { label: 'Upload DICOM Images' }
    ];

    const handleRequestSubmit = async () => {
        try {
            const response = await axios.post('https://{hostname}/servicerequest', {
                type: requestType,
                subOption: subOption
            });
            setServiceRequestId(response.data.id);
            setActiveIndex(1);
        } catch (error) {
            console.error('Error creating service request', error);
        }
    };

    const handleUpload = async (event) => {
        try {
            const formData = new FormData();
            for (let file of event.files) {
                formData.append('files', file);
            }
            await axios.post(`https://{hostname}/imagingstudy/${serviceRequestId}`, formData);
        } catch (error) {
            console.error('Error uploading files', error);
        }
    };

    return (
        <div className="wizard-container">
            <Steps model={items} activeIndex={activeIndex} />
            {activeIndex === 0 && (
                <div>
                    <h3>Select Request Type</h3>
                    <div className="radio-group">
                        <div className="radio-item">
                            <RadioButton inputId="oar" name="requestType" value="OAR" onChange={(e) => setRequestType(e.value)} checked={requestType === 'OAR'} />
                            <label htmlFor="oar">OAR</label>
                        </div>
                        <div className="radio-item">
                            <RadioButton inputId="cancerDetection" name="requestType" value="CANCER_DETECTION" onChange={(e) => setRequestType(e.value)} checked={requestType === 'CANCER_DETECTION'} />
                            <label htmlFor="cancerDetection">Cancer Detection</label>
                        </div>
                        <div className="radio-item">
                            <RadioButton inputId="other" name="requestType" value="OTHER" onChange={(e) => setRequestType(e.value)} checked={requestType === 'OTHER'} />
                            <label htmlFor="other">Other</label>
                        </div>
                    </div>

                    {requestType === 'OAR' && (
                        <div>
                            <h4>Select OAR Type</h4>
                            <div className="radio-group">
                                <div className="radio-item">
                                    <RadioButton inputId="hanOar" name="subOption" value="Han OAR" onChange={(e) => setSubOption(e.value)} checked={subOption === 'Han OAR'} />
                                    <label htmlFor="hanOar">Han OAR</label>
                                </div>
                                <div className="radio-item">
                                    <RadioButton inputId="lungs" name="subOption" value="Lungs" onChange={(e) => setSubOption(e.value)} checked={subOption === 'Lungs'} />
                                    <label htmlFor="lungs">Lungs</label>
                                </div>
                                <div className="radio-item">
                                    <RadioButton inputId="abdomen" name="subOption" value="Abdomen" onChange={(e) => setSubOption(e.value)} checked={subOption === 'Abdomen'} />
                                    <label htmlFor="abdomen">Abdomen</label>
                                </div>
                                <div className="radio-item">
                                    <RadioButton inputId="prostate" name="subOption" value="Prostate" onChange={(e) => setSubOption(e.value)} checked={subOption === 'Prostate'} />
                                    <label htmlFor="prostate">Prostate</label>
                                </div>
                            </div>
                        </div>
                    )}

                    {requestType === 'CANCER_DETECTION' && (
                        <div>
                            <h4>Select Cancer Detection Type</h4>
                            <div className="radio-group">
                                <div className="radio-item">
                                    <RadioButton inputId="headAndNeck" name="subOption" value="Head and Neck" onChange={(e) => setSubOption(e.value)} checked={subOption === 'Head and Neck'} />
                                    <label htmlFor="headAndNeck">Head and Neck</label>
                                </div>
                                <div className="radio-item">
                                    <RadioButton inputId="brain" name="subOption" value="Brain" onChange={(e) => setSubOption(e.value)} checked={subOption === 'Brain'} />
                                    <label htmlFor="brain">Brain</label>
                                </div>
                                <div className="radio-item">
                                    <RadioButton inputId="lungsCancer" name="subOption" value="Lungs" onChange={(e) => setSubOption(e.value)} checked={subOption === 'Lungs'} />
                                    <label htmlFor="lungsCancer">Lungs</label>
                                </div>
                                <div className="radio-item">
                                    <RadioButton inputId="liver" name="subOption" value="Liver" onChange={(e) => setSubOption(e.value)} checked={subOption === 'Liver'} />
                                    <label htmlFor="liver">Liver</label>
                                </div>
                            </div>
                        </div>
                    )}

                    <Button label="Create Request" onClick={handleRequestSubmit} />
                </div>
            )}

            {activeIndex === 1 && serviceRequestId && (
                <div>
                    <h3>Upload DICOM Images</h3>
                    <FileUpload name="dicomFiles" url={`https://{hostname}/imagingstudy/${serviceRequestId}`} multiple accept="application/dicom" onUpload={handleUpload} />
                </div>
            )}
        </div>
    );
};

export default WizardComponent;
