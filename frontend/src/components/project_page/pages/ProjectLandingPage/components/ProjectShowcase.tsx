import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import { Project } from "../../../../../shared/Interfaces";
import Tech from "../../../components/Tech";
import MemberList from "../../../components/MemberList";
import useMember from "../../../hooks/useMember";
import UpdateTechModal from "./UpdateTechModal";
import EditLink from "../../../../controls/EditLink";
import ProjectEventList from "./ProjectEventList";

export interface ProjectLandingProps {
  project: Project;
  setProject: Dispatch<SetStateAction<Project>>;
}

const ProjectLanding: FunctionComponent<ProjectLandingProps> = ({
  project,
  setProject,
}) => {
  const [showAddTech, setShowAddTech] = useState(false);
  const { isMember, member } = useMember(project.id);
  const isOwner = isMember && member && member.roleName === "owner";

  return (
    <div className="m-3 md:mx-8 mb-8 md:mb-16 ">
      <div className="my-4 md:my-8">
        <div className="font-bold my-1">Team</div>
        <MemberList projectId={project.id} />
      </div>

      <div className="my-4 md:my-8">
        <div className="font-bold my-1">
          Tech Stack
          <EditLink
            onClick={() => isOwner && setShowAddTech(true)}
            disabled={!isOwner}
          />
        </div>
        <div className="flex flex-wrap">
          {project.techs.map((tech) => (
            <div className="" key={tech.id}>
              <Tech tech={tech} />
            </div>
          ))}
        </div>
        {showAddTech && (
          <UpdateTechModal
            project={project}
            setProject={setProject}
            onClose={() => setShowAddTech(false)}
          />
        )}
      </div>

      <div className="my-4 md:my-8">
        <div className="font-bold my-1">Latest Events</div>
        <ProjectEventList projectId={project.id} />
      </div>
    </div>
  );
};

export default ProjectLanding;
