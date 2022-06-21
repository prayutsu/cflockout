import { Suspense, useContext, useEffect, useState } from "react";
import LoadingBar from "../components/LoadingBar";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getLiveContest,
  leaveContest,
  resetError,
  solveProblem,
  startContest,
} from "../features/contest/liveContestSlice";
import { changeIndex, viewModal } from "../features/nav/navSlice";
import { toast } from "react-toastify";
import codeforcesService from "../data/codeforcesService";
import { useNavigate } from "react-router-dom";
import { getUnsolvedProblemsWithRating } from "../data/problemsParser";
import Timer from "../components/Timer";
import CopyButton from "../components/CopyButton";
import { RefreshIcon } from "@heroicons/react/outline";
import Spinner from "../components/Spinner";
import { SocketContext } from "../context/socket";
import NoContestFound from "../components/NoContestFound";
import PleaseLoginToView from "../components/PleaseLoginToView";
import LoadingProblems from "../components/LoadingProblems";
import Modal from "../components/Modal";

const LiveContest = ({ liveContestState, userState }) => {
  const [progress, setProgress] = useState(70);
  const [loading, setLoading] = useState(true);
  const [fetchingProblems, setFetchingProblems] = useState(false);
  const {isModalOpen} = useSelector(state => state.nav);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const { liveContest, loadingContestFinished, isError, message } =
    liveContestState;
  const { user } = userState;

  useEffect(() => {
    dispatch(changeIndex(4));
    socket.on("contestUpdated", (roomId) => {
      dispatch(getLiveContest());
      setProgress(90);
    });

    if (user) {
      dispatch(getLiveContest())
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (liveContest) {
      socket.emit("joinRoom", liveContest._id);
    }
  }, [liveContest, socket]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetError());
    }
  }, [isError, message, dispatch]);

  const leaveContestAction = () => {
    const contestId = liveContest._id;
    console.log("clicked action!");
    dispatch(leaveContest(contestId)).then(() => {
      socket.emit("leaveContest", contestId);
      navigate("/", { replace: true });
    });
  };

  const handleLeaveContest = async (event) => {
    event.preventDefault();
    dispatch(viewModal());
    event.target.blur();
  };

  const handleStartContest = async (event) => {
    event.preventDefault();
    setFetchingProblems(true);
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

    if (cfProblems.status === "OK") {
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
      ).then(() => {
        socket.emit("updateContest", liveContest._id);
        toast.success("Contest has been started !");
        // setLoading(false);
        setFetchingProblems(false);
      });
    } else {
      toast.error(
        cfProblems.error
          ? cfProblems.error
          : "Not enough problems available to start contest, try changing the ratings."
      );
      setFetchingProblems(false);
    }
    event.target.blur();
  };

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

      const res = await codeforcesService.findWinnerForEachProblem(
        handles,
        unsolvedProblems
      );
      if (res.status !== "OK") {
        toast.error(res.error);
        return;
      }
      const winners = res.winners;
      let updated = false;
      for (const [problem, winner] of Object.entries(winners)) {
        dispatch(
          solveProblem({
            contestId: liveContest._id,
            timeStamp: winner.timeStamp,
            problemName: problem,
            username: winner.handle,
          })
        );
        updated = true;
      }
      if (updated) {
        socket.emit("updateContest", liveContest._id);
      }
    }
  };

  const getRemainingTime = () => {
    const date = new Date(liveContest.startedAt);
    return date.getTime() + liveContest.duration * 60 * 1000;
  };

  if (!user) {
    return <PleaseLoginToView />;
  }

  if (loading) {
    return <LoadingBar progress={progress} />;
  }

  return fetchingProblems ? (
    <LoadingProblems />
  ) : liveContest ? (
    <div className="h-full pt-10 w-full max-w-[1240px] p-4 md:p-12 lg:px-16">
      {/* Leave Contest Modal */}
      {isModalOpen && (
        <Modal
          title="Leave Contest"
          message="Are you sure you want to leave the contest? This contest will not appear in the dashboard if you leave it in between."
          confirmAction={leaveContestAction}
        />
      )}

      {/* Timer and contest id */}
      <div className="md:flex md:justify-between md:items-center w-full">
        <Suspense fallback={<Spinner />}>
          <Timer
            duration={liveContest.duration}
            isStarted={liveContest.isStarted}
            countDownTimestampInMs={getRemainingTime()}
          />
        </Suspense>
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

      <h3 className="my-8 text-gray-700 tracking-wide font-semibold text-lg text-center w-full">
        After solving a problem, don't forget to press refresh button in the
        ranklist.
      </h3>

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
                  <h3 className="text-cyan-800 font-bold tracking-wider underline">
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
          disabled={liveContest.isStarted || user._id !== liveContest.admin}
          className={
            liveContest.isStarted
              ? "hidden"
              : user._id === liveContest.admin
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
  ) : (
    <NoContestFound />
  );
};

function mapStateToProps(state) {
  return {
    liveContestState: state.liveContestState,
    userState: state.auth,
  };
}

export default connect(mapStateToProps)(LiveContest);
