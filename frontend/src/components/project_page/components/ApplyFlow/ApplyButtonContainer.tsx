import { FC } from "react";
import { useSession } from "../../../../hooks/session";
import LoadingSpinner from "../../../Spinners/LoadingSpinner";
import useMember from "../../hooks/useMember";
import ApplyButton from "./ApplyButton";
import useApplication from "../../hooks/useApplication";
import ApplicationSummary from "./ApplicationSummary";
import { Link } from "react-router-dom";

interface ApplyButtonContainerProps {
  projectId: string;
}

const ApplyButtonContainer: FC<ApplyButtonContainerProps> = ({ projectId }) => {
  const { loading: loadingMember, isMember } = useMember(projectId);
  const { loading: loadingSession, isLoggedIn, user } = useSession();
  const { application, setApplication } = useApplication(projectId);

  if (loadingMember || loadingSession) {
    return <LoadingSpinner />;
  }

  if (!isLoggedIn) {
    return (
      <Link
        to="/auth/github"
        reloadDocument
        className="main-btn whitespace-nowrap w-full inline-block"
      >
        Sign In to Join the Team
      </Link>
    );
  }

  if (isMember || !user) {
    return null;
  }

  return application ? (
    <ApplicationSummary application={application} />
  ) : (
    <ApplyButton
      projectId={projectId}
      userId={user.id}
      setApplication={setApplication}
    />
  );
};

export default ApplyButtonContainer;
