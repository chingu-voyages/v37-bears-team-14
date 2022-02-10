import React, { FunctionComponent, useState, useEffect } from "react";
type NavbarProps = {
  username: string;
  avatarURL: string;
};
type sessionData = {
  isLoggedIn: boolean;
  user: {
    avatarUrl: string;
    createdAt: string;
    githubId: string;
    id: string;
    isAdmin: boolean;
    updatedAt: string;
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
    },
  });
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
          <span className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2">
            {currentSession.user.id}
          </span>
          <a
            href="/projects"
            className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2"
          >
            Projects
          </a>
          <a
            href="/developers"
            className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2"
          >
            Developers
          </a>
          <a
            href="/applications"
            className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2 mr-2"
          >
            Applications
          </a>

          {currentSession.isLoggedIn ? (
            <img
              src={currentSession.user.avatarUrl}
              alt="avatar"
              className="h-10 inline rounded"
            />
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
