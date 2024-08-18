import React, { useState, useEffect, useRef } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { FiSend } from 'react-icons/fi';
import { AiOutlinePaperClip, AiOutlineCopy } from 'react-icons/ai';
import { FaMicrophone } from 'react-icons/fa';
import axios from 'axios';
import "./chat.css";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeechSupported, setIsSpeechSupported] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');
    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check if the browser supports the Web Speech API
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setIsSpeechSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;  // Set continuous listening
            recognitionRef.current.interimResults = false;  // Use only final results
            recognitionRef.current.lang = selectedLanguage;

            recognitionRef.current.onresult = (event) => {
                const finalTranscript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                setUserInput(finalTranscript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event);
            };
        }
    }, [selectedLanguage]);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
        setIsRecording(!isRecording);
    };

    // Automatically scroll to the bottom when messages change
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (userInput.trim()) {
            const newMessages = [...messages, { role: 'user', content: userInput }];
            setMessages(newMessages);
            setUserInput('');
            setLoading(true); // Show loading indicator

            try {
                const response = await axios.post('https://chat.deepmd.io/chat', {
                    user_input: userInput,
                    history: newMessages.map(msg => [msg.role, msg.content]),
                    temperature: 0.6,
                    top_p: 0.9,
                    max_gen_len: 512
                });

                // Update messages with the response from RadAssistant
                setMessages(response.data.history.map(([role, content]) => ({ role, content })));
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setLoading(false); // Hide loading indicator
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

    const uploadFile = async () => {
        if (selectedFile) {
            setLoading(true); // Show loading indicator

            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await axios.post('https://chat.deepmd.io/extract-text', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Add extracted text to messages
                const extractedText = response.data.extracted_text;
                const newMessages = [...messages, { role: 'user', content: `Uploaded file: ${selectedFile.name}` }, { role: 'RadAssistant', content: extractedText }];
                setMessages(newMessages);
                setSelectedFile(null);
            } catch (error) {
                console.error('Error uploading file:', error);
            } finally {
                setLoading(false); // Hide loading indicator
            }
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div className="col-12 chat-container">
            {/* Displaying chat messages */}
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
                <Button
                    label="Upload"
                    className="p-button-info"
                    onClick={uploadFile}
                    disabled={!selectedFile || loading} // Disable when no file selected or loading
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
                {isSpeechSupported && (
                    <Button
                        icon={<FaMicrophone color={isRecording ? 'red' : 'black'} />}
                        className="p-button"
                        onClick={toggleRecording}
                        tooltip={isRecording ? "Stop Recording" : "Start Recording"}
                        tooltipOptions={{ position: 'top' }}
                    />
                )}
                <Button
                    icon={<FiSend />}
                    className="send-button"
                    onClick={sendMessage}
                    disabled={loading || !userInput.trim()} // Disable when loading or input is empty
                />
            </div>
        </div>
    );
};

export default Chat;
