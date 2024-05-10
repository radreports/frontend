import React, { useState, useEffect, useRef, Fragment } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictation = () => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [writeText, setWriteText] = useState('');
    const [resultText, setResultText] = useState('');

    const startListening = () => SpeechRecognition.startListening({ continuous: true });
    
    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const sendText2 = () => {
        console.log("Sending data to server: ", writeText);
        axios.post("http://127.0.0.1:5000/convert", { text: writeText })
            .then(response => {
                setResultText(response.data);
                console.log("Response received: ", response.data);
            })
            .catch(error => {
                console.error('Error sending data: ', error);
            });
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Advanced</h5>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="dictation">Dictation</label>
                            <InputTextarea id="dictation" rows="30" value={transcript} autoResize />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="write">Write</label>
                            <InputTextarea id="write" rows="30" value={writeText} onChange={(e) => setWriteText(e.target.value)} autoResize />
                        </div>
                        
                        <div className="col-12">
                            <button className="p-button-success mr-2 mb-2" onClick={startListening}>Start</button>
                            <button className="p-button-danger mr-2 mb-2" onClick={SpeechRecognition.stopListening}>Stop</button>
                            <button onClick={resetTranscript}>Reset</button>
                            <button onClick={sendText2}>Transcribe2</button>
                        </div>
                        
                        <div className="field col-12">
                            <label htmlFor="result">Report</label>
                            <InputTextarea id="result" rows="30" value={resultText} readOnly autoResize />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Dictation);
