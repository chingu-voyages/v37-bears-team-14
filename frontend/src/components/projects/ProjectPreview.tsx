import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import Preview from "../../components/formatting/Preview";
import { Project, Tech, Member } from "../../shared/Interfaces";
import { truncateString } from "../../shared/Utils";

interface Props {
  projects: Project[] | [];
}

const ProjectPreview: FunctionComponent<Props> = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 m-1">
      {console.log(projects)}
      {projects.map((p, index) => (
        <Link to={`/projects/${p.id}`} key={index}>
          <div className="bg-neutral-400 shadow-lg" key={index}>
            <div className="bg-darkGray border-b-[1px] border-mintGreen">
              <p className="text-center sm:text-md lg:text-xl text-lightGray pb-2 pt-1">
                {p.name}
              </p>
            </div>
            <div className="pt-1 mb-2 text-sm text-darkGray pl-2 pr-2 leading-tight overflow-hidden">
              <Preview>{truncateString(p.description)}</Preview>
              <div className="flex justify-start no-first-margin">
                {p.techs.slice(0, 4).map((t: Tech, index) => (
                  <div className="relative m-1" key={index}>
                    <img
                      className="h-7 mx-auto flex justify-center align-middle"
                      alt={t.name}
                      src={t.imageUrl}
                    />
                  </div>
                ))}
                {p.techs.length > 4 && (
                  <span className="align-middle">{`+ ${
                    p.techs.length - 4
                  } More`}</span>
                )}
              </div>
            </div>
            <div className="-space-x-3 pb-1 pl-1">
              {p.members.map((m: Member) => (
                <img
                  className="relative z-1 bg-white inline object-cover w-8 h-8 border-2 border-neutral-400 rounded-full shadow-md"
                  src={m.user.avatarUrl}
                  alt={m.user.username}
                />
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProjectPreview;
