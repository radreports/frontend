import React, { useState, useEffect, useRef } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { FiSend } from 'react-icons/fi';
import { AiOutlinePaperClip, AiOutlineCopy } from 'react-icons/ai';
import { FaMicrophone, FaHeadphones } from 'react-icons/fa';
import axios from 'axios';
import "./chat.css";

const AudioChat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const recognitionRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    const handleHeadphoneClick = () => {
        if (!isRecording) {
            startRecordingAudio();
        } else {
            stopRecordingAudio();
        }
    };

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

    const stopRecordingAudio = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

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

    const playAudio = () => {
        const audio = new Audio(audioURL);
        audio.play();
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
                <InputTextarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    placeholder="Message RadAssistant"
                    className="message-input"
                    autoResize={false}
                    rows={1}
                    disabled={loading}
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
                    disabled={loading || (!userInput.trim() && !selectedFile && !audioBlob)}
                />
            </div>
        </div>
    );
};

export default AudioChat;
