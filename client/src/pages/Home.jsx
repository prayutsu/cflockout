import React, { useEffect } from "react";
import { changeIndex } from "../features/nav/navSlice";
import { ReactComponent as ProblemSolve } from "../components/assets/problem-solve.svg";
import { ReactComponent as UnsolvedProblems } from "../components/assets/unsolved-problems.svg";
import { ReactComponent as CompeteWithFriends } from "../components/assets/compete-with-friends.svg";
import { ReactComponent as Compete } from "../components/assets/compete.svg";
import { Link } from "react-router-dom";
import HeaderBanner from "../components/HeaderBanner";

const Home = () => {
  useEffect(() => {
    changeIndex(0);
  }, []); // eslint-disable-line

  return (
    <div className="h-full w-full overflow-hidden">
      <section className="relative">
        <HeaderBanner />
      </section>
      {/* Hero section */}
      <section className="relative p-2 md:px-6 lg:px-24">
        <div className="container flex flex-col-reverse lg:flex-row items-center gap-12 mt-14 lg:mt-28">
          {/* Content */}
          <div className="flex flex-1 flex-col items-center lg:items-start">
            <h2 className="text-cyan-700 text-3xl md:text-4xl lg:text-5xl text-center lg:text-left mb-6">
              Codeforces Lockout Contest Tool
            </h2>
            <p className="text-gray-600 text-lg text-center lg:text-left mb-6">
              CfLockout allows you to create a contest where you can practice
              Codeforces problems with your friends in a competitive way.
            </p>
            <div className="flex justify-center flex-wrap gap-6">
              <a
                href="https://codeforces.com/"
                rel="noreferrer"
                target="_blank"
                className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                Codeforces
              </a>
              <Link
                className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                to="/contests/create"
              >
                Get Started
              </Link>
            </div>
          </div>
          {/* Image */}
          <div className="flex-1 flex justify-center items-center mb-10 md:mb-16 lg:mb-0 z-10">
            <ProblemSolve className="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full max-w-md" />
          </div>
        </div>
        {/* Background rounded rectangle. */}
        {/* <div className="hidden md:block overflow-y-hidden overflow-x-visible bg-cyan-500 rounded-l-full absolute h-60 w-2/4 top-32 right-0 lg:-bottom-28 lg:-right:36"></div> */}
      </section>

      {/* Features section */}
      <section className="relative bg-slate-50 mt-20 px-2 py-6 md:px-6 md:py-12 lg:py-24 lg:px-24">
        {/* Heading */}
        <div className="sm:w-3/4 lg:w-5/12 mx-auto px-2">
          <h1 className="text-4xl text-center text-gray-800">Features</h1>
          <p className="text-gray-600 mt-4 text-center">
            Our aim is to quickly create a practice Lockout contest of unsolved
            problems.
          </p>
        </div>
        {/* Feature #1 */}
        <div className="relative mt-20 lg:mt-24">
          <div className="container flex flex-col lg:flex-row items-center justify-center gap-x-24">
            {/* Image */}
            <div className="flex flex-1 justify-center z-10 mb-10 lg:mb-0">
              <CompeteWithFriends className="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full max-w-md" />
            </div>
            {/* Content */}
            <div className="flex flex-1 flex-col items-center lg:items-start">
              <h1 className="text-3xl text-cyan-700 text-center lg:text-left">
                Practice only unsolved problems
              </h1>
              <p className="text-gray-600 text-lg my-4 text-center lg:text-left sm:w-3/4 lg:w-full">
                CfLockout creates contest of only those problems which are
                unsolved by all participants of the contest.
              </p>
              <Link
                to="/contests/live"
                className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                Live
              </Link>
            </div>
          </div>
        </div>
        {/* Feature #2 */}
        <div className="relative mt-20">
          <div className="container flex flex-col-reverse lg:flex-row items-center justify-center gap-x-24">
            {/* Content */}
            <div className="flex flex-1 flex-col items-center lg:items-start">
              <h1 className="text-3xl text-cyan-700 text-center lg:text-left">
                Chooose Custom difficulty levels
              </h1>
              <p className="text-gray-600 text-lg my-4 text-center lg:text-left sm:w-3/4 lg:w-full">
                You can set ratings of the codeforces problems to your liking.
              </p>
              <Link
                className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                to="/contests/create"
              >
                Create
              </Link>
            </div>
            {/* Image */}
            <div className="flex flex-1 justify-center z-10 mb-10 lg:mb-0">
              <UnsolvedProblems className="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full max-w-md" />
            </div>
          </div>
        </div>
        {/* Feature #3 */}
        <div className="relative mt-20">
          <div className="container flex flex-col lg:flex-row items-center justify-center gap-x-24">
            {/* Image */}
            <div className="flex flex-1 justify-center z-10 mb-10 lg:mb-0">
              <Compete className="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full max-w-md" />
            </div>
            {/* Content */}
            <div className="flex flex-1 flex-col items-center lg:items-start">
              <h1 className="text-3xl text-center lg:text-left text-cyan-700">Compete in a fun way</h1>
              <p className="text-gray-600 text-lg my-4 text-center lg:text-left sm:w-3/4 lg:w-full">
                Solve problems faster than your friends to get points. Solving
                an already solved problem doesn't give you any points.
              </p>
              <Link
                to="/contests/join"
                className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                Join Contest
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
