import React, { FunctionComponent, useState, useEffect } from "react";
import StackCafeIcon from "./components/icons/StackCafeIcon";
import { Link } from "react-router-dom";
type sessionData = {
  isLoggedIn: boolean;
  user: {
    avatarUrl: string;
    createdAt: string;
    githubId: string;
    id: string;
    isAdmin: boolean;
    updatedAt: string;
    username: string;
  };
};

// : FunctionComponent<NavbarProps> { username, avatarURL }
const blankUser = {
  isLoggedIn: false,
  user: {
    avatarUrl: "",
    createdAt: "",
    githubId: "",
    id: "",
    isAdmin: false,
    updatedAt: "",
    username: "",
  },
};

const Navbar: FunctionComponent = () => {
  const [currentSession, setCurrentSession] = useState<sessionData>(blankUser);
  const [profileDiv, setProfileDiv] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  async function logout() {
    await fetch("/auth/signout");
    setCurrentSession(blankUser);
  }
  useEffect(() => {
    async function getAuth() {
      const response = await fetch("/api/v1/current-session");
      const data = await response.json();

      setCurrentSession(data);
    }
    getAuth();
  }, []);

  return (
    <>
      <nav className="flex text-center sm:flex-row sm:text-left justify-between text-emerald-200 bg-gray-700 py-2 px-6 shadow h-[64px]">
        {/* <a
            href="/home"
            className="text-2xl no-underline text-grey-darkest hover:text-blue-dark"
          >
            Link Up
          </a> */}
        <div className="sm:hidden flex items-center">
          <button
            className="outline-none mobile-menu-button"
            onClick={() => {
              setMobileMenu(!mobileMenu);
              setProfileDiv(false);
            }}
          >
            <svg
              className="w-6 h-6 text-emerald-200"
              x-show="!showMenu"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        <div className="hidden sm:inline-flex items-center justify-center">
          <div className="flex justify-between content-center">
            <StackCafeIcon className="w-12" />
            {/* <span className="inline ml-2">StackCafe</span> */}
          </div>
        </div>
        {/* className="flex items-center justify-center" */}
        <div className="inline-flex items-center justify-between content-center">
          <div className="hidden sm:block">
            <Link to="/projects">
              <button className="relative inline-flex items-center mr-2 justify-center p-0.5 overflow-hidden text-sm font-medium text-emerald-200 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-700 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Projects
                </span>
              </button>
            </Link>

            <Link to="/developers">
              <button className="relative inline-flex items-center mr-2 justify-center p-0.5 overflow-hidden text-sm font-medium text-emerald-200 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-700 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Developers
                </span>
              </button>
            </Link>

            <Link to="/applications">
              <button className="relative inline-flex items-center mr-2 justify-center p-0.5 overflow-hidden text-sm font-medium text-emerald-200 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-700 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Applications
                </span>
              </button>
            </Link>
          </div>
          {currentSession.isLoggedIn ? (
            <div className="inline">
              <span className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2 mr-2">
                {currentSession.user.username}
              </span>

              <img
                className="rounded-full border-gray-100 shadow-sm w-12 h-12 inline cursor-pointer border-transparent border-4 transition duration-900 hover:border-gray-500 "
                src={currentSession.user.avatarUrl}
                alt="avatar"
                onClick={() => {
                  setProfileDiv(!profileDiv);
                  setMobileMenu(false);
                }}
              />
              {profileDiv && (
                <div className="absolute right-0 mt-2 w-48 text-center bg-darkGray rounded-bl-md overflow-hidden shadow-xl z-20 cursor-pointer">
                  <span
                    onClick={() => logout()}
                    className="block px-4 py-2 text-sm text-mintGreen border-b-2 border-medGray hover:bg-gradient-to-br hover:from-purple-600 hover:to-blue-500 hover:text-white"
                  >
                    Sign Out
                  </span>

                  <span className="block px-4 py-2 text-sm text-mintGreen hover:bg-gradient-to-br hover:from-purple-600 hover:to-blue-500 hover:text-white">
                    View Profile
                  </span>
                </div>
              )}
              {mobileMenu && (
                <div className="absolute left-0 sm:hidden mt-2 w-48 bg-darkGray rounded-br-md overflow-hidden shadow-xl z-20 cursor-pointer">
                  <Link to="/projects">
                    <span className="block px-4 py-2 text-sm text-mintGreen border-b-2 border-medGray hover:bg-gradient-to-br hover:from-purple-600 hover:to-blue-500 hover:text-white">
                      Projects
                    </span>
                  </Link>
                  <Link to="/developers">
                    <span className="block px-4 py-2 text-sm text-mintGreen border-b-2 border-medGray hover:bg-gradient-to-br hover:from-purple-600 hover:to-blue-500 hover:text-white">
                      Developers
                    </span>
                  </Link>
                  <Link to="/applications">
                    <span className="block px-4 py-2 text-sm text-mintGreen hover:bg-gradient-to-br hover:from-purple-600 hover:to-blue-500 hover:text-white">
                      Applications
                    </span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth/github" reloadDocument>
              <span className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2">
                Sign In
              </span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
