import React, { useEffect, useState, FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { Project } from "../../shared/Interfaces";
import LoadingSpinner from "../Spinners/LoadingSpinner";
import ProjectNotFound from "./ProjectNotFound";
import ProjectLanding from "./ProjectLanding";

const ProjectPage: FunctionComponent = () => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
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
    console.error("Missing project!", projectId, project);
    return <ProjectNotFound />;
  }

  return (
    <section className="w-full">
      <div className="flex flex-col-reverse md:flex-row">
        <main className="basis-3/4">
          <ProjectLanding project={project} />
        </main>
        <aside className="basis-1/4"></aside>
      </div>
    </section>
  );
};

export default ProjectPage;
