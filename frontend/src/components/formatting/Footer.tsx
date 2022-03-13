import { Link } from "react-router-dom";
import StackCafeIcon from "../icons/StackCafeIcon";

const Footer = () => {
  return (
    <div className="mb-12 md:mb-6 mx-3 md:mx-8 border-t-2 border-emerald-600 border-opacity-30 pt-2 md:pt-4">
      <div className="flex md:flex-row flex-col text-emerald-800">
        <Link
          to="/"
          className="mt-3 mb-2 md:my-2 md:mt-0 mr-6 flex text-emerald-700 hover:text-emerald-900"
        >
          <StackCafeIcon className="w-8 h-8 mr-2 md:w-5 md:h-5 md:mt-[0.15rem]" />
          <div className="text-xl md:text-base font-semibold mt-1 md:mt-[0.1rem]">
            Stack Cafe
          </div>
        </Link>

        <a
          href="https://status.stack.cafe"
          target={"_blank"}
          rel={"noreferrer"}
          className="mt-3 md:mt-0 flex mr-6 hover:text-emerald-900 hover:underline"
        >
          <div className="mt-1 bg-emerald-600 rounded-full w-4 md:w-3 h-4 md:h-3 mr-2 md:mt-[0.47rem]"></div>
          <div className=" md:text-sm md:mt-1">Status</div>
        </a>

        <Link
          to="/terms"
          className="mt-3 md:mt-1 mr-6 relative left-0 md:text-sm hover:text-emerald-900 hover:underline"
        >
          Terms
        </Link>
        <Link
          to="/privacy"
          className="mt-3 md:mt-1 mr-6 relative left-0 md:text-sm hover:text-emerald-900 hover:underline"
        >
          Privacy
        </Link>
        <Link
          to="/contact"
          className="mt-3 md:mt-1 mr-6 relative left-0 md:text-sm hover:text-emerald-900 hover:underline"
        >
          Contact
        </Link>

        <Link
          to="/about"
          className="mt-3 md:mt-1 mr-6 md:text-sm hover:text-emerald-900 hover:underline"
        >
          About
        </Link>
        <Link
          to="/team"
          className="mt-3 md:mt-1 mr-6 md:text-sm hover:text-emerald-900 hover:underline"
        >
          Team
        </Link>
        <a
          href="https://github.com/chingu-voyages/v37-bears-team-14"
          target={"_blank"}
          rel={"noreferrer"}
          className="mt-3 mr-6 md:mt-1 md:text-sm hover:text-emerald-900 hover:underline"
        >
          Source
        </a>
      </div>
    </div>
  );
};

export default Footer;
