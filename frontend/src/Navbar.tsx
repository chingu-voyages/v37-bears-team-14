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
      <nav className="flex text-center sm:flex-row sm:text-left sm:justify-between text-emerald-200 bg-gray-700 py-2 px-6 shadow h-[64px ]">
        {/* <a
            href="/home"
            className="text-2xl no-underline text-grey-darkest hover:text-blue-dark"
          >
            Link Up
          </a> */}
        <div className="inline-flex items-center justify-center">
          <div className="flex justify-between content-center">
            <StackCafeIcon className="w-12" />
            {/* <span className="inline ml-2">StackCafe</span> */}
          </div>
        </div>
        {/* className="flex items-center justify-center" */}
        <div className="inline-flex items-center justify-center">
          <Link to="/projects">
            <button className="relative inline-flex items-center mr-2 justify-center p-0.5 overflow-hidden text-sm font-medium text-emerald-200 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800">
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
            <button className="relative inline-flex items-center justify-center mr-2 p-0.5 overflow-hidden text-sm font-medium text-emerald-200 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 hover:text-white dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:ring-lime-200 dark:focus:ring-lime-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-700 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Applications
              </span>
            </button>
          </Link>

          {currentSession.isLoggedIn ? (
            <div className="inline">
              <span className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2 mr-2">
                {currentSession.user.username}
              </span>

              <img
                className="rounded-full border-gray-100 shadow-sm w-12 h-12 inline cursor-pointer border-transparent border-4 transition duration-900 hover:border-gray-500 "
                src={currentSession.user.avatarUrl}
                alt="avatar"
                onClick={() => setProfileDiv(!profileDiv)}
              />
              {profileDiv && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-20 mr-2 cursor-pointer">
                  <span
                    onClick={() => logout()}
                    className="block px-4 py-2 text-sm text-gray-800 border-b hover:bg-gray-200"
                  >
                    Sign Out
                  </span>

                  <span className="block px-4 py-2 text-sm text-gray-800 border-b hover:bg-gray-200">
                    View Profile
                  </span>
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
