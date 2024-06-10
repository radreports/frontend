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
        let accumulatedText = ''; // Use a local variable to accumulate text
    
        setResultText(''); // Reset the resultText when starting a new stream
        const eventSource = new EventSource(url.toString());
    
        eventSource.onmessage = function(event) {
            console.log("New data:", event.data);
            accumulatedText += event.data; // Accumulate text from each message
    
            if (event.data.includes("end_of_stream")) {
                console.log("Final data received, closing connection.");
                const formattedText = formatText(accumulatedText); // Format the complete text
                setResultText(formattedText); // Update state with the formatted text
                eventSource.close();
            } else {
                // Optionally update the state with unformatted text to show progress
                setResultText(accumulatedText);
            }
        };
    
        eventSource.onerror = function(event) {
            if (event.currentTarget.readyState === EventSource.CLOSED) {
                console.error("EventSource was closed.");
            } else if (event.currentTarget.readyState === EventSource.CONNECTING) {
                const formattedText = formatText(accumulatedText); // Format the complete text
                setResultText(formattedText); // Update state with the formatted text
                console.error("EventSource is reconnecting.");
            } else {
                
             
        console.error("EventSource encountered an error:", event);
            }
            eventSource.close();
        };
    };
    
    const handleStreamOpenAI2 = () => {
        const url = new URL(`${speech_url}/layman`);
        url.searchParams.append('text', inputText); // Add text as a query parameter
        let accumulatedText = ''; // Use a local variable to accumulate text
    
        setResultText(''); // Reset the resultText when starting a new stream
        const eventSource = new EventSource(url.toString());
    
        eventSource.onmessage = function(event) {
            console.log("New data:", event.data);
            accumulatedText += event.data; // Accumulate text from each message
    
            if (event.data.includes("end_of_stream")) {
                console.log("Final data received, closing connection.");
                const formattedText = formatText(accumulatedText); // Format the complete text
                setResultText(formattedText); // Update state with the formatted text
                eventSource.close();
            } else {
                // Optionally update the state with unformatted text to show progress
                setResultText(accumulatedText);
            }
        };
    
        eventSource.onerror = function(event) {
            if (event.currentTarget.readyState === EventSource.CLOSED) {
                console.error("EventSource was closed.");
            } else if (event.currentTarget.readyState === EventSource.CONNECTING) {
                const formattedText = formatText(accumulatedText); // Format the complete text
                setResultText(formattedText); // Update state with the formatted text
                console.error("EventSource is reconnecting.");
            } else {
                
             
        console.error("EventSource encountered an error:", event);
            }
            eventSource.close();
        };
    };
    const handleStreamOpenAI3 = () => {
        const url = new URL(`${speech_url}/conversation`);
        url.searchParams.append('text', inputText); // Add text as a query parameter
        let accumulatedText = ''; // Use a local variable to accumulate text
    
        setResultText(''); // Reset the resultText when starting a new stream
        const eventSource = new EventSource(url.toString());
    
        eventSource.onmessage = function(event) {
            console.log("New data:", event.data);
            accumulatedText += event.data; // Accumulate text from each message
    
            if (event.data.includes("end_of_stream")) {
                console.log("Final data received, closing connection.");
                const formattedText = formatText(accumulatedText); // Format the complete text
                setResultText(formattedText); // Update state with the formatted text
                eventSource.close();
            } else {
                // Optionally update the state with unformatted text to show progress
                setResultText(accumulatedText);
            }
        };
    
        eventSource.onerror = function(event) {
            if (event.currentTarget.readyState === EventSource.CLOSED) {
                console.error("EventSource was closed.");
            } else if (event.currentTarget.readyState === EventSource.CONNECTING) {
                const formattedText = formatText(accumulatedText); // Format the complete text
                setResultText(formattedText); // Update state with the formatted text
                console.error("EventSource is reconnecting.");
            } else {
                
             
        console.error("EventSource encountered an error:", event);
            }
            eventSource.close();
        };
        
    };
    
    // Helper function to format text
    const formatText = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, '\n\n$1\n');
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
                            <InputTextarea id="input" style={{ fontSize: '16px' }} rows="15" value={inputText} onChange={(e) => setInputText(e.target.value)} autoResize />
                        </div>
                        <div className="field col-6">
                            <label htmlFor="result">Result</label>
                            <InputTextarea id="result" style={{ fontSize: '16px' }} rows="15" value={resultText} readOnly autoResize />
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Dictation);
