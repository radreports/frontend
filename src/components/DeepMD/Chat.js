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
    const [audioBlob, setAudioBlob] = useState(null);
    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    // Function to detect browser type
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

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

                    mediaRecorder.onstop = () => {
                        stream.getTracks().forEach(track => track.stop());
                    };
                })
                .catch(err => {
                    console.error('Error accessing microphone', err);
                });
        }
    };

    const toggleRecording = () => {
        // Initialize speech recognition and audio recording only when the button is clicked
        if (!recognitionRef.current && isChrome) {
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
                if (event.error === 'no-speech') {
                    startRecordingAudio();
                }
            };
        }

        if (isRecording) {
            recognitionRef.current && recognitionRef.current.stop();
            mediaRecorderRef.current && mediaRecorderRef.current.stop();
        } else {
            recognitionRef.current && recognitionRef.current.start();
            !isChrome && startRecordingAudio(); // For non-Chrome browsers, start recording audio
        }

        setIsRecording(!isRecording);
    };

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (selectedFile) {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await axios.post('https://chat.deepmd.io/extract-text', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const extractedText = response.data.extracted_text;
                const newMessages = [...messages, { role: 'user', content: `Uploaded file: ${selectedFile.name}` }, { role: 'RadAssistant', content: extractedText }];
                setMessages(newMessages);
                setSelectedFile(null);
            } catch (error) {
                console.error('Error uploading file:', error);
            } finally {
                setLoading(false);
            }
        } else if (userInput.trim()) {
            const newMessages = [...messages, { role: 'user', content: userInput }];
            setMessages(newMessages);
            setUserInput('');
            setLoading(true);

            try {
                const response = await axios.post('https://chat.deepmd.io/chat', {
                    user_input: userInput,
                    history: newMessages.map(msg => [msg.role, msg.content]),
                    temperature: 0.6,
                    top_p: 0.9,
                    max_gen_len: 512
                });

                setMessages(response.data.history.map(([role, content]) => ({ role, content })));
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setLoading(false);
            }
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
                console.log("response", response.data.extracted_text);
                const extractedText = response.data.extracted_text;

            // Update the chat messages with the extracted text
            const newMessages = [
                ...messages, 
                { role: 'user', content: 'Sent an audio message' },
                { role: 'RadAssistant', content: extractedText }
            ];
            setMessages(newMessages);
            setAudioBlob(null); // 
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
                    icon={<FaMicrophone color={isRecording ? 'red' : 'black'} />}
                    className="p-button"
                    onClick={toggleRecording}
                    tooltip={isRecording ? "Stop Recording" : "Start Recording"}
                    tooltipOptions={{ position: 'top' }}
                />
                <Button
                    icon={<FiSend />}
                    className="send-button"
                    onClick={sendMessage}
                    disabled={loading || (!userInput.trim() && !selectedFile && !audioBlob)} // Disable when loading or all inputs are empty
                />
            </div>
        </div>
    );
};

export default Chat;
