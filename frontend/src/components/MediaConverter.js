import React, { useState, useRef } from 'react';
import './MediaConverter.css';

function MediaConverter() {
  const [files, setFiles] = useState([]);
  const [converting, setConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  const fileInputRef = useRef(null);

  const supportedFormats = {
    input: ['MP4', 'MOV', 'AVI', 'MKV', 'WMV', 'WebM'],
    output: ['MP3', 'AAC', 'WAV', 'FLAC']
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => ({
      id: Math.random(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      status: 'pending',
      outputFormat: 'MP3',
      progress: 0
    }));
    setFiles([...files, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles = droppedFiles.map(file => ({
      id: Math.random(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      status: 'pending',
      outputFormat: 'MP3',
      progress: 0
    }));
    setFiles([...files, ...newFiles]);
  };

  const handleConvert = async (fileId) => {
    setConverting(true);
    
    // Simulate conversion progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
        
        // Mark as complete
        setFiles(prev => prev.map(f =>
          f.id === fileId ? { ...f, status: 'completed', progress: 100 } : f
        ));
        setConverting(false);
      }
      
      setFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, status: 'converting', progress: Math.floor(progress) } : f
      ));
    }, 300);
  };

  const handleConvertAll = () => {
    files.forEach(file => {
      if (file.status === 'pending') {
        handleConvert(file.id);
      }
    });
  };

  const handleRemoveFile = (fileId) => {
    setFiles(files.filter(f => f.id !== fileId));
  };

  const handleDownload = (fileName, outputFormat) => {
    const newFileName = fileName.split('.')[0] + '.' + outputFormat.toLowerCase();
    alert(`📥 Download: ${newFileName}\n\nIn production, this would download the converted file.`);
  };

  const handleFormatChange = (fileId, format) => {
    setFiles(prev => prev.map(f =>
      f.id === fileId ? { ...f, outputFormat: format } : f
    ));
  };

  const handleClearCompleted = () => {
    setFiles(files.filter(f => f.status !== 'completed'));
  };

  const completedCount = files.filter(f => f.status === 'completed').length;
  const pendingCount = files.filter(f => f.status === 'pending').length;

  return (
    <div className="media-converter">
      <div className="converter-header">
        <h2>🎬 Media Converter (MP4 to MP3 & More)</h2>
        <p>Convert video to audio formats easily</p>
      </div>

      {/* Upload Area */}
      <div
        className="upload-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <span className="upload-icon">📁</span>
          <h3>Drag & Drop Files Here</h3>
          <p>or click to select files</p>
          <p className="supported">
            Supported: {supportedFormats.input.join(', ')}
          </p>
          <button
            className="upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Files
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*,.mp4,.mov,.avi,.mkv,.wmv,.webm"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {/* Stats */}
      {files.length > 0 && (
        <div className="conversion-stats">
          <div className="stat">
            <span className="stat-number">{files.length}</span>
            <span className="stat-label">Total Files</span>
          </div>
          <div className="stat">
            <span className="stat-number">{pendingCount}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <div className="files-section">
          <div className="section-header">
            <h3>📋 Queue</h3>
            <div className="section-actions">
              {pendingCount > 0 && (
                <button className="action-btn convert-all" onClick={handleConvertAll}>
                  🚀 Convert All
                </button>
              )}
              {completedCount > 0 && (
                <button className="action-btn clear" onClick={handleClearCompleted}>
                  🗑 Clear Completed
                </button>
              )}
            </div>
          </div>

          <div className="files-list">
            {files.map((file) => (
              <div key={file.id} className={`file-item ${file.status}`}>
                <div className="file-header">
                  <div className="file-info">
                    <span className="file-icon">🎬</span>
                    <div className="file-details">
                      <p className="file-name">{file.name}</p>
                      <p className="file-size">{file.size} MB</p>
                    </div>
                  </div>
                  
                  <div className="file-controls">
                    <select
                      className="format-select"
                      value={file.outputFormat}
                      onChange={(e) => handleFormatChange(file.id, e.target.value)}
                      disabled={file.status === 'converting' || file.status === 'completed'}
                    >
                      {supportedFormats.output.map(fmt => (
                        <option key={fmt} value={fmt}>{fmt}</option>
                      ))}
                    </select>

                    <span className={`status-badge ${file.status}`}>
                      {file.status === 'pending' && '⏳ Pending'}
                      {file.status === 'converting' && '⏳ Converting'}
                      {file.status === 'completed' && '✅ Done'}
                    </span>
                  </div>
                </div>

                {file.status === 'converting' && (
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${file.progress}%` }}
                    />
                    <span className="progress-text">{file.progress}%</span>
                  </div>
                )}

                <div className="file-actions">
                  {file.status === 'pending' && (
                    <button
                      className="action-btn convert"
                      onClick={() => handleConvert(file.id)}
                    >
                      🔄 Convert
                    </button>
                  )}
                  {file.status === 'completed' && (
                    <button
                      className="action-btn download"
                      onClick={() => handleDownload(file.name, file.outputFormat)}
                    >
                      📥 Download
                    </button>
                  )}
                  <button
                    className="action-btn delete"
                    onClick={() => handleRemoveFile(file.id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info & Tips */}
      <div className="converter-info">
        <h3>💡 Conversion Tips</h3>
        <div className="tips-grid">
          <div className="tip">
            <h4>📹 Video Formats</h4>
            <p>MP4, MOV, AVI, MKV, WMV, WebM</p>
          </div>
          <div className="tip">
            <h4>🎵 Audio Formats</h4>
            <p>MP3, AAC, WAV, FLAC</p>
          </div>
          <div className="tip">
            <h4>⚡ Speed</h4>
            <p>Conversion speed depends on file size</p>
          </div>
          <div className="tip">
            <h4>💾 Quality</h4>
            <p>Original quality preserved in output</p>
          </div>
          <div className="tip">
            <h4>🎧 MP3 Best For</h4>
            <p>Universal compatibility, smaller file size</p>
          </div>
          <div className="tip">
            <h4>✨ WAV Best For</h4>
            <p>Lossless quality, larger file size</p>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="use-cases">
        <h3>🚐 Perfect For Charlie's Van Life</h3>
        <ul>
          <li>🎬 Convert travel videos to MP3 for offline listening</li>
          <li>🎵 Create podcasts from van vlog recordings</li>
          <li>📚 Extract audio from adventure videos</li>
          <li>🎧 Build music library for DJ Mixer</li>
          <li>👨‍👩‍👧‍🦺 Make content for grandkids entertainment</li>
          <li>📱 Compress files for mobile storage</li>
        </ul>
      </div>
    </div>
  );
}

export default MediaConverter;
