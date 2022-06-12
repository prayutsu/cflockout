import dayjs from "dayjs";

export const getRemainingTimeUntilTimeStamp = (timeStampInMs) => {
  const timeStampDayjs = dayjs(timeStampInMs);
  const nowDayjs = dayjs();
  if (timeStampDayjs.isBefore(nowDayjs)) {
    return { minutes: 0, seconds: 0 };
  }
  return {
    minutes: getRemainingMinutes(nowDayjs, timeStampDayjs),
    seconds: getRemainingSeconds(nowDayjs, timeStampDayjs),
  };
};

const getRemainingSeconds = (nowDayjs, timeStampDayjs) => {
  return timeStampDayjs.diff(nowDayjs, "seconds") % 60;
};

const getRemainingMinutes = (nowDayjs, timeStampDayjs) => {
  return timeStampDayjs.diff(nowDayjs, "minutes");
};
