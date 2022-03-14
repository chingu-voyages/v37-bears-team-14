import { useOutletContext, useParams } from "react-router-dom";
import { ProjectPageContext } from "../../layouts/ProjectPageLayout";
import ProjectLanding from "./components/ProjectShowcase";
import ApplyButtonContainer from "../../components/ApplyFlow/ApplyButtonContainer";
import ActionButton from "../../../controls/ActionButton";
import { useSession } from "../../../../hooks/session";
import StarButton from "./components/StarButton";
const ProjectLandingPage = () => {
  const { project, setProject } = useOutletContext<ProjectPageContext>();
  const { loading, isLoggedIn, user } = useSession();
  const params = useParams();
  const starProject = () => {
    fetch(`/api/v1/projects/${params.projectId}/star`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, project: params.projectId }),
    });
    console.log(user);
  };
  return (
    <>
      <div>
        <ActionButton onClick={() => starProject()}>Star</ActionButton>
      </div>
      <div className="flex flex-col-reverse md:flex-row">
        <main className="basis-3/4">
          <ProjectLanding project={project} setProject={setProject} />
        </main>
        <aside className="basis-1/4">
          <div className="mx-3 my-4 md:mr-8 md:my-8">
            <ApplyButtonContainer projectId={project.id} />
          </div>
        </aside>
      </div>
    </>
  );
};

export default ProjectLandingPage;
