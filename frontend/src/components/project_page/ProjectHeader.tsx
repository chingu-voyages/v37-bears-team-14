import { FunctionComponent } from "react";
import { Project } from "../../shared/Interfaces";

export interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: FunctionComponent<ProjectHeaderProps> = ({ project }) => {
  return (
    <div className="">
      <div className="text-2xl">{project.name}</div>
      <div className="text-slate-700">{project.description}</div>
    </div>
  );
};

export default ProjectHeader;
