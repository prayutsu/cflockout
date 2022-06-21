import React from "react";

const LoadingBar = ({ progress }) => {
  return (
    <div
      className="transition-all duration-300 ease-linear bg-cyan-600 rounded-md h-[2px] w-full fixed z-50 left-0 top-0"
      style={{
        width: `${progress}%`,
        transition: `margin-left ${300}ms ease`,
      }}
    ></div>
  );
};

export default LoadingBar;
