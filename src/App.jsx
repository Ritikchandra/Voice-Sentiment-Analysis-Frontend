import React, { useState } from 'react';
import axios from 'axios';
import "./App.css";

const App = () => {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [csvLink, setCsvLink] = useState('');
  const [previewLink, setPreviewLink] = useState('');
  const [text, setText] = useState('Upload Files For Transcription')
  const [processed, setProcessed] = useState(false)
  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    setText('Uploading...')

    try {
      const response = await axios.post('http://localhost:5000/transcribe_and_analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data);
      setProcessed(true)
      const { results, error } = response.data;
      if (error) {
        setError(error);
      } else {
        setResults(results);
        setCsvLink(response.data.csv_link);
      }
    } catch (error) {
      setError('Error uploading files. Please try again.');
      console.error(error);
    }
  };
  const handleExtractCSV = () => {
    window.location.href = csvLink;
  }
  return (
    <div className="App">
      <section className="sticky">
        <div className="bubbles">
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
        </div>
      </section>
      <div className="heading">
        <h1>Speech Transcription & Sentiment Analysis</h1>
      </div>
      <div className="btnWrapper">
        <input type="file" onChange={handleFileChange} multiple id='kuchBhi' />
        <button onClick={handleUpload} className='btn'>Upload Files</button>
        {error && <p style={{ color: 'red', position: 'absolute' }}>{error}</p>}
      </div>
      <div className="responseWrapper1">
        {results.length === 0 && <p className='placeholder'>{text}</p>}</div>
        <div className="responses">
        {results.length > 0 && results.map((result, index) => (
      <div className="responseWrapper" key={index}>
          {/* <div> */}
            <h2>File Name: {result.file_name}</h2>
            <div className="transcription">
              <span className='textLabel'>Transcription:</span>
              <span className='textResponse'>{result.transcription}</span>
            </div>
            <div className="sentiment">
              <span className='sentimentLabel'>Sentiment Analysis:</span>
              <span className='sentimentResponse'>{result.sentiment.label}</span>
            </div>
            <div className="score">
              <span className='scoreLabel'>Score:</span>
              <span className='scoreResponse'>{result.sentiment.score}</span>
            </div>
          </div>
      // </div>
        ))}
        </div>
        <button className="downloadBtn btn" onClick={handleExtractCSV} disabled={!processed}>Extract CSV</button>
    </div>
  );
};

export default App;
