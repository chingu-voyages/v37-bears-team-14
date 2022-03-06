import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Project } from "../../../shared/Interfaces";

export interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: FunctionComponent<ProjectHeaderProps> = ({ project }) => {
  return (
    <div className="">
      <Link to={"/projects/" + project.id} className="text-2xl hover:underline">
        {project.name}
      </Link>
      <div className="text-slate-700">
        <ReactMarkdown>{project.description}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ProjectHeader;
