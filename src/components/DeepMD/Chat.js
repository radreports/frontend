import React, { useState, useEffect, useRef } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { FiSend } from 'react-icons/fi';
import { AiOutlinePaperClip, AiOutlineCopy } from 'react-icons/ai'; // Add copy icon
import axios from 'axios';
import "./chat.css";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Set a higher timeout for Axios requests
    axios.defaults.timeout = 10 * 60 * 1000; // 10 minutes

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
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        }).catch(err => {
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
                                <strong>{msg.role === 'user' ? 'You' : 'RadAssistant'}:</strong> {msg.content}
                                {msg.role === 'RadAssistant' && (
                                    <AiOutlineCopy
                                        className="copy-icon"
                                        onClick={() => copyToClipboard(msg.content)}
                                        title="Copy to clipboard"
                                    />
                                )}
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
