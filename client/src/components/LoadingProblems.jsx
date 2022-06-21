import React from "react";

const LoadingProblems = () => {
  return (
    <div class="h-full w-full flex flex-wrap justify-center items-center">
      <div class="mt-8 transition-all duration-200 ease-in p-5 rounded-full flex space-x-3" style={{animationDuration: "0.5s"}}>
        <div class="w-5 h-5 bg-cyan-600 rounded-full animate-bounce" style={{animationDelay:"0.1s"}}></div>
        <div class="w-5 h-5 bg-cyan-600 rounded-full animate-bounce" style={{animationDelay:"0.3s"}}></div>
        <div class="w-5 h-5 bg-cyan-600 rounded-full animate-bounce" style={{animationDelay:"0.5s"}}></div>
      </div>
      <p className="text-lg font-semibold w-full text-gray-800 text-center">Fetching problems, it may take a few seconds...</p>
    </div>
  );
};

export default LoadingProblems;
