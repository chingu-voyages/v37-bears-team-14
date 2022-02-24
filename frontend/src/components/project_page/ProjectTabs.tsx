import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import useMember from "./useMember";

export interface ProjectTabsProps {
  projectId: string;
}

const ProjectTabs: FunctionComponent<ProjectTabsProps> = ({ projectId }) => {
  const { isMember, member } = useMember(projectId);
  const isOwner = isMember && member && member.roleName === "owner";

  return (
    <>
      <Link
        className="pb-2 text-slate-700 hover:text-slate-900 hover:border-b-2 border-orange-400 mr-2"
        to=""
      >
        Stack
      </Link>
      {isOwner ? (
        <Link
          className="pb-2 text-slate-700 hover:text-slate-900 hover:border-b-2 border-orange-400 mr-2"
          to="settings"
        >
          Settings
        </Link>
      ) : (
        <div className="pb-2 text-slate-700 hover:text-slate-900 hover:border-b-2 border-orange-400 mr-2 inline cursor-not-allowed opacity-60">
          Settings
        </div>
      )}
    </>
  );
};

export default ProjectTabs;
