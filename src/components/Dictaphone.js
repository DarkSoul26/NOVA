import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import React from 'react';
const Dictaphone = (props) => {

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }


    return (
        <div>
            <h3>Mic : {listening ? <i style={{color:"red"}} class="fa-solid fa-microphone fa-1x"></i> : <i class="fa-solid fa-microphone-slash fa-1x"></i>}</h3> 
            <button id='b' className='btn btn-lg btn-dark' onClick={SpeechRecognition.startListening}>Start</button>
            <button id='b' className='btn btn-lg btn-dark' onClick={SpeechRecognition.stopListening}>Stop</button>
            <button id='b' className='btn btn-lg btn-dark' onClick={resetTranscript}>Reset</button>
            <button onClick={props.handleAddText(transcript)}></button>
            {/* <p>{transcript}</p> */}
        </div>
    );
};

export default Dictaphone;