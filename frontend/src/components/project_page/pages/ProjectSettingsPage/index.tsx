import { useNavigate, useOutletContext } from "react-router-dom";
import useMember from "../../hooks/useMember";
import ProjectSettingsForm from "../../components/ProjectSettingsForm";
import { ProjectPageContext } from "../../ProjectPageLayout";

const ProjectSettingsPage = () => {
  const { project, setProject } = useOutletContext<ProjectPageContext>();
  const { loading, isMember, member } = useMember(project.id);
  const isOwner = isMember && member && member.roleName === "owner";
  const navigate = useNavigate();

  if (!loading && !isOwner) {
    navigate("/projects/" + project.id);
  }

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <div className="w-full">
        <div className="m-3 md:m-8">
          <div className="font-bold">Settings</div>
          <div className="my-2 md:my-4">
            <ProjectSettingsForm project={project} setProject={setProject} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingsPage;
