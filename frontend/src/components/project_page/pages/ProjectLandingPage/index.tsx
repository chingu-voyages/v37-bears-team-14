import { useOutletContext } from "react-router-dom";
import { ProjectPageContext } from "../../layouts/ProjectPageLayout";
import ProjectLanding from "./components/ProjectShowcase";

const ProjectLandingPage = () => {
  const { project, setProject } = useOutletContext<ProjectPageContext>();

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <main className="basis-3/4">
        <ProjectLanding project={project} setProject={setProject} />
      </main>
      <aside className="basis-1/4"></aside>
    </div>
  );
};

export default ProjectLandingPage;
