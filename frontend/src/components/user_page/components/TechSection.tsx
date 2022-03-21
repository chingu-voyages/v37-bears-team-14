import React, { FunctionComponent } from "react";
import { Tech, Project } from "../../../shared/Interfaces";
import { Link } from "react-router-dom";

interface Props {
  tech: Tech;
  projects: Project[] | null | undefined;
}

const TechSection: FunctionComponent<Props> = ({ tech, projects }) => {
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
        <div className="flex-shrink-0 text-sm sticky top-0">
          <div className="flex items-center text-white mb-3">
            Total Projects{" "}
            <span className="italic text-sm ml-1 text-indigo-300">
              ({projects && projects.length})
            </span>
          </div>
        </div>
        <div className="flex-1 pl-10">
          {projects && projects.length === 0 && (
            <h1 className="text-lg text-indigo-300">
              {" "}
              No projects for this tech
            </h1>
          )}
          {projects &&
            projects.map((project) => (
              <Link to={`/projects/${project.id}`}>
                <div className="flex mb-8">
                  <div className="w-4 h-4 flex-shrink-0 rounded-full border-indigo-400 border-2 mt-1 mr-2"></div>
                  <div className="flex-grow">
                    <h3 className="text-sm mb-1">{project.name}</h3>
                    <h4 className="text-xs text-indigo-300 italic">
                      {project.description}
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
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TechSection;
