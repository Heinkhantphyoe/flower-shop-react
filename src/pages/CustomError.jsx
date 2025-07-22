import React from 'react';
import { AlertTriangle } from 'lucide-react'; // Optional icon for visual clarity

const CustomError = ({ errorCode, message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="flex items-center gap-3 text-red-600 mb-4">
        <AlertTriangle size={32} />
        <h1 className="text-5xl font-bold">{errorCode || 'Error'}</h1>
      </div>
      <p className="text-xl text-black">{message || 'Something went wrong.'}</p>
    </div>
  );
};

export default CustomError;
