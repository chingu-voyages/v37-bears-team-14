import { useOutletContext } from "react-router-dom";
import { Project } from "../../shared/Interfaces";
import ProjectLanding from "./ProjectLanding";
import useMember from "./useMember";

const ProjectSettingsPage = () => {
  // const { project } = useOutletContext<{project: Project}>();

  // const { isMember, member } = useMember(project.id);

  // const isOwner = isMember && member && member.roleName === "owner";

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <div className="m-3 md:mx-8">Settings</div>
    </div>
  );
};

export default ProjectSettingsPage;
