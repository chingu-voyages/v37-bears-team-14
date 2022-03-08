import React, {
  useEffect,
  useState,
  FunctionComponent,
  useContext,
} from "react";
import { Link } from "react-router-dom";
import NewProject from "./NewProject";
import ProjectContext from "../../store/project-context";
import ProjectPreview from "./ProjectPreview";

import isEqual from "react-fast-compare";
import { Project } from "../../shared/Interfaces";
import LoadingSpinner from "../Spinners/LoadingSpinner";

const Projects: FunctionComponent = () => {
  const [projects, setProjects] = useState<Project[] | []>([]);
  const [loading, setLoading] = useState(false);

  const addProject = (project: Project) => {
    console.log(project);
    setProjects([project, ...projects]);
  };
  // const projectCtx = useContext<any>(ProjectContext);
  useEffect(() => {
    setLoading(true);
    fetch("api/v1/projects").then(async (response) => {
      if (response.status === 200) {
        setLoading(false);
        const data = await response.json();
        if (!isEqual(projects, data)) {
          setProjects(data);
          // projectCtx.storeProjects(data);
          // console.log(projectCtx);
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
          <section className="w-full">
            <div className="flex flex-col-reverse md:flex-row">
              <main className="basis-3/4">
                <ProjectPreview projects={projects} />
              </main>
              <aside className="basis-1/4">
                <NewProject addProject={addProject} />
                <Link to={"search"}>
                  <div className="w-full bg-medGray border-t-[1px] border-mintGreen">
                    <div className="p-1">
                      <span className="p-2 text-mintGreen">
                        Search Projects
                      </span>
                    </div>
                  </div>
                </Link>
              </aside>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Projects;
