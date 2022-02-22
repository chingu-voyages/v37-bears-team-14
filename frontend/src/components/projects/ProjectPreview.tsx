import React, { FunctionComponent } from "react";
import { Project, Tech } from "../../shared/Interfaces";

interface Props {
  projects: Project[] | [];
}

const ProjectPreview: FunctionComponent<Props> = ({ projects }) => {
  return (
    <div className="md:container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {projects.map((p, index) => (
          <div className="bg-neutral-400 rounded-md p-4" key={index}>
            <p className="text-center text-2xl text-darkGray">{p.name}</p>
            <p className="mb-2 text-md text-darkGray">{p.description}</p>
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
        ))}
      </div>
    </div>
  );
};

export default ProjectPreview;
