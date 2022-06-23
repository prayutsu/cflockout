import { useState, useEffect, useContext } from "react";
import {
  MAX_NUMBER_OF_PROBLEMS,
  MIN_DURATION,
  MAX_DURATION,
  MIN_PROBLEM_RATING,
  MAX_PROBLEM_RATING,
} from "../config/constants";
import {
  resetSuccessIndicators,
  createContest,
} from "../features/contest/contestSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { changeIndex } from "../features/nav/navSlice";
import { ReactComponent as Codethinking } from "../components/assets/code-thinking.svg";
import { toast } from "react-toastify";
import { reset } from "../features/contest/liveContestSlice";
import { SocketContext } from "../context/socket";
import PleaseLoginToView from "../components/PleaseLoginToView";

const CreateContest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  const defaultProblem = {
    name: "Default Problem",
    problemLink: "Problem Link",
    problemId: "0",
    points: 50,
    rating: 1500,
  };

  const { user } = useSelector((state) => state.auth);
  const [contestProblems, setContestProblems] = useState([defaultProblem]);
  const [duration, setDuration] = useState(100);

  const { ongoingContest, isError, isSuccess, isLoading, message } =
    useSelector((state) => state.contest);

  useEffect(() => {
    dispatch(changeIndex(2));
  }, []); // eslint-disable-line

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetSuccessIndicators());
    }

    // Restrict opening this page if a contest is already running.
    if (isSuccess) {
      const contestId = ongoingContest._id;
      const resetState = new Promise((resolve, _) => {
        dispatch(resetSuccessIndicators());
        socket.emit("joinRoom", contestId);
        resolve(contestId);
      });
      resetState.then((id) => {
        navigate(`/contests/live?contestId=${id}`, {
          replace: true,
        });
      });
    }
  }, [isError, ongoingContest, socket, isSuccess, message, navigate, dispatch]);

  const onChangeProblem = (index) => (e) => {
    let updatedProblems = [...contestProblems];
    updatedProblems[index][e.target.name] = e.target.value;
    setContestProblems(updatedProblems);
  };

  const onChangeDuration = (e) => {
    setDuration(e.target.value);
  };

  const handleAddProblem = () => {
    if (contestProblems.length >= MAX_NUMBER_OF_PROBLEMS) {
      toast.error(
        `Maximum number of problems allowed is ${MAX_NUMBER_OF_PROBLEMS}`
      );
      return;
    }
    setContestProblems((previousState) => [
      ...previousState,
      {
        problemId: contestProblems.length.toString(),
        points: 50,
        rating: 1500,
        name: "Default Problem",
        problemLink: "Problem Link",
      },
    ]);
  };

  const handleRemoveProblem = (removedProblemIndex) => {
    if (contestProblems.length === 1) {
      toast.error("Minimum number of problems allowed is 1.");
      return;
    }
    let newProblems = contestProblems.filter(
      (_, index) => index !== removedProblemIndex
    );
    setContestProblems(newProblems);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (document.getElementById("contest-form").reportValidity()) {
      dispatch(reset());
      dispatch(
        createContest({
          duration,
          problems: contestProblems,
        })
      );
    }
    event.target.blur();
  };

  if (!user) {
    return <PleaseLoginToView />;
  }

  return (
    <div className="w-screen h-full lg:grid lg:grid-cols-3 lg:gap-6 p-6 lg:px-24 lg:py-16">
      <div className="lg:col-span-1">
        <div className="px-4 sm:px-0 lg:py-4">
          <h3 className="text-3xl font-bold leading-6 text-center text-gray-900">
            Create Contest
          </h3>
          <h4 className="mt-8 text-center text-xl font-semibold text-cyan-700">
            How long do you want to compete?
          </h4>
          <p className="mt-2 text-lg text-center text-gray-500">
            Enter the duration of the contest in minutes.
          </p>
          <h4 className="mt-8 text-xl text-center font-semibold text-cyan-700">
            What problems do you want to solve?
          </h4>
          <p className="my-2 text-lg text-center text-gray-500">
            Choose different ratings and the points for problems.
          </p>
        </div>
      </div>
      <div className="mt-5 lg:mt-0 lg:block px-2 w-full">
        <div className="max-w-[400px] mx-auto">
          <form id="contest-form">
            <div className="shadow-lg overflow-hidden rounded-md">
              <div className="px-6 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-1 gap-y-4">
                  <div className="col-span-1">
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Duration
                    </label>
                    <input
                      type="number"
                      name="duration"
                      id="duration"
                      onChange={onChangeDuration}
                      value={duration}
                      required
                      max={MAX_DURATION}
                      min={MIN_DURATION}
                      autoComplete="duration"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                    />
                  </div>

                  {contestProblems.map((problem, index) => (
                    <div key={index} className="col-span-1">
                      <div className="grid grid-cols-10 gap-4">
                        <div className="col-span-4">
                          <label
                            htmlFor="rating"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Rating
                          </label>
                          <input
                            type="number"
                            name="rating"
                            id="rating"
                            step={100}
                            min={MIN_PROBLEM_RATING}
                            max={MAX_PROBLEM_RATING}
                            required
                            onChange={onChangeProblem(index)}
                            value={problem.rating}
                            autoComplete="rating"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                          />
                        </div>
                        <div className="col-span-4">
                          <label
                            htmlFor="points"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Points
                          </label>
                          <input
                            type="number"
                            name="points"
                            id="points"
                            min={1}
                            required
                            max={100}
                            autoComplete="points"
                            value={problem.points}
                            onChange={onChangeProblem(index)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                          />
                        </div>
                        <div className="col-span-2 items-center cursor-pointer flex justify-center rounded-full">
                          <XCircleIcon
                            onClick={() => handleRemoveProblem(index)}
                            className="max-h-6 max-w-6 hover:scale-105 hover:shadow-lg rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    className="col-span-1
                  items-center cursor-pointer flex justify-center"
                  >
                    <PlusCircleIcon
                      onClick={handleAddProblem}
                      className="h-6 w-6 hover:scale-105 hover:shadow-lg rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 text-center sm:px-6">
                <button
                  onClick={handleSubmit}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 ${
                    isLoading ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  disabled={isLoading}
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="mt-5 p-2 flex lg:mt-0 lg:col-span-1  justify-center">
        <Codethinking className="max-w-md" />
      </div>
    </div>
  );
};

export default CreateContest;
