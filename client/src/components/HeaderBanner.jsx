import { useSelector } from "react-redux";
import { SpeakerphoneIcon, XIcon } from "@heroicons/react/outline";
import { useDispatch } from "react-redux";
import { toggleHeaderBanner } from "../features/nav/navSlice";

const HeaderBanner = () => {
  const { isHeaderBannerOpen } = useSelector((state) => state.nav);
  const dispatch = useDispatch();

  return (
    <div className={`bg-cyan-600 ${isHeaderBannerOpen ? "" : "hidden"}`}>
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-cyan-800">
              <SpeakerphoneIcon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </span>
            <p className="ml-3 font-medium text-white">
              <span className="">
                Verification mail sent, please check your spam folder!
              </span>
            </p>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              onClick={() => dispatch(toggleHeaderBanner())}
              className="-mr-1 flex p-2 rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
            >
              <span className="sr-only">Dismiss</span>
              <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBanner;
