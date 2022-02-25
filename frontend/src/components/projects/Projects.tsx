import React, {
  useEffect,
  useState,
  FunctionComponent,
  useContext,
} from "react";
import NewProject from "./NewProject";
import ProjectContext from "../../store/project-context";
import ProjectPreview from "./ProjectPreview";
import ProjectSearch from "./ProjectSearch";
import isEqual from "react-fast-compare";
import { Project } from "../../shared/Interfaces";
import LoadingSpinner from "../Spinners/LoadingSpinner";

const Projects: FunctionComponent = () => {
  const [projects, setProjects] = useState<Project[] | []>([]);
  const [loading, setLoading] = useState(false);
  const projectCtx = useContext(ProjectContext);
  useEffect(() => {
    setLoading(true);
    fetch("api/v1/projects").then(async (response) => {
      if (response.status === 200) {
        setLoading(false);
        const data = await response.json();
        if (!isEqual(projects, data)) {
          setProjects(data);
          projectCtx.updateProjects(data);
        }

        return response;
      }
    });
  }, [projects]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* max-w-6xl mx-auto */}
          <section className="w-full">
            <div className="flex flex-col-reverse md:flex-row">
              <main className="basis-3/4">
                <ProjectPreview projects={projects} />
              </main>
              <aside className="basis-1/4">
                <NewProject />
                <ProjectSearch />
              </aside>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Projects;
