import React, { FunctionComponent } from "react";
type NavbarProps = {
  username: string;
  avatarURL: string;
};
const Navbar: FunctionComponent<NavbarProps> = ({ username, avatarURL }) => {
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
            {username}
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
            className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2"
          >
            Applications
          </a>
          <a
            href="/sign-in"
            className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2"
          >
            Sign In
          </a>
          <img src={avatarURL} alt="" className="h-10 inline rounded" />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
