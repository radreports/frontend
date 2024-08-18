import React, { useState, useEffect, useRef } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { FiSend } from 'react-icons/fi';
import { AiOutlinePaperClip, AiOutlineCopy } from 'react-icons/ai';
import { FaMicrophone, FaHeadphones } from 'react-icons/fa';
import axios from 'axios';
import "./chat.css";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [speechSynthesisInstance, setSpeechSynthesisInstance] = useState(null);

    // Function to detect browser type
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    // Function to handle headphone icon click and start recording
    const handleHeadphoneClick = () => {
        if (!isRecording) {
            startRecordingAudio();
        } else {
            stopRecordingAudio();
        }
    };

    // Function to start recording audio
    const startRecordingAudio = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorderRef.current = mediaRecorder;
                    mediaRecorder.start();

                    mediaRecorder.ondataavailable = (e) => {
                        setAudioBlob(e.data);
                    };

                    mediaRecorder.onstop = async () => {
                        stream.getTracks().forEach(track => track.stop());
                        await sendAudioToServer();
                    };
                })
                .catch(err => {
                    console.error('Error accessing microphone', err);
                });
        }
        setIsRecording(true);
    };

    // Function to stop recording audio
    const stopRecordingAudio = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

    // Function to send the audio to the server
    const sendAudioToServer = async () => {
        if (audioBlob) {
            setLoading(true);
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.mp3');

            try {
                const response = await axios.post('https://chat.deepmd.io/audio', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log("Response Audio",response.data);
                const { extracted_text, llama_response_text, audio_url } = response.data;
                setMessages([...messages, { role: 'RadAssistant', content: llama_response_text }]);
                setAudioURL(audio_url);
                setAudioBlob(null);
            } catch (error) {
                console.error('Error sending audio message:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    // Function to play the audio response from the server
    const playAudio = () => {
        const audio = new Audio(audioURL);
        audio.play();
    };

    // Automatically scroll to the bottom when messages change
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (selectedFile) {
            // Handle file upload
        } else if (userInput.trim()) {
            // Handle text message
        } else if (audioBlob) {
            setLoading(true);
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.mp3');
    
            try {
                const response = await axios.post('https://chat.deepmd.io/audio', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                const newMessages = [
                    ...messages, 
                    { role: 'user', content: response.data.extracted_text },
                    { role: 'RadAssistant', content: response.data.llama_response }
                ];
                setMessages(newMessages);
                setAudioBlob(null); // Clear the audio blob after sending
    
                // Text-to-Speech with Female Voice
                const speech = new SpeechSynthesisUtterance(response.data.llama_response);
                speech.lang = 'en-US';
                speech.rate = 1;
                speech.pitch = 1;
                speech.volume = 1;
                const voices = window.speechSynthesis.getVoices();
                const femaleVoice = voices.find(voice => voice.name === 'Google UK English Female' || voice.name === 'Samantha' || voice.gender === 'female');
                if (femaleVoice) {
                    speech.voice = femaleVoice;
                }
                window.speechSynthesis.speak(speech);
                setSpeechSynthesisInstance(speech);  // Store the speech synthesis instance
    
            } catch (error) {
                console.error('Error sending audio message:', error);
            } finally {
                setLoading(false);
            }
        }
    };
    

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevents a new line from being added
            sendMessage();
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };
    const stopTextToSpeech = () => {
        if (speechSynthesisInstance) {
            window.speechSynthesis.cancel();
            setSpeechSynthesisInstance(null);  // Clear the instance
        }
    };
    
    return (
        <div className="col-12 chat-container">
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role}`}>
                        <Card className="message-card">
                            <div className="message-content">
                                {msg.role === 'RadAssistant' && (
                                    <AiOutlineCopy
                                        className="copy-icon"
                                        onClick={() => copyToClipboard(msg.content)}
                                        title="Copy to clipboard"
                                    />
                                )}
                                <strong>{msg.role === 'user' ? 'You' : 'RadAssistant'}:</strong> {msg.content}
                            </div>
                        </Card>
                    </div>
                ))}
                {loading && (
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                        <p>Waiting for response...</p>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
    
            <div className="chat-footer">
                <input
                    type="file"
                    id="file-upload"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    disabled={loading} // Disable when loading
                />
                <Button
                    icon={<AiOutlinePaperClip />}
                    className="attachment-button"
                    tooltip="Attach a file"
                    tooltipOptions={{ position: 'top' }}
                    onClick={() => document.getElementById('file-upload').click()}
                    disabled={loading} // Disable when loading
                />
    
                <InputTextarea
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Message RadAssistant"
                    className="message-input"
                    autoResize={false}
                    rows={1}
                    disabled={loading} // Disable when loading
                />
    
                <Button
                    icon={<FaHeadphones />}
                    className="p-button"
                    onClick={handleHeadphoneClick}
                    tooltip={isRecording ? "Stop Recording" : "Start Recording"}
                    tooltipOptions={{ position: 'top' }}
                />
    
                {audioURL && (
                    <Button
                        label="Play Response"
                        className="p-button"
                        onClick={playAudio}
                    />
                )}
    
                <Button
                    icon={<FiSend />}
                    className="send-button"
                    onClick={sendMessage}
                    disabled={loading || (!userInput.trim() && !selectedFile && !audioBlob)} // Disable when loading or all inputs are empty
                />
    
                <Button
                    label="Stop TTS"
                    className="p-button p-button-danger"
                    onClick={stopTextToSpeech}
                    disabled={!speechSynthesisInstance} // Disable if no TTS is playing
                />
            </div>
        </div>
    );
    
};

export default Chat;
