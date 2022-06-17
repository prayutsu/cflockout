import React from "react";
import { ReactComponent as PleaseLogin } from "./assets/please-login.svg";

const PleaseLoginToView = () => {
  return (
    <div className="h-full w-full p-4 md:p-12 ">
      <div className="container flex flex-col lg:flex-row items-center gap-12 my-8 lg:my-16">
        {/* Image */}
        <div className="flex-1 flex justify-center items-center mb-10 md:mb-16 lg:mb-0 z-10">
          <PleaseLogin className="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full max-w-md" />
        </div>
        {/* Content */}
        <div className="flex flex-1 flex-col items-center">
          <h1 className="text-2xl text-center font-semibold tracking-wide">
            Please login to view this page
          </h1>
        </div>
      </div>
    </div>
  );
};

export default PleaseLoginToView;
