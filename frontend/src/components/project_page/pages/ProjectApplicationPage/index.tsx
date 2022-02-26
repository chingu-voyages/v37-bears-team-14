import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ProjectPageContext } from "../../layouts/ProjectPageLayout";
import useMember from "../../hooks/useMember";
import ApplicationInfo from "./ApplicationInfo";
import ActionButton from "../../../controls/ActionButton";

const ProjectApplicationPage = () => {
  const { project } = useOutletContext<ProjectPageContext>();
  const { applicationId } = useParams();

  const { loading, isMember } = useMember(project.id);
  const navigate = useNavigate();

  if (!loading && !isMember) {
    navigate("..");
  }

  if (!applicationId) {
    navigate("..");
  }

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <main className="basis-3/4">
        {applicationId && <ApplicationInfo applicationId={applicationId} />}
      </main>
      <aside className="basis-1/4">
        <div className="mx-3 md:mr-8 my-4">
          <div className="my-1">
            <ActionButton>Accept</ActionButton>
          </div>
          <div className="my-1">
            <ActionButton additionalClassName="bg-amber-600 hover:bg-amber-700 active:bg-amber-600 border-amber-800">
              Reject
            </ActionButton>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ProjectApplicationPage;
