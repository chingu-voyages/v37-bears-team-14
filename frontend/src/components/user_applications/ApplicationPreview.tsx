import { Application } from "../../shared/Interfaces";
import { FC } from "react";
import ApplicationStatus from "../project_page/pages/ProjectApplicationPage/components/ApplicationStatus";
import { Link } from "react-router-dom";
import getBlurb from "../project_page/pages/ProjectApplicationsListPage/getBlurb";
import moment from "moment";

interface ApplicationPreviewProps {
  application: Application;
}

const ApplicationPreview: FC<ApplicationPreviewProps> = ({ application }) => {
  const { summary, hasMore } = getBlurb(application.content);
  return (
    <div className="my-4">
      <div className="flex">
        <div className="mr-2 text-lg md:text-base">
          <Link
            to={"/applications/" + application.id}
            className="hover:underline"
          >
            To {application.project.name}
          </Link>
        </div>
        <div>
          <ApplicationStatus status={application.status} />
        </div>
      </div>
      {/* <div className="text-sm text-gray-600"><ApplicationStatus status={application.status} /></div> */}
      <div className="text-sm md:text-xs text-gray-600">
        As {application.requestedRole} • Submitted{" "}
        {moment(application.createdAt).fromNow()}
      </div>
      <div className="text-sm md:text-xs text-gray-600">
        {summary}
        {hasMore && "..."}
      </div>
    </div>
  );
};

export default ApplicationPreview;
