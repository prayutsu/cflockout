import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  joinContest,
  resetSuccessIndicators,
} from "../features/contest/contestSlice";
import { SocketContext } from "../context/socket";
import { changeIndex } from "../features/nav/navSlice";
import { toast } from "react-toastify";
import { UserGroupIcon } from "@heroicons/react/solid";
import { reset } from "../features/contest/liveContestSlice";
import PleaseLoginToView from "../components/PleaseLoginToView";

const JoinContest = () => {
  const [contestId, setContestId] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const { ongoingContest, isError, isSuccess, message, isLoading, update } =
    useSelector((state) => state.contest);
  const { user } = useSelector((state) => state.auth);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (document.getElementById("join-contest-form").reportValidity()) {
      dispatch(joinContest(contestId));
    }
    e.target.blur();
  };

  useEffect(() => {
    dispatch(changeIndex(3));
  }, []); // eslint-disable-line

  useEffect(() => {
    if (update && contestId) {
      socket.emit("updateContest", contestId);
    }
  }, [update, socket, contestId]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetSuccessIndicators());
    }
    if (isSuccess) {
      const id = ongoingContest._id;
      const resetState = new Promise((resolve, _) => {
        dispatch(resetSuccessIndicators());
        dispatch(reset());
        socket.emit("joinRoom", contestId);
        resolve(id);
      });
      resetState.then((id) => {
        socket.emit("updateContest", id);
        navigate(`/contests/live?contestId=${id}`, {
          replace: true,
        });
      });
    }
  }, [
    ongoingContest,
    contestId,
    dispatch,
    isSuccess,
    isError,
    message,
    navigate,
    socket,
  ]);

  const onChange = (e) => {
    setContestId(e.target.value);
  };

  if (!user) {
    return <PleaseLoginToView />;
  }

  return (
    <div className="w-full h-full px-2 md:px-8 py-4 md:py-12">
      <div className="flex items-center justify-center">
        <div className="bg-gray-50 p-8 rounded-lg w-full max-w-md">
          <form id="join-contest-form" className="w-full">
            <div className="w-full max-w-md">
              <div className="">
                <label
                  htmlFor="contestId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contest ID
                </label>
                <input
                  type="text"
                  name="contestId"
                  id="contestId"
                  onChange={onChange}
                  value={contestId}
                  required
                  autoComplete="contest Id"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>

              <div className="pt-6 text-right">
                <button
                  onClick={handleJoinRoom}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {isLoading ? (
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-500 group-hover:text-cyan-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth={4}
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <UserGroupIcon
                        className="h-5 w-5 text-cyan-500 group-hover:text-cyan-400"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  Join Contest
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinContest;
