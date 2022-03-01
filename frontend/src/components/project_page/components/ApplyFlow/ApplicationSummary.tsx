import { FC } from "react";
import { Application } from "../../../../shared/Interfaces";
import ApplicationStatus from "../../pages/ProjectApplicationPage/components/ApplicationStatus";
import getBlurb from "../../pages/ProjectApplicationsListPage/getBlurb";

interface ApplicationSummaryProps {
  application: Application;
}

const ApplicationSummary: FC<ApplicationSummaryProps> = ({ application }) => {
  const { summary, hasMore } = getBlurb(application.content);
  return (
    <>
      <div className="text-sm font-semibold">Your Application</div>
      <ApplicationStatus status={application.status} />
      <div className="text-sm">Role: {application.requestedRole}</div>
      <div className="text-sm">
        {summary}
        {hasMore && "..."}
      </div>
    </>
  );
};

export default ApplicationSummary;
