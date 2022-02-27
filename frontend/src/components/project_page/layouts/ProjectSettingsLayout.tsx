import {
  NavLink,
  Outlet,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import LoadingSpinner from "../../Spinners/LoadingSpinner";
import useMember from "../hooks/useMember";
import { ProjectPageContext } from "./ProjectPageLayout";

const ProjectSettingsNavLink = (props: any) => (
  <NavLink
    {...props}
    className={({ isActive }) =>
      (isActive ? "bg-slate-100 font-semibold border-l-4" : "") +
      " px-2 py-1 rounded hover:bg-slate-200 border-emerald-400 my-[1px]"
    }
  />
);

const ProjectSettingsLayout = () => {
  const context = useOutletContext<ProjectPageContext>();
  const { project } = context;
  const { loading, isMember, member } = useMember(project.id);
  const isOwner = isMember && member && member.roleName === "owner";
  const navigate = useNavigate();

  if (!loading && !isOwner) {
    navigate("/projects/" + project.id);
  }

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex flex-col mx-3 my-5 md:mx-8 md:w-60">
        <ProjectSettingsNavLink to="project">Project</ProjectSettingsNavLink>
        <ProjectSettingsNavLink to="team">Team</ProjectSettingsNavLink>
      </div>
      <Outlet context={context} />
    </div>
  );
};

export default ProjectSettingsLayout;
