import React, {
  useEffect,
  useState,
  FunctionComponent,
  Dispatch,
  SetStateAction,
} from "react";
import { Outlet, useParams } from "react-router-dom";
import { Project } from "../../../shared/Interfaces";
import LoadingSpinner from "../../Spinners/LoadingSpinner";
import ProjectNotFound from "../components/ProjectNotFound";
import ProjectTabs from "../components/ProjectTabs";
import ProjectHeader from "../components/ProjectHeader";

export interface ProjectPageContext {
  project: Project;
  setProject: Dispatch<SetStateAction<Project>>;
}

const ProjectPageLayout: FunctionComponent = () => {
  const { projectId } = useParams();
  // Initial state is loading.
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [project, setProject] = useState<null | Project>(null);

  useEffect(() => {
    const getProject = async (id: string) => {
      setLoading(true);
      const resp = await fetch("/api/v1/projects/" + id);

      if (resp.status === 200) {
        const project = await resp.json();
        setProject(project);
      } else if (resp.status === 404) {
        setNotFound(true);
      } else {
        console.error("Failed to get project", resp);
      }

      setLoading(false);
    };

    if (!projectId) {
      setNotFound(true);
    } else {
      getProject(projectId).catch((err) => console.error(err));
    }
  }, [projectId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (notFound) {
    return <ProjectNotFound />;
  }

  if (!project) {
    // Something went wrong!
    console.error("Missing project!", loading, notFound, projectId, project);
    return <ProjectNotFound />;
  }

  return (
    <section className="w-full">
      <div className="py-2 mx-3 md:py-3 md:mx-8">
        <ProjectHeader project={project} />
      </div>

      <div className="_bg-white _slate-100">
        <div className="pb-2 mt-2 mx-3 md:mt-3 md:mx-8">
          <ProjectTabs projectId={projectId || project.id} />
        </div>
      </div>

      <div className="bg-white">
        <Outlet context={{ project, setProject }} />
      </div>
    </section>
  );
};

export default ProjectPageLayout;
