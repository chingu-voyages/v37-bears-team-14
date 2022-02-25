import { useOutletContext } from "react-router-dom";
import ProjectSettingsForm from "../../components/ProjectSettingsForm";
import { ProjectPageContext } from "../../layouts/ProjectPageLayout";

const ProjectSettingsPage = () => {
  const { project, setProject } = useOutletContext<ProjectPageContext>();

  return (
    <div className="w-full">
      <div className="m-3 md:mr-8 md:my-6">
        <div className="text-2xl font-bold">Project</div>
        <div className="my-2 md:my-4">
          <ProjectSettingsForm project={project} setProject={setProject} />
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingsPage;
