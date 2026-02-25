import React, { useState, useRef } from 'react';
import './MediaConverter.css';

function MediaConverter({ networkMode }) {
  const [files, setFiles] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [downloadingYT, setDownloadingYT] = useState(false);
  const [converting, setConverting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => ({
      id: Math.random(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      status: 'pending',
      outputFormat: 'MP3',
      progress: 0,
      source: 'upload'
    }));
    setFiles([...files, ...newFiles]);
  };

  const handleYoutubeDownload = async () => {
    if (!youtubeUrl.trim()) return;
    
    setDownloadingYT(true);
    
    // Simulate YT download
    setTimeout(() => {
      const videoTitle = youtubeUrl.includes('?v=') 
        ? youtubeUrl.split('?v=')[1].substring(0, 11)
        : 'youtube-video';
      
      const newFile = {
        id: Math.random(),
        name: `${videoTitle}-video.mp4`,
        size: (Math.random() * 500).toFixed(2),
        status: 'pending',
        outputFormat: 'MP3',
        progress: 0,
        source: 'youtube'
      };
      
      setFiles([...files, newFile]);
      setYoutubeUrl('');
      setDownloadingYT(false);
    }, 2000);
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
      progress: 0,
      source: 'upload'
    }));
    setFiles([...files, ...newFiles]);
  };

  const handleConvert = async (fileId) => {
    setConverting(true);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
        
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
    alert(`📥 Download: ${newFileName}\n\n📁 Saved to: /opt/data/music/\n\nReady for DJ Mixer!`);
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
        <h2>🎬 Media Converter (MP4 to MP3 & YouTube Downloader)</h2>
        <p>Convert video to audio + stream from YouTube</p>
        <span className="network-mode">Mode: {networkMode === 'local' ? '📡 Local' : '🌐 WiFi'}</span>
      </div>

      {/* YouTube Section */}
      <div className="youtube-section">
        <h3>📺 YouTube to MP4</h3>
        <div className="youtube-input-group">
          <input
            type="text"
            placeholder="Paste YouTube URL here (e.g., https://youtube.com/watch?v=...)"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleYoutubeDownload()}
            disabled={downloadingYT}
          />
          <button
            className="youtube-btn"
            onClick={handleYoutubeDownload}
            disabled={downloadingYT || !youtubeUrl.trim()}
          >
            {downloadingYT ? '⏳ Downloading...' : '🔽 Download MP4'}
          </button>
        </div>
        <p className="youtube-hint">✨ Downloads to /opt/data/downloads/ (auto-converts to MP3 after)</p>
      </div>

      {/* Upload Area */}
      <div className="upload-area" onDragOver={handleDragOver} onDrop={handleDrop}>
        <div className="upload-content">
          <span className="upload-icon">📁</span>
          <h3>Drag & Drop Files Here</h3>
          <p>or click to select MP4/MOV/AVI files</p>
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
            <h3>📋 Conversion Queue</h3>
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
                    <span className="file-icon">{file.source === 'youtube' ? '📺' : '🎬'}</span>
                    <div className="file-details">
                      <p className="file-name">{file.name}</p>
                      <p className="file-size">{file.size} MB {file.source === 'youtube' ? '(YouTube)' : '(Upload)'}</p>
                    </div>
                  </div>
                  
                  <div className="file-controls">
                    <select
                      className="format-select"
                      value={file.outputFormat}
                      onChange={(e) => handleFormatChange(file.id, e.target.value)}
                      disabled={file.status === 'converting' || file.status === 'completed'}
                    >
                      <option value="MP3">MP3 (Best for music)</option>
                      <option value="AAC">AAC (iTunes)</option>
                      <option value="WAV">WAV (Lossless)</option>
                      <option value="FLAC">FLAC (Studio quality)</option>
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
                    <div className="progress-fill" style={{ width: `${file.progress}%` }} />
                    <span className="progress-text">{file.progress}%</span>
                  </div>
                )}

                <div className="file-actions">
                  {file.status === 'pending' && (
                    <button className="action-btn convert" onClick={() => handleConvert(file.id)}>
                      🔄 Convert
                    </button>
                  )}
                  {file.status === 'completed' && (
                    <button
                      className="action-btn download"
                      onClick={() => handleDownload(file.name, file.outputFormat)}
                    >
                      📥 Add to Music
                    </button>
                  )}
                  <button className="action-btn delete" onClick={() => handleRemoveFile(file.id)}>
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Structure Info */}
      <div className="file-structure">
        <h3>📁 File Organization</h3>
        <div className="structure-grid">
          <div className="struct-box">
            <h4>📥 Downloads</h4>
            <code>/opt/data/downloads/</code>
            <p>YouTube MP4 files (temp)</p>
          </div>
          <div className="struct-box">
            <h4>🎵 Music Library</h4>
            <code>/opt/data/music/</code>
            <p>Converted MP3s (auto-added to DJ)</p>
          </div>
          <div className="struct-box">
            <h4>💾 Archive</h4>
            <code>/opt/data/archive/</code>
            <p>Original files backup</p>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="use-cases">
        <h3>🚐 Perfect For Charlie's Van Life</h3>
        <ul>
          <li>📺 Download YouTube travel vlogs → Convert to MP3 for offline listening</li>
          <li>🎵 Create music library from travel videos</li>
          <li>🎧 Build DJ Mixer playlist from YouTube music videos</li>
          <li>📚 Extract podcasts from video content</li>
          <li>👨‍👩‍👧‍🦺 Download kids/grandkids videos for entertainment</li>
          <li>💾 Save adventure content offline for low-battery situations</li>
        </ul>
      </div>
    </div>
  );
}

export default MediaConverter;
