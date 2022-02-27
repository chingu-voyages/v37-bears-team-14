import { useNavigate, useOutletContext } from "react-router-dom";
import { ProjectPageContext } from "../../layouts/ProjectPageLayout";
import ApplicationList from "./ApplicationList";
import useMember from "../../hooks/useMember";
import { useEffect } from "react";

const ProjectApplicationsListPage = () => {
  const { project } = useOutletContext<ProjectPageContext>();
  const { loading, isMember } = useMember(project.id);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isMember) {
      navigate("..");
    }
  }, [loading, isMember, navigate]);

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <main className="basis-3/4">
        <div className="mx-3 md:mx-8 my-4 ">
          <ApplicationList projectId={project.id} />
        </div>
      </main>
      <aside className="basis-1/4"></aside>
    </div>
  );
};

export default ProjectApplicationsListPage;
