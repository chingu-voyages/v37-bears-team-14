import { FunctionComponent } from "react";
import { Project } from "../../shared/Interfaces";
import Tech from "./components/Tech";
import MemberList from "./components/MemberList";

export interface ProjectLandingProps {
  project: Project;
}

const ProjectLanding: FunctionComponent<ProjectLandingProps> = ({
  project,
}) => {
  return (
    <div className="m-8">
      <div className="my-4">
        <div className="text-2xl">{project.name}</div>
        <div className="">{project.description}</div>
      </div>

      <div className="my-4">
        <div className="text-lg">Team</div>
        <MemberList projectId={project.id} />
      </div>

      <div className="my-4">
        <div className="text-lg">Tech Stack</div>
        <div className="flex">
          {project.techs.map((tech) => (
            <div className="" key={tech.id}>
              <Tech tech={tech} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectLanding;
