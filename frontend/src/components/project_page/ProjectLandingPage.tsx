import { useOutletContext } from "react-router-dom";
import { Project } from "../../shared/Interfaces";
import ProjectLanding from "./ProjectLanding";

const ProjectLandingPage = () => {
  const { project } = useOutletContext<{ project: Project }>();

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <main className="basis-3/4">
        <ProjectLanding project={project} />
      </main>
      <aside className="basis-1/4"></aside>
    </div>
  );
};

export default ProjectLandingPage;
