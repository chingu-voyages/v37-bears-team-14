import React, {
  useEffect,
  useState,
  FunctionComponent,
  Dispatch,
  SetStateAction,
} from "react";
import { useParams } from "react-router-dom";
import { User } from "../../shared/Interfaces";
import TechComponent from "./components/TechComponent";
import UserHeader from "./components/UserHeader";
import UserUpdateButton from "./components/UserUpdateButton";
import { useSession } from "../../hooks/session";

export interface UserPageContext {
  sessionUser: User;
  setUser: Dispatch<SetStateAction<User>>;
}

const UserPageUpdate: FunctionComponent = () => {
  const sessionUser = useSession().user;
  return (
    <section className="w-full">
      <div className="container mx-auto h-screen py-16 px-8 relative">
        <div className="flex w-full rounded-lg h-full lg:overflow-hidden overflow-auto lg:flex-row flex-col shadow-2xl">
          <div className="lg:w-1/2 bg-white text-gray-800 flex flex-col">
            <div className="p-8 shadow-md relative bg-white">
              {sessionUser && <UserHeader userProps={sessionUser} />}

              <div className="mt-6 flex">
                <UserUpdateButton />

                <div className="relative ml-auto flex-1 pl-8 sm:block hidden">
                  <input
                    placeholder="Search"
                    type="text"
                    className="w-full border rounded border-gray-400 h-full focus:outline-none pl-4 pr-8 text-gray-700 text-sm text-gray-500"
                  />
                  <svg
                    stroke="currentColor"
                    className="w-4 h-4 absolute right-0 top-0 mt-3 mr-2 text-gray-500"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="overflow-auto flex-grow"></div>
          </div>
          <div className="lg:w-1/2 bg-indigo-600 text-white flex flex-col">
            <div className="p-8 bg-indigo-700 flex items-center">
              <img
                src="https://nodejs.org/static/images/logo-hexagon-card.png"
                className="w-16 h-16 mr-4 object-top object-cover rounded"
              />
              <div className="mr-auto">
                <h1 className="text-4xl leading-none mb-1">Node.js</h1>
                <h2 className="text-indigo-400 text-sm">
                  JavaScript Framework
                </h2>
              </div>
              <button className="bg-indigo-600 text-white py-2 text-sm px-3 rounded focus:outline-none">
                Other Projects
              </button>
            </div>
            <div className="p-8 flex flex-1 items-start overflow-auto">
              <div className="flex-shrink-0 text-sm sticky top-0">
                <div className="flex items-center text-white mb-3">
                  Current Projects{" "}
                  <span className="italic text-sm ml-1 text-indigo-300">
                    (3)
                  </span>
                </div>
                <div className="flex items-center text-indigo-300 mb-3">
                  Past Projects <span className="italic text-sm ml-1">(8)</span>
                </div>
                <div className="flex items-center text-indigo-300">
                  Closed <span className="italic text-sm ml-1">(4)</span>
                </div>
              </div>
              <div className="flex-1 pl-10">
                <div className="flex mb-8">
                  <div className="w-4 h-4 flex-shrink-0 rounded-full border-indigo-400 border-2 mt-1 mr-2"></div>
                  <div className="flex-grow">
                    <h3 className="text-sm mb-1">DjangoTube</h3>
                    <h4 className="text-xs text-indigo-300 italic">
                      Created June 2019
                    </h4>
                  </div>
                  <button className="text-indigo-300 flex-shrink-0 ml-2">
                    <svg
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                    ></svg>
                  </button>
                </div>
                <div className="flex mb-8">
                  <div className="w-4 h-4 flex-shrink-0 rounded-full border-indigo-400 border-2 mt-1 mr-2"></div>
                  <div className="flex-grow">
                    <h3 className="text-sm mb-1">OtherTube</h3>
                    <h4 className="text-xs text-indigo-300 italic">
                      Created June 2019
                    </h4>
                  </div>
                  <button className="text-indigo-300 flex-shrink-0 ml-2">
                    <svg
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                    ></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPageUpdate;
