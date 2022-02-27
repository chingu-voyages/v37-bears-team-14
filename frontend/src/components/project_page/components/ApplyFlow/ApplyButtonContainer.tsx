import { FC, useEffect } from "react";
import { useSession } from "../../../../hooks/session";
import ActionButton from "../../../controls/ActionButton";
import LoadingSpinner from "../../../Spinners/LoadingSpinner";
import useMember from "../../hooks/useMember";
import ApplyButton from "./ApplyButton";
import useApplication from "../../hooks/useApplication";
import ApplicationSummary from "./ApplicationSummary";

interface ApplyButtonContainerProps {
  projectId: string;
}

const ApplyButtonContainer: FC<ApplyButtonContainerProps> = ({ projectId }) => {
  const { loading: loadingMember, isMember } = useMember(projectId);
  const { loading: loadingSession, isLoggedIn, user } = useSession();
  const { application, setApplication } = useApplication(projectId);

  useEffect(() => {}, []);

  if (loadingMember || loadingSession) {
    return <LoadingSpinner />;
  }

  if (!isLoggedIn) {
    return <ActionButton>Sign In to Join the Team</ActionButton>;
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
