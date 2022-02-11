import React, { FunctionComponent, useState, useEffect } from "react";
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

const Navbar: FunctionComponent = () => {
  const [currentSession, setCurrentSession] = useState<sessionData>({
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
  });
  const [profileDiv, setProfileDiv] = useState(false);
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
      <nav className="font-sans flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-4 px-6 bg-white shadow sm:items-baseline w-full">
        <div className="mb-2 sm:mb-0">
          <a
            href="/home"
            className="text-2xl no-underline text-grey-darkest hover:text-blue-dark"
          >
            Link Up
          </a>
        </div>
        <div>
          <Link to="/projects">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Projects
              </span>
            </button>
          </Link>

          <Link to="/developers">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Developers
              </span>
            </button>
          </Link>

          <Link to="/applications">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:ring-lime-200 dark:focus:ring-lime-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
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
                className="rounded-full border border-gray-100 shadow-sm w-16 h-16 inline cursor-pointer border-transparent border-4 transition duration-900 hover:border-gray-300 "
                src={currentSession.user.avatarUrl}
                alt="user image"
                onClick={() => setProfileDiv(!profileDiv)}
              />
              {profileDiv && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-20 mr-2">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-800 border-b hover:bg-gray-200"
                  >
                    Sign Out
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-800 border-b hover:bg-gray-200"
                  >
                    View Profile
                  </a>
                </div>
              )}

              {/* <img
                src={currentSession.user.avatarUrl}
                alt="avatar"
                className="h-10 inline rounded"
              /> */}
            </div>
          ) : (
            <a
              href="/sign-in"
              className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2"
            >
              Sign In
            </a>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
