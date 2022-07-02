import { Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProfileImageUrl, logout } from "../features/auth/authSlice";
import { changeIndex } from "../features/nav/navSlice";
import { ReactComponent as CflockoutLogo } from "./assets/new-cflockout-logo.svg";
import { ReactComponent as CflockoutIconLogo } from "./assets/cflockout-logo-icon.svg";
import Avatar from "./Avatar";
import { SiBuymeacoffee } from "react-icons/si";

const navigation = [
  { name: "Home", route: "/", index: 0 },
  { name: "Dashboard", route: "/dashboard", index: 1 },
  { name: "Create", route: "/contests/create", index: 2 },
  { name: "Join", route: "/contests/join", index: 3 },
  { name: "Live", route: "/contests/live", index: 4 },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, imageUrl } = useSelector((state) => state.auth);
  const { selectedIndex } = useSelector((state) => state.nav);
  const dispatch = useDispatch();

  let selectedItemIndex = 0;
  if (location.pathname === "/") selectedItemIndex = 0;
  else if (location.pathname.includes("/dashboard")) selectedItemIndex = 1;
  else if (location.pathname === "/create") selectedItemIndex = 2;
  else if (location.pathname === "/join") selectedItemIndex = 3;
  else if (location.pathname.includes("/live")) selectedItemIndex = 4;
  else if (
    location.pathname === "/auth/login" ||
    location.pathname === "/auth/signup"
  )
    selectedItemIndex = 5;
  else selectedItemIndex = 6;

  useEffect(() => {
    dispatch(changeIndex(selectedItemIndex));
  }, [dispatch, selectedItemIndex]);

  useEffect(() => {
    if (user) {
      dispatch(getProfileImageUrl(user._id));
    }
  }, []); // eslint-disable-line

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/");
  };

  return (
    <Disclosure as="nav" className="bg-gray-800 shadow-lg w-full">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 w-screen">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 gap-x-4 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <CflockoutLogo
                    className="hidden lg:block h-10 w-auto cursor-pointer"
                    onClick={() => navigate("/")}
                  />
                  <CflockoutIconLogo
                    onClick={() => navigate("/")}
                    className="lg:hidden h-10 w-auto cursor-pointer"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          navigate(item.route);
                          dispatch(changeIndex(item.index));
                        }}
                        className={classNames(
                          item.index === selectedIndex
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={
                          item.index === selectedIndex ? "page" : undefined
                        }
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span className="sr-only">BuyMeACoffee Link</span>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.buymeacoffee.com/prayutsu"
                  >
                    <SiBuymeacoffee className="h-6 w-6" />
                  </a>
                </button>

                {/* Profile dropdown */}
                {user ? (
                  <Menu as="div" className="ml-3 relative">
                    <div className="border-l-slate-600 border-l-2 pl-4">
                      <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <span className="sr-only">Open user menu</span>
                        <span className="h-8 w-8 rounded-full border-[1px] border-black">
                          {imageUrl === "" ? (
                            <Avatar className="h-full w-full" />
                          ) : (
                            <img
                              src={imageUrl}
                              alt="avatar"
                              className="w-full h-full rounded-full"
                            />
                          )}
                        </span>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="z-20 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile/edit"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                              )}
                            >
                              Edit Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              onClick={handleLogout}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 w-full cursor-pointer"
                              )}
                            >
                              Sign out
                            </div>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="border-l-slate-600 border-l-2 pl-3 ml-3">
                    <button
                      onClick={() => {
                        navigate("/auth/login");
                        dispatch(changeIndex(5));
                      }}
                      className={classNames(
                        5 === selectedIndex
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "px-3 py-2 rounded-md text-sm font-medium"
                      )}
                      aria-current={5 === selectedIndex ? "page" : undefined}
                    >
                      Log In
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  onClick={() => {
                    navigate(item.route);
                    dispatch(changeIndex(item.index));
                  }}
                  className={classNames(
                    item.index === selectedIndex
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
