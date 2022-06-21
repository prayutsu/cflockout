import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBar from "../components/LoadingBar";
import { reset, verify } from "../features/auth/authSlice";
import { ReactComponent as VerificationFailed } from "../components/assets/verification-failed.svg";
import { ReactComponent as VerifiedMail } from "../components/assets/verified-mail.svg";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(80);
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();
  const { user, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const token = searchParams.get("token");
    dispatch(verify(token));
    setProgress(90);
    return () => {
      dispatch(reset());
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    if (isSuccess) {
      setLoading(false);
      toast.success("Your email has been verified!");
    }
    if (isError) {
      setLoading(false);
      toast.error(message);
    }
  }, [isSuccess, isError, message, user]);

  return loading ? (
    <LoadingBar progress={progress} />
  ) : isSuccess && user && user.verified ? (
    <div className="h-full w-full p-4 md:p-12 ">
      <div className="container flex flex-col lg:flex-row items-center gap-12 my-8 lg:my-16">
        {/* Image */}
        <div className="flex-1 flex justify-center items-center mb-10 md:mb-16 lg:mb-0 z-10">
          <VerifiedMail className="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full max-w-md" />
        </div>
        {/* Content */}
        <div className="flex flex-1 flex-col items-center gap-4">
          <h1 className="text-2xl text-center font-semibold tracking-wide">
            Verification Completed, you are now Logged in!
          </h1>
          <Link
            className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            to="/"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div className="h-full w-full p-4 md:p-12 ">
      <div className="container flex flex-col lg:flex-row items-center gap-12  my-8 lg:my-16">
        {/* Image */}
        <div className="flex-1 flex justify-center items-center mb-10 md:mb-16 lg:mb-0 z-10">
          <VerificationFailed className="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full max-w-md" />
        </div>
        {/* Content */}
        <div className="flex flex-1 flex-col items-center">
          <h1 className="text-2xl text-center font-semibold tracking-wide">
            Account verification failed!!
          </h1>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
