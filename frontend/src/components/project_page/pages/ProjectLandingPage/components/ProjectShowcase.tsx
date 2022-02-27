import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import { Project } from "../../../../../shared/Interfaces";
import Tech from "../../../components/Tech";
import MemberList from "../../../components/MemberList";
import PencilAltIcon from "../../../../icons/PencilAltIcon";
import useMember from "../../../hooks/useMember";
import UpdateTechModal from "./UpdateTechModal";

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
    <div className="m-3 md:mx-8 mb-8 md:mb-16">
      <div className="my-4 md:my-8">
        <div className="font-bold my-1">Team</div>
        <MemberList projectId={project.id} />
      </div>

      <div className="my-4 md:my-8">
        <div className="font-bold my-1">
          Tech Stack
          <div
            onClick={() => isOwner && setShowAddTech(true)}
            className={
              " mx-2 inline cursor-pointer text-slate-600 hover:text-slate-900 active:text-slate-600 " +
              (isOwner
                ? ""
                : "opacity-40 hover:text-slate-600 cursor-not-allowed")
            }
          >
            <PencilAltIcon className="p-1 h-6 inline" />{" "}
            <span className="text-sm font-medium">Edit</span>
          </div>
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
    </div>
  );
};

export default ProjectLanding;
