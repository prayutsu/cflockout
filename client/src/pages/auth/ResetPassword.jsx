import { CogIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ReactComponent as CflockoutLogo } from "../../components/assets/cflockout-logo-icon.svg";
import PasswordResetSuccessful from "../../components/PasswordResetSuccessful";
import { reset, resetPassword } from "../../features/auth/authSlice";
import PleaseLoginToView from "../../components/PleaseLoginToView";

const ResetPassword = () => {
  const [passwordResetComplete, setPasswordResetComplete] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, passwordResetSuccess, isError, message, isLoading } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (passwordResetSuccess) {
      toast.success("Password reset successful");
      setPasswordResetComplete(true);
    }
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    return () => {
      dispatch(reset());
    };
  }, [passwordResetSuccess, isError, message, dispatch, navigate]);

  const onChange = (event) => {
    setFormData((previousState) => ({
      ...previousState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (document.getElementById("signin-form").reportValidity()) {
      if (formData.password !== formData.password2) {
        toast.error("Passwords do not match");
        dispatch(reset());
        return;
      }
      dispatch(resetPassword(formData.password));
    }
    event.target.blur();
  };

  if (!user) {
    return <PleaseLoginToView />;
  }

  if (passwordResetComplete) {
    return <PasswordResetSuccessful />;
  }

  return (
    <div className="h-full py-8 px-4 md:p-8">
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <CflockoutLogo className="mx-auto h-20 w-auto" />

            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Choose a strong password to protect your account
            </p>
          </div>
          <form id="signin-form" className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  disabled={true}
                  required
                  autoComplete="email-address"
                  value={user.email}
                  placeholder="you@example.com"
                  className="text-gray-500 mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  minLength={4}
                  maxLength={16}
                  autoComplete="password"
                  value={formData.password}
                  onChange={onChange}
                  placeholder="********"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="password2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New password
                </label>
                <input
                  type="password"
                  name="password2"
                  id="password2"
                  required
                  minLength={4}
                  autoComplete="password"
                  value={formData.password2}
                  onChange={onChange}
                  placeholder="********"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                onClick={handleSubmit}
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
                    <CogIcon
                      className="h-5 w-5 text-cyan-500 group-hover:text-cyan-400"
                      aria-hidden="true"
                    />
                  )}
                </span>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
