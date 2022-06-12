import React, { useState } from "react";
import Timer from "../components/Timer";

import { useEffect, useContext } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import codeforcesService from "../data/codeforcesService";
import {
  getLiveContest,
  leaveContest,
  solveProblem,
  reset,
} from "../features/contest/liveContestSlice";
import { useSearchParams } from "react-router-dom";
import { SocketContext } from "../context/socket";
import { RefreshIcon } from "@heroicons/react/outline";
import { getUnsolvedProblemsWithRating } from "../data/problemsParser";
import { startContest } from "../features/contest/liveContestSlice";
import { changeIndex } from "../features/nav/navSlice";
import CopyButton from "../components/CopyButton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBar from "react-top-loading-bar";

const LiveContest = ({ liveContestState, userState }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("contestId");
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  // const [liveContest, setLiveContest] = useState(null);

  const { liveContest, loadingContestFinished, isError, messgae, isSuccess } =
    liveContestState;

  const {user} = userState; 



  const [progress, setProgress] = useState(70);

  // const { liveContest, loadingContestFinished, isError, message } = useSelector(
  //   (state) => state.liveContestState
  // );

  // console.log(liveContest, loadingContestFinished, isError, message);
  // console.log(loadingContestFinished)

  // const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(changeIndex(4));
    dispatch(getLiveContest());
    console.log(liveContest);
  }, []); // eslint-disable-line

  // useEffect(() => {
  //   dispatch(changeIndex(4));
  //   socket.on("contestUpdated", (roomId) => {
  //     console.log("contestUpdated was emitted!", roomId);
  //     dispatch(getLiveContest());
  //   });
  //   return () => {
  //     socket.off("contestUpdated");
  //   };
  // }, []); // eslint-disable-line

  // useEffect(() => {
  //   if (isError) {
  //     console.log("Here in isError", message);
  //     toast.error(message);
  //   }
  //   // dispatch(getLiveContest());
  // }, [isError, message]);

  // useEffect(() => {
  //   socket.emit("joinRoom", roomId);

  //   return () => {
  //     socket.emit("leaveRoom", roomId);
  //   };
  // }, []); // eslint-disable-line

  // useEffect(() => {
  //   if (update) {
  //     console.log(`The update number is ${update}`);
  //     socket.emit("updateContest", roomId);
  //   }
  // }, [socket, update, roomId]);

  const updateRankList = async () => {
    // Fetch last 100 submissions for each user.
    // Determine if any user solved the problem.
    // dispatch(getLiveContest());
    const unsolvedProblems = [];
    const handles = [];
    if (liveContest) {
      for (const contestant of liveContest.contestants) {
        handles.push(contestant.username);
      }
      for (const problem of liveContest.problems) {
        if (!problem.isSolved) {
          unsolvedProblems.push(problem.name);
        }
      }

      const winners = await codeforcesService.findWinnerForEachProblem(
        handles,
        unsolvedProblems
      );
      for (const [problem, winner] of Object.entries(winners)) {
        dispatch(
          solveProblem({
            contestId: liveContest._id,
            timeStamp: winner.timeStamp,
            problemName: problem,
            username: winner.handle,
          })
        );
      }
    }
  };

  const handleLeaveContest = async () => {
    const contestId = liveContest._id;
    // console.log("In leave", contestId);
    const resetState = new Promise((resolve, _) => {
      dispatch(leaveContest(contestId));
      resolve();
    });
    resetState
      .then(() => {
        navigate("/", {
          replace: true,
        });
      })
      .catch((err) => {
        toast.error(err.message);
        // dispatch(reset());
      });
  };

  const handleStartContest = async () => {
    // setLoading(true);
    const handles = [];
    const requirements = {};
    for (const contestant of liveContest.contestants) {
      handles.push(contestant.username);
    }
    for (const problem of liveContest.problems) {
      requirements[problem.rating] = requirements[problem.rating] || 0;
      requirements[problem.rating]++;
    }
    const cfProblems = await getUnsolvedProblemsWithRating(
      handles,
      requirements
    );

    if (cfProblems.sucess) {
      let problems = [];
      for (let problem of liveContest.problems) {
        const cfProblem = cfProblems.problems[problem.rating].pop();
        const newProblem = {
          ...problem,
          name: cfProblem.name,
          problemLink: `https://codeforces.com/problemset/problem/${cfProblem.contestId}/${cfProblem.index}`,
        };
        problems.push(newProblem);
      }
      dispatch(
        startContest({
          id: liveContest._id,
          problems: problems,
        })
      );
    } else {
      toast.error(
        "Not enough problems available to start contest, try changing the ratings."
      );
    }
    // setLoading(false);
  };

  const getRemainingTime = () => {
    const date = new Date(liveContest.startedAt);
    return date.getTime() + liveContest.duration * 60 * 1000;
  };

  if (!user) {
    return (
      <div>
        <h1>You need to login to participate in a contest</h1>
      </div>
    );
  }

  return loading ? (
    <LoadingBar progress={progress} onLoaderFinished={() => setProgress(0)} />
  ) : liveContest === null ? (
    <div>No ongoing contests found!!</div>
  ) : (
    <div className="h-full pt-10 w-full max-w-[1240px] p-4 md:p-12 lg:px-16">
      {/* Timer and contest id */}
      <div className="md:flex md:justify-between md:items-center w-full">
        {/* <Suspense fallback={<Spinner/>}> */}
        <Timer
          duration={liveContest.duration}
          isStarted={liveContest.isStarted}
          countDownTimestampInMs={getRemainingTime()}
        />
        {/* </Suspense> */}
        <div className="bg-slate-100 rounded-xl shadow-lg p-4 my-4">
          <div className="flex justify-between">
            <h1 className="text-cyan-800 text-m font-mono">Contest ID</h1>
            <div className="h-6 w-6 shadow-lg p-[2px] hover:scale-105 ease-in duration-75 cursor-pointer bg-gray-200 rounded-md border border-slate-800">
              <CopyButton />
            </div>
          </div>
          <h3
            id="livecontest-id"
            className="text-gray-800 text-s tracking-wider mt-1"
          >
            {liveContest._id}
          </h3>
        </div>
      </div>

      {/* Problems table */}
      <div className="grid grid-cols-7 my-8 gap-8">
        {liveContest.isStarted ? (
          <div className="col-span-7 md:col-span-4 shadow-md rounded-lg">
            <div className="text-center p-4 w-full">
              <h2 className="text-xl text-gray-800 font-semibold">Problems</h2>
            </div>
            <div className="bg-cyan-800 py-2 w-full grid grid-cols-4 gap-2">
              <div className="text-center col-span-2 p-2">
                <h3 className=" text-white font-semibold">Problem Link</h3>
              </div>
              <div className="text-center col-span-1 p-2">
                <h3 className="text-white font-semibold">Rating</h3>
              </div>
              <div className="text-center text-whitecol-span-1 p-2">
                <h3 className="text-white font-semibold">Points</h3>
              </div>
            </div>
            {liveContest.problems.map((problem, index) => (
              <div
                key={index}
                className="bg-white-200 py-2 w-full grid grid-cols-4 gap-2"
              >
                <div className="text-center col-span-2 p-2">
                  <h3 className="text-gray-800 font-semibold">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={problem.problemLink}
                    >
                      {problem.name}
                    </a>
                  </h3>
                </div>
                <div className="text-center col-span-1 p-2">
                  <h3 className="text-gray-800 font-semibold">
                    {problem.rating}
                  </h3>
                </div>
                <div className="text-center col-span-1 p-2">
                  <h3 className="text-gray-800 font-semibold">
                    {problem.points}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-7 md:col-span-4 shadow-md rounded-lg flex align-center justify-center">
            <div className="p-4 flex align-center justify-center">
              <h2 className="text-center text-2xl font-bold track-widest text-cyan-800">
                Problems will be displayed after the contest is started!
              </h2>
            </div>
          </div>
        )}

        {/* Ranklist */}
        <div className="col-span-7 md:col-span-3 shadow-md rounded-lg">
          <div className="flex justify-center items-center p-4 w-full">
            <div className="relative mr-2">
              <h2 className="text-xl font-semibold mt-0 md-0">Ranklist</h2>
            </div>
            <div
              className="relative ml-2 h-7 w-7 p-1 hover:scale-105 bg-gray-100 shadow-md rounded-2xl cursor-pointer"
              onClick={updateRankList}
            >
              <RefreshIcon className="text-gray-600 hover:text-gray-900" />
            </div>
          </div>
          <div className="bg-cyan-800 py-2 w-full grid grid-cols-4 gap-2">
            <div className="text-center col-span-1 p-2">
              <h3 className="text-white font-semibold">Rank</h3>
            </div>
            <div className="text-center col-span-2 p-2">
              <h3 className="text-white font-semibold">Contestant</h3>
            </div>
            <div className="text-center col-span-1 p-2">
              <h3 className="text-white font-semibold">Points</h3>
            </div>
          </div>

          {liveContest.contestants.map((contestant, index) => (
            <div
              key={index}
              className="bg-white-200 py-2 w-full grid grid-cols-4 gap-2"
            >
              <div className="text-center col-span-1 p-2">
                <h3 className="text-gray-800 font-semibold">
                  {contestant.rank}
                </h3>
              </div>
              <div className="text-center col-span-2 p-2">
                <h3 className="text-gray-800 font-semibold">
                  {contestant.username}
                </h3>
              </div>
              <div className="text-center col-span-1 p-2">
                <h3 className="text-gray-800 font-semibold">
                  {contestant.points}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show start button etc */}
      <div className="w-full gap-8 flex items-center justify-center md:gap-12">
        <button
          onClick={handleStartContest}
          disabled={liveContest.isStarted}
          className={
            liveContest.isStarted
              ? "hidden"
              : user.id === liveContest.admin.id
              ? `inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 ${
                  !loadingContestFinished ? "cursor-not-allowed" : ""
                }`
              : "hidden"
          }
        >
          Start Contest
        </button>

        <button
          onClick={handleLeaveContest}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500" ${
            !loadingContestFinished ? "cursor-not-allowed" : ""
          }`}
          // disabled={loadingContestFinished}
        >
          Leave Contest
        </button>
      </div>
      {liveContest.isStarted ? (
        <div className="w-full my-8 md:my-12"></div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default LiveContest;

// function mapStateToProps(state) {
//   return {
//     liveContestState: state.liveContestState,
//     userState: state.auth,
//   };
// }

// export default connect(mapStateToProps)(LiveContest);
