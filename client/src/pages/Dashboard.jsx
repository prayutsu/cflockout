import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingBar from "../components/LoadingBar";
import { ReactComponent as Performance } from "../components/assets/performance.svg";
import {
  getContests,
  resetAllContestantsList,
} from "../features/contest/allContestsSlice";
import { toast } from "react-toastify";
import PleaseLoginToView from "../components/PleaseLoginToView";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(80);

  const dispatch = useDispatch();
  const { contestsList, isSuccess, isError, message } = useSelector(
    (state) => state.allContests
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getContests());
      setProgress(90);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user && isSuccess) {
      setLoading(false);
    }
    if (user && isError) {
      setLoading(false);
      toast.error(message);
      dispatch(resetAllContestantsList());
    }
  }, [isSuccess, isError, message, user, dispatch]);

  if (!user) {
    return <PleaseLoginToView />;
  }

  if (loading) {
    return (
      <LoadingBar progress={progress} />
    );
  }

  return (
    <div className="w-full h-full px-2 py-4 md:px-4 md:py-6 lg:p-16">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <h1 className="w-full text-center text-4xl font-bold tracking-wide text-gray-900">
          All Contests
        </h1>
        <p className="w-full text-center text-xl text-gray-500">
          All contests that you have participated in appear here
        </p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-16">
        <div className="col-span-2 lg:col-span-1 flex justify-center items-center">
          <Performance className="sm:max-w-md" />
        </div>
        <div className="w-full lg:col-span-1 col-span-2 basis-full grid grid-cols-1 gap-y-12">
          {contestsList.length > 0 ? (
            contestsList.map((contest, index) => {
              return (
                <div key={index} className="w-full flex flex-wrap items-center">
                  <h3 className="text-lg basis-full text-center font-bold text-cyan-700">
                    CfLockout Contest&nbsp;
                    <span className="text-gray-800">#{index}</span>
                  </h3>
                  <div className="w-full px-4">
                    <div className="mx-auto w-full rounded-2xl bg-white p-2">
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-cyan-50 px-4 py-2 text-left text-sm font-medium text-cyan-900 hover:bg-cyan-100 focus:outline-none focus-visible:ring focus-visible:ring-cyan-500 focus-visible:ring-opacity-75">
                              <span>Problems</span>
                              <ChevronUpIcon
                                className={`${
                                  open ? "rotate-180 transform" : ""
                                } h-5 w-5 text-cyan-500`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="py-4">
                              <div className="shadow-md rounded-lg">
                                <div className="bg-cyan-800 py-2 w-full grid grid-cols-4 gap-2">
                                  <div className="text-center col-span-2 p-2">
                                    <h3 className=" text-white text-sm font-semibold">
                                      Problem Link
                                    </h3>
                                  </div>
                                  <div className="text-center col-span-1 p-2">
                                    <h3 className="text-white text-sm font-semibold">
                                      Rating
                                    </h3>
                                  </div>
                                  <div className="text-center text-whitecol-span-1 p-2">
                                    <h3 className="text-white text-sm font-semibold">
                                      Points
                                    </h3>
                                  </div>
                                </div>
                                {contest.problems.map((problem, index) => (
                                  <div
                                    key={index}
                                    className="bg-white-200 py-2 w-full grid grid-cols-4 gap-2"
                                  >
                                    <div className="text-center col-span-2 p-2">
                                      <h3 className="text-cyan-800 text-sm font-bold tracking-wider underline">
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
                                      <h3 className="text-gray-800 text-sm font-semibold">
                                        {problem.rating}
                                      </h3>
                                    </div>
                                    <div className="text-center col-span-1 p-2">
                                      <h3 className="text-gray-800 text-sm font-semibold">
                                        {problem.points}
                                      </h3>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                      <Disclosure as="div" className="mt-2">
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-cyan-50 px-4 py-2 text-left text-sm font-medium text-cyan-900 hover:bg-cyan-100 focus:outline-none focus-visible:ring focus-visible:ring-cyan-500 focus-visible:ring-opacity-75">
                              <span>Ranklist</span>
                              <ChevronUpIcon
                                className={`${
                                  open ? "rotate-180 transform" : ""
                                } h-5 w-5 text-cyan-500`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="py-4">
                              <div className="col-span-7 md:col-span-3 shadow-md rounded-lg">
                                <div className="bg-cyan-800 py-2 w-full grid grid-cols-4 gap-2">
                                  <div className="text-center col-span-1 p-2">
                                    <h3 className="text-white text-sm font-semibold">
                                      Rank
                                    </h3>
                                  </div>
                                  <div className="text-center col-span-2 p-2">
                                    <h3 className="text-white text-sm font-semibold">
                                      Contestant
                                    </h3>
                                  </div>
                                  <div className="text-center col-span-1 p-2">
                                    <h3 className="text-white text-sm font-semibold">
                                      Points
                                    </h3>
                                  </div>
                                </div>

                                {contest.contestants.map(
                                  (contestant, index) => (
                                    <div
                                      key={index}
                                      className="bg-white-200 py-2 w-full grid grid-cols-4 gap-2"
                                    >
                                      <div className="text-center col-span-1 p-2">
                                        <h3 className="text-gray-800 text-sm font-semibold">
                                          {contestant.rank}
                                        </h3>
                                      </div>
                                      <div className="text-center col-span-2 p-2">
                                        <h3 className="text-gray-800 text-sm font-semibold">
                                          {contestant.username}
                                        </h3>
                                      </div>
                                      <div className="text-center col-span-1 p-2">
                                        <h3 className="text-gray-800 text-sm font-semibold">
                                          {contestant.points}
                                        </h3>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center w-full">
              <h1 className="text-2xl font-bold">
                You haven't participated in any contests
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
