import React, { useState, useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import annyang from 'annyang';
import { browserName, browserVersion } from 'react-device-detect';
import { Button } from 'primereact/button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
const Dictation = () => {
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [inputText, setInputText] = useState('');
    const [resultText, setResultText] = useState('');
    const speech_url = 'https://chat.radassist.ai';

    const annyang = require('annyang');
    useEffect(() => {
        console.log(`The user is browsing with ${browserName} version ${browserVersion}`);

        if (browserName === 'Chrome' && browserSupportsSpeechRecognition) {
            console.log("Using Web Speech API for Chrome.");
        } else if (annyang) {
            console.log("Using Annyang for speech recognition in non-Chrome browser.");
            const commands = {
                '*text': (text) => setInputText(prevText => prevText + ' ' + text),
            };

            annyang.addCommands(commands);
            annyang.start({ continuous: true });

            return () => {
                annyang.abort();
            };
        } else {
            console.log("No speech recognition support in this browser.");
            
        }
    }, [browserSupportsSpeechRecognition]);

    useEffect(() => {
        if (browserSupportsSpeechRecognition && browserName === 'Chrome') {
            setInputText(transcript);
        }
    }, [transcript, browserSupportsSpeechRecognition]);

    const startListening = () => {
        if (browserSupportsSpeechRecognition && browserName === 'Chrome') {
            console.log("Starting Web Speech API recognition.");
            SpeechRecognition.startListening({ continuous: true, clearTranscriptOnListen: true });
        } else if (annyang) {
            console.log("Starting Annyang recognition.");
            annyang.start({ continuous: true });
        }
    };

    const stopListening = () => {
        if (browserSupportsSpeechRecognition && browserName === 'Chrome') {
            console.log("Stopping Web Speech API recognition.");
            SpeechRecognition.stopListening();
        } else if (annyang) {
            console.log("Stopping Annyang recognition.");
            annyang.abort();
        }
    };

    const sendText = (endpoint) => {
        console.log("Sending data to server: ", inputText);
        axios.post(`${speech_url}/${endpoint}`, { text: inputText })
            .then(response => {
                setResultText(response.data);
                console.log("Response received: ", response.data);
            })
            .catch(error => {
                console.error('Error sending data: ', error);
            });
    };

    const handleStreamOpenAI = (endpoint) => {
        const url = new URL(`${speech_url}/${endpoint}`);
        url.searchParams.append('text', inputText);
        let accumulatedText = '';

        setResultText('');
        const eventSource = new EventSource(url.toString());

        eventSource.onmessage = function(event) {
            console.log("New data:", event.data);
            accumulatedText += event.data;

            if (event.data.includes("end_of_stream")) {
                console.log("Final data received, closing connection.");
                const formattedText = formatText(accumulatedText);
                setResultText(formattedText);
                eventSource.close();
            } else {
                setResultText(accumulatedText);
            }
        };

        eventSource.onerror = function(event) {
            if (event.currentTarget.readyState === EventSource.CLOSED) {
                console.error("EventSource was closed.");
            } else if (event.currentTarget.readyState === EventSource.CONNECTING) {
                const formattedText = formatText(accumulatedText);
                setResultText(formattedText);
                console.error("EventSource is reconnecting.");
            } else {
                console.error("EventSource encountered an error:", event);
            }
            eventSource.close();
        };
    };

    const formatText = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, '\n\n$1\n');
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Voice Dictation</h5>
                    <div className="col-12">
                    <ButtonGroup>
                        <button className="p-button-success mr-2 mb-2" onClick={startListening}>Start</button>
                        <button className="p-button-danger mr-2 mb-2" onClick={stopListening}>Stop</button>
                        </ButtonGroup>
                        <button onClick={() => {
                            resetTranscript();
                            setInputText('');
                            setResultText('');
                        }}>Reset</button>
                        <button onClick={() => handleStreamOpenAI('fhir')}>FHIR</button>
                        <button onClick={() => handleStreamOpenAI('layman')}>Layman</button>
                        <button onClick={() => handleStreamOpenAI('conversation')}>Medical Scribe</button>
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
                    <button onClick={() => {
                            resetTranscript();
                            setInputText('');
                            setResultText('');
                        }}>Reset</button>
                        <button onClick={() => handleStreamOpenAI('fhir')}>FHIR</button>
                        <button onClick={() => handleStreamOpenAI('layman')}>Layman</button>
                        <button onClick={() => handleStreamOpenAI('conversation')}>Medical Scribe</button>
                </div>
            </div>
        </div>
    );
}

export default React.memo(Dictation);
