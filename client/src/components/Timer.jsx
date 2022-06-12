import React, { useState, useEffect } from "react";
import { getRemainingTimeUntilTimeStamp } from "./utils/TimerUtils";

const Timer = ({ countDownTimestampInMs, isStarted, duration }) => {
  const defaultRemainingTime = {
    minutes: isStarted ? 0 : duration,
    seconds: 0,
  };

  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

  useEffect(() => {
    if (isStarted) {
      const intervalId = setInterval(() => {
        setRemainingTime(
          getRemainingTimeUntilTimeStamp(countDownTimestampInMs)
        );
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [countDownTimestampInMs, isStarted]);

  return (
    <div>
      <h1 className="text-5xl text-gray-900 font-semibold tracking-normal mx-0">
        Time Remaining
      </h1>
      <h3 className="text-2xl mt-4 text-gray-600 mx-0">{`Minutes : ${remainingTime.minutes} Seconds : ${remainingTime.seconds}`}</h3>
    </div>
  );
};

export default Timer;
