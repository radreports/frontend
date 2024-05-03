// import React, { useState } from 'react';
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
// import Speech from 'react-speech';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
const Dictation = () => {
   
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();
    //   useEffect(() => {
    // },[]);
      const startListening = () => SpeechRecognition.startListening({ continuous: true });
      if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
      }
      
      const sendText = () =>{
        
            console.log(transcript);
        axios.post("http://127.0.0.1:5000/convert",transcript)
      
        .then(res => {
            transcript = res.data
        })
       
        
    }

    return (
        <div className="grid">
 

            <div className="col-12">
                <div className="card">
                    <h5>Advanced</h5>
                    <div className="p-fluid formgrid grid">
                        
                        <div className="field col-12">
                            <label htmlFor="address">Address</label>
                            {/* <Speech text="Welcome to react speech" /> */}
                            <InputTextarea id="address" rows="1000" value={transcript}/>
                        </div>
                        
                        <button className="p-button-success mr-2 mb-2" onClick={startListening}>Start</button>
                        <button className="p-button-danger mr-2 mb-2" onClick={SpeechRecognition.stopListening}>Stop</button>
                        <button onClick={resetTranscript}>Reset</button>
                        <button onClick={sendText}>Transcribe</button>
                        
                        <div className="field col-12">
                            <label htmlFor="dictation">Address</label>
                            {/* <Speech text="Welcome to react speech" /> */}
                            <InputTextarea id="dictation" rows="1000" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Dictation, comparisonFn);
