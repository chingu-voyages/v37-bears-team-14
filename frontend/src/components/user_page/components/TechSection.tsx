import React, { FunctionComponent } from "react";
import { Tech } from "../../../shared/Interfaces";

interface Props {
  tech: Tech;
}

const TechSection: FunctionComponent<Props> = ({ tech }) => {
  return (
    <div className="lg:w-1/2 bg-indigo-600 text-white flex flex-col">
      <div className="p-8 bg-indigo-700 flex items-center">
        <img
          src={tech && tech.imageUrl}
          alt="Tech"
          className="w-16 h-16 mr-4 object-top object-cover rounded"
        />
        <div className="mr-auto">
          <h1 className="text-4xl leading-none mb-1">{tech && tech.name}</h1>
          <h2 className="text-indigo-400 text-sm">
            {tech && tech.description}
          </h2>
        </div>
        <button className="bg-indigo-600 text-white py-2 text-sm px-3 rounded focus:outline-none">
          Other Projects
        </button>
      </div>
      <div className="p-8 flex flex-1 items-start overflow-auto">
        {/* CODE FOR TECH INFORMATION 
        <div className="flex-shrink-0 text-sm sticky top-0">
          <div className="flex items-center text-white mb-3">
            Current Projects{" "}
            <span className="italic text-sm ml-1 text-indigo-300">(3)</span>
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
        */}
      </div>
    </div>
  );
};

export default TechSection;
