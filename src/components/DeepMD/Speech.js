import React, { useState, useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictation = () => {
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [inputText, setInputText] = useState('');
    const [resultText, setResultText] = useState('');

    useEffect(() => {
        setInputText(transcript);
    }, [transcript]);

    const startListening = () => SpeechRecognition.startListening({ continuous: true, clearTranscriptOnListen: true });

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }
    
    const sendText1 = () => {
        console.log("Sending data to server: ", inputText);
        axios.post("https://chat.radassist.ai/fhir", { text: inputText })
            .then(response => {
                setResultText(response.data);
                console.log("Response received: ", response.data);
            })
            .catch(error => {
                console.error('Error sending data: ', error);
            });
    };
    const sendText2 = () => {
        console.log("Sending data to server: ", inputText);
        axios.post("https://chat.radassist.ai/layman", { text: inputText })
            .then(response => {
                setResultText(response.data);
                console.log("Response received: ", response.data);
            })
            .catch(error => {
                console.error('Error sending data: ', error);
            });
    };
    const sendText3 = () => {
        console.log("Sending data to server: ", inputText);
        axios.post("https://chat.radassist.ai/conversation", { text: inputText })
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
                    <div className="col-12">
                            <button className="p-button-success mr-2 mb-2" onClick={startListening}>Start</button>
                            <button className="p-button-danger mr-2 mb-2" onClick={SpeechRecognition.stopListening}>Stop</button>
                            <button onClick={() => {
                                resetTranscript();
                                setInputText('');
                            }}>Reset</button>
                            <button onClick={sendText1}>FHIR</button>
                            <button onClick={sendText2}>Layman</button>
                            <button onClick={sendText3}>Medical Scribe</button>
                        </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-6">
                            <label htmlFor="input">Input (Speech or Type)</label>
                            <InputTextarea id="input" rows="15" value={inputText} onChange={(e) => setInputText(e.target.value)} autoResize />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="result">Result</label>
                            <InputTextarea id="result" rows="15" value={resultText} readOnly autoResize />
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Dictation);
