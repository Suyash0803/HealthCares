import React from 'react';
import { Loader2 } from 'lucide-react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="spinner-container">
      <Loader2 className="spinner-icon" />
      <p className="spinner-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
