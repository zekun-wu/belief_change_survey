import React from 'react';
import './EndPage.css';

function EndPage() {
  const handleClose = () => {
    window.close();
    // Fallback if window.close() doesn't work
    if (!window.closed) {
      window.location.href = 'about:blank';
    }
  };

  return (
    <div className="end-page">
      <div className="end-content">
        <h1>Thank You for Your Participation!</h1>
        <div className="message">
          <p>Your responses have been successfully recorded.</p>
          <p>Your contribution to this research on AI-assisted fact-checking and trust assessment is greatly appreciated.</p>
          <p>You may now close this window safely.</p>
        </div>
        <button onClick={handleClose} className="close-button">
          Close Window
        </button>
      </div>
    </div>
  );
}

export default EndPage; 