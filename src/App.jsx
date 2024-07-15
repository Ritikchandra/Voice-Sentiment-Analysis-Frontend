import React, { useState } from 'react';
import axios from 'axios';
import "./App.css"
const App = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [transcription, setTranscription] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [error, setError] = useState('');
  const [score, setScore] = useState('')
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/transcribe_and_analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response)
      const { file_name, text_infile, sentiment_infile, error } = response.data;
      if (error) {
        setError(error);
      } else {
        setFileName(file_name);
        setTranscription(text_infile);
        setSentiment(sentiment_infile[0]?.label);
        setScore(sentiment_infile[0]?.score)
      }
    } catch (error) {
      setError('Error uploading file. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="App">
      <section class="sticky">
  <div class="bubbles">
      <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    
  </div>
</section>
      <div className="heading">
      <h1>Speech Transcription & Sentiment Analysis</h1>
      </div>
      <div className="btnWrapper">
      <input type="file" onChange={handleFileChange} accept=".wav" id='kuchBhi'/>
      <button onClick={handleUpload} className='btn'>Upload File</button>

      {error && <p style={{ color: 'red', position : 'absolute' }}>{error}</p>}
      </div>
      <div className="responseWrapper">
        {!fileName && <p className='placeholder'>Upload A File For Transcription</p>}
      {fileName && (
        <div>
          <h2>File Name: {fileName}</h2>
          <div className="transcription">
          <span className='textLabel'>Transcription:</span>
          <span className='textResponse'>{transcription}</span></div>
          <div className="sentiment">
          <span className='sentimentLabel'>Sentiment Analysis:</span>
          <span className='sentimentResponse'>{sentiment}</span></div>
          <div className="score">
          <span className='scoreLabel'>Score:</span>
          <span className='scoreResponse'>{score}</span></div>
        </div>
      )}
      </div>
    </div>
  );
};

export default App;
