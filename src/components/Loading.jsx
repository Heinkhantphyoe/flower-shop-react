import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-pink-50">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-pink-300 animate-ping"></div>
          <div className="relative w-16 h-16 flex items-center justify-center text-3xl">
            🌸
          </div>
        </div>
        <p className="mt-4 text-pink-600 text-lg font-medium animate-bounce">
          Loading.. Please wait
        </p>
      </div>
    </div>
  );
};

export default Loading;
