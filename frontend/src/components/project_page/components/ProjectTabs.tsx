import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import useMember from "../hooks/useMember";

type ClassNameFunction = (props: { isActive: boolean }) => string;

export interface ProjectTabsProps {
  projectId: string;
}

const ProjectTabs: FunctionComponent<ProjectTabsProps> = ({ projectId }) => {
  const { isMember, member } = useMember(projectId);
  const isOwner = isMember && member && member.roleName === "owner";

  const tabClassNameFunc: ClassNameFunction = ({ isActive }) =>
    (isActive ? "border-b-2 font-bold text-slate-900" : "text-slate-700") +
    " px-3 pb-2 hover:text-slate-900 hover:border-b-2 border-emerald-400";

  const classNameDisabled =
    "px-3 pb-2 text-slate-700 inline cursor-not-allowed opacity-60";

  return (
    <>
      <NavLink className={tabClassNameFunc} to="" end>
        Stack
      </NavLink>

      {isOwner ? (
        <NavLink className={tabClassNameFunc} to="applications">
          Applications
        </NavLink>
      ) : (
        <div className={classNameDisabled}>Applications</div>
      )}

      {isOwner ? (
        <NavLink className={tabClassNameFunc} to="settings">
          Settings
        </NavLink>
      ) : (
        <div className={classNameDisabled}>Settings</div>
      )}
    </>
  );
};

export default ProjectTabs;
