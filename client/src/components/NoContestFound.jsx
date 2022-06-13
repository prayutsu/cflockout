import React from "react";
import { ReactComponent as NoContest } from "./assets/no-contest-found.svg";

const NoContestFound = () => {
  return (
    <div className="w-full p-4 md:p-12 ">
      <div className="container flex flex-col lg:flex-row items-center gap-12 mt-14 lg:mt-28">
        {/* Image */}
        <div className="flex-1 flex justify-center items-center mb-10 md:mb-16 lg:mb-0 z-10">
          <NoContest className="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full max-w-md" />
        </div>
        {/* Content */}
        <div className="flex flex-1 flex-col items-center">
          <h1 className="text-2xl text-center font-semibold tracking-wide">
            You don't have any ongoing Contests
          </h1>
        </div>
      </div>
    </div>
  );
};

export default NoContestFound;