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

    const sendText2 = () => {
        console.log("Sending data to server: ", inputText);
        axios.post("http://127.0.0.1:5000/convert", { text: inputText })
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
                        <div className="field col-12">
                            <label htmlFor="input">Input (Speech or Type)</label>
                            <InputTextarea id="input" rows="30" value={inputText} onChange={(e) => setInputText(e.target.value)} autoResize />
                        </div>
                        <div className="col-12">
                            <button className="p-button-success mr-2 mb-2" onClick={startListening}>Start</button>
                            <button className="p-button-danger mr-2 mb-2" onClick={SpeechRecognition.stopListening}>Stop</button>
                            <button onClick={() => {
                                resetTranscript();
                                setInputText('');
                            }}>Reset</button>
                            <button onClick={sendText2}>Transcribe</button>
                        </div>
                        <div className="field col-12">
                            <label htmlFor="result">Result</label>
                            <InputTextarea id="result" rows="30" value={resultText} readOnly autoResize />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Dictation);
