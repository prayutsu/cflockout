import React from "react";
import Spinner from "./Spinner";

const LoadingProblems = () => {
  return (
    <div class="h-full w-full flex flex-wrap justify-center items-center">
      <div class="mt-8 transition-all duration-200 ease-in p-5 rounded-full flex space-x-3">
        <Spinner />
      </div>
      <p className="mt-4 text-lg font-semibold w-full text-gray-800 text-center">
        Fetching problems, it may take a few seconds...
      </p>
    </div>
  );
};

export default LoadingProblems;
