import React, { FunctionComponent } from "react";

const EmptyTechSection: FunctionComponent = () => {
  return (
    <div className="lg:w-1/2 bg-indigo-600 text-white flex flex-col">
      <div className="p-8 bg-indigo-700 flex items-center">
        <div className="mr-auto">
          <h1 className="text-4xl leading-none mb-1">No Tech Stack Added</h1>
          <h2 className="text-indigo-400 text-sm">
            <i className="text-gray-300 mr-2.5">
              This user has not added their Tech Stack
            </i>
          </h2>
        </div>
        <button className="bg-indigo-600 text-white py-2 text-sm px-3 rounded focus:outline-none">
          Other Projects
        </button>
      </div>
    </div>
  );
};

export default EmptyTechSection;
