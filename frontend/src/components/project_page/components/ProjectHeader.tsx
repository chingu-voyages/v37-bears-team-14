import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import ProjectPageMarkdown from "./ProjectPageMarkdown";
import { Project } from "../../../shared/Interfaces";

export interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: FunctionComponent<ProjectHeaderProps> = ({ project }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <Link to={"/projects/" + project.id} className="text-2xl hover:underline">
        {project.name}
      </Link>
      <div className="text-slate-700">
        <ProjectPageMarkdown>{project.description}</ProjectPageMarkdown>
      </div>
    </div>
  );
};

export default ProjectHeader;
