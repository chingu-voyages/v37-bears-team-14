import { FC } from "react";
import { Application } from "../../../../../shared/Interfaces";
import ArrowLeftIcon from "../../../../icons/ArrowLeftIcon";
import { Link } from "react-router-dom";
import moment from "moment";
import Readme from "../../../../formatting/Readme";
import ApplicationStatus from "./ApplicationStatus";

interface ApplicationProps {
  application: Application;
}

const ApplicationDisplay: FC<ApplicationProps> = ({ application }) => {
  return (
    <div className="mx-3 my-4 md:mx-8 mb-12">
      <div className="mb-3 text-slate-500 hover:text-slate-900">
        <Link
          to={"/projects/" + application.project.id + "/applications"}
          className="flex"
        >
          <ArrowLeftIcon className="h-3 inline-block mt-1 mr-1" />
          <div className="text-sm mt-[0.03em]">All Applications</div>
        </Link>
      </div>
      <div className="my-3">
        <div className="">
          {application.user.username} ({application.requestedRole})
        </div>
        <div className="text-sm" title={moment(application.createdAt).format()}>
          Applied {moment(application.createdAt).fromNow()}
        </div>
        <ApplicationStatus status={application.status} />
      </div>
      <div className="font-semibold text-sm my-1">Message</div>
      <div className="border-[1px] border-slate-300 rounded p-3">
        {application.content ? (
          <Readme>{application.content}</Readme>
        ) : (
          <div className="text-slate-400">No message</div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDisplay;
