import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import '../styles/ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-wrapper">
      <div className="error-box">
        <AlertCircle className="error-icon" />
        <h3 className="error-title">Something went wrong</h3>
        <p className="error-message">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            <RefreshCw className="retry-icon" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
