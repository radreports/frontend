import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import Speech from 'react-speech';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
const Dictation = () => {
    const [dropdownItem, setDropdownItem] = useState(null);
    const dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();
      const startListening = () => SpeechRecognition.startListening({ continuous: true });
      if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
      }

    return (
        <div className="grid">
            {/* <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Vertical</h5>
                    <div className="field">
                        <label htmlFor="name1">Name</label>
                        <InputText id="name1" type="text" />
                    </div>
                    <div className="field">
                        <label htmlFor="email1">Email</label>
                        <InputText id="email1" type="text" />
                    </div>
                    <div className="field">
                        <label htmlFor="age1">Age</label>
                        <InputText id="age1" type="text" />
                    </div>
                </div>

                <div className="card p-fluid">
                    <h5>Vertical Grid</h5>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="name2">Name</label>
                            <InputText id="name2" type="text" />
                        </div>
                        <div className="field col">
                            <label htmlFor="email2">Email</label>
                            <InputText id="email2" type="text" />
                        </div>
                    </div>
                </div>
            </div> */}

<div>
      {/* <p>Microphone: {listening ? 'on' : 'off'}</p> */}
      <button onClick={startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      {/* <p>{transcript}</p> */}
    </div>

            <div className="col-12">
                <div className="card">
                    <h5>Advanced</h5>
                    <div className="p-fluid formgrid grid">
                        {/* <div className="field col-12 md:col-6">
                            <label htmlFor="firstname2">Firstname</label>
                            <InputText id="firstname2" type="text" />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="lastname2">Lastname</label>
                            <InputText id="lastname2" type="text" />
                        </div> */}
                        <div className="field col-12">
                            <label htmlFor="address">Address</label>
                            {/* <Speech text="Welcome to react speech" /> */}
                            <InputTextarea id="address" rows="1000" value={transcript}/>
                        </div>
                        {/* <div className="field col-12 md:col-6">
                            <label htmlFor="city">City</label>
                            <InputText id="city" type="text" />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="state">State</label>
                            <Dropdown id="state" value={dropdownItem} onChange={(e) => setDropdownItem(e.value)} options={dropdownItems} optionLabel="name" placeholder="Select One"></Dropdown>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="zip">Zip</label>
                            <InputText id="zip" type="text" />
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Dictation, comparisonFn);
