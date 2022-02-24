import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Project, Tech } from "../../shared/Interfaces";

interface Props {
  projects: Project[] | [];
}

const ProjectPreview: FunctionComponent<Props> = ({ projects }) => {
  return (
    // <div className="md:container mx-auto px-4"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 m-1">
      {projects.map((p, index) => (
        <Link to={p.id}>
          <div className="bg-neutral-400" key={index}>
            <div className="bg-darkGray border-b-4 border-lightGray">
              <p className="text-center sm:text-md lg:text-xl text-lightGray pb-2 pt-1">
                {p.name}
              </p>
            </div>
            <div className="pt-1">
              <p className="mb-2 text-md text-darkGray pl-2">{p.description}</p>
              <div className="flex justify-start">
                {p.techs.map((t: Tech, index) => (
                  <div className="relative m-1" key={index}>
                    <img
                      className="h-9 mx-auto flex justify-center"
                      alt={t.name}
                      src={t.imageUrl}
                    />
                    <div className="p-1 m-1 text-xs text-slate-600 bg-slate-300 rounded-md flex justify-center font-bold">
                      {t.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProjectPreview;
