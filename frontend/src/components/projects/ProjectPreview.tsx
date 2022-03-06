import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Project, Tech } from "../../shared/Interfaces";
import { truncateString } from "../../shared/Utils";

interface Props {
  projects: Project[] | [];
}

const ProjectPreview: FunctionComponent<Props> = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 m-1">
      {projects.map((p, index) => (
        <Link to={`/projects/${p.id}`} key={index}>
          <div className="bg-neutral-400" key={index}>
            <div className="bg-darkGray border-b-4 border-lightGray">
              <p className="text-center sm:text-md lg:text-xl text-lightGray pb-2 pt-1">
                {p.name}
              </p>
            </div>
            <div className="pt-1">
              <p className="mb-2 text-sm text-darkGray pl-2 pr-2 leading-tight">
                <ReactMarkdown>{truncateString(p.description)}</ReactMarkdown>
              </p>
              <div className="flex justify-start">
                {p.techs.slice(0, 4).map((t: Tech, index) => (
                  <div className="relative m-1" key={index}>
                    <img
                      className="h-7 mx-auto flex justify-center align-middle"
                      alt={t.name}
                      src={t.imageUrl}
                    />
                  </div>
                ))}
                {p.techs.length > 5 && (
                  <span className="align-middle">{`+ ${
                    p.techs.length - 5
                  } More`}</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProjectPreview;
