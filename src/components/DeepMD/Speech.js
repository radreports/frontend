import React, { useState, useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictation = () => {
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [inputText, setInputText] = useState('');
    const [resultText, setResultText] = useState('');
    const speech_url = 'https://chat.radassist.ai';
    // const speech_url = 'http://127.0.0.1:5000';

    useEffect(() => {
        setInputText(transcript);
    }, [transcript]);

    const startListening = () => SpeechRecognition.startListening({ continuous: true, clearTranscriptOnListen: true });

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }
    
    const sendText1 = () => {
        console.log("Sending data to server: ", inputText);
        // axios.post("https://chat.radassist.ai/fhir", { text: inputText })
        axios.post(`${speech_url}/fhir`, { text: inputText })
            .then(response => {
                setResultText(response.data);
                console.log("Response received: ", response.data);
            })
            .catch(error => {
                console.error('Error sending data: ', error);
            });
    };

    const handleStreamOpenAI = () => {
        const url = new URL(`${speech_url}/fhir`);
        url.searchParams.append('text', inputText); // Add text as a query parameter
        setResultText('');
        const eventSource = new EventSource(url.toString());
        eventSource.onmessage = function(event) {
            console.log("New data:", event.data);
            setResultText(oldText => oldText  + event.data);
            if(event.data.includes("end_of_stream")) {
                console.log("Final data received, closing connection.");
                eventSource.close();
                // Handle any cleanup or final actions here
            }
        };
        eventSource.onerror = function(err) {
            console.log("EventSource failed:", err);
            eventSource.close();
        };
    };
    
    const handleStreamOpenAI2 = () => {
        const url = new URL(`${speech_url}/layman`);
        setResultText('');
        url.searchParams.append('text', inputText); // Add text as a query parameter
    
        const eventSource = new EventSource(url.toString());
        eventSource.onmessage = function(event) {
            console.log("New data:", event.data);
            setResultText(oldText => oldText  + event.data);
            if(event.data.includes("end_of_stream")) {
                console.log("Final data received, closing connection.");
                eventSource.close();
                // Handle any cleanup or final actions here
            }
        };
        eventSource.onerror = function(err) {
            console.log("EventSource failed:", err);
            eventSource.close();
        };
    };
    const handleStreamOpenAI3 = () => {
        const url = new URL(`${speech_url}/conversation`);
        url.searchParams.append('text', inputText); // Add text as a query parameter
        setResultText('');
        const eventSource = new EventSource(url.toString());
        eventSource.onmessage = function(event) {
            console.log("New data:", event.data);
            setResultText(oldText => oldText  + event.data);
            if(event.data.includes("end_of_stream")) {
                console.log("Final data received, closing connection.");
                eventSource.close();
                // Handle any cleanup or final actions here
            }
        };
        eventSource.onerror = function(err) {
            console.log("EventSource failed:", err);
            eventSource.close();
        };
    };
    
    const sendText2 = () => {
        console.log("Sending data to server: ", inputText);
        axios.post(`${speech_url}/layman`, { text: inputText })
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
        axios.post(`${speech_url}/conversation`, { text: inputText })
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
                            <button onClick={handleStreamOpenAI}>FHIR</button>
                            <button onClick={handleStreamOpenAI2}>Layman</button>
                            <button onClick={handleStreamOpenAI3}>Medical Scribe</button>
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
