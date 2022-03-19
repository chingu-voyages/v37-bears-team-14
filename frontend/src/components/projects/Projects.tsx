import React, {
  useEffect,
  useState,
  FunctionComponent,
  useContext,
} from "react";
import { Link } from "react-router-dom";
import { useSession } from "../../hooks/session";
import NewProject from "./NewProject";
import ProjectContext from "../../store/project-context";
import ProjectPreview from "./ProjectPreview";
import { Project } from "../../shared/Interfaces";
import isEqual from "react-fast-compare";
import LoadingSpinner from "../Spinners/LoadingSpinner";

type PreviewState = "mine" | "recent" | "developer" | "designer";

const Projects: FunctionComponent = () => {
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, user } = useSession();
  const projectCtx = useContext<any>(ProjectContext);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [ownerProjects, setOwnerProjects] = useState<Project[]>();
  const [designerProjects, setDesignerProjects] = useState<Project[]>();
  const [developerProjects, setDeveloperProjects] = useState<Project[]>();
  const [projectPreviews, setProjectPreviews] = useState<Project[]>(
    projectCtx.projects
  );

  useEffect(() => {
    setLoading(true);
    fetch("api/v1/projects").then(async (response) => {
      if (response.status === 200) {
        setLoading(false);
        const data = await response.json();
        if (!isEqual(projectCtx.projects, data)) {
          projectCtx.storeProjects(data);
        }

        return response;
      }
    });
    if (user)
      fetch(`/api/v1/members?user=${user?.id}`).then(async (response) => {
        if (response.status === 200) {
          const data = await response.json();

          setAllProjects(data);
          //setOwnerProjects(data.filter((d)=> d.))
        }
      });
  }, [projectCtx]);

  //let projectPreviews = projectCtx.projects;
  const setMyProjects = () => {
    decidePreviews("mine");
  };

  const decidePreviews = (filterString: PreviewState) => {
    switch (filterString) {
      case "recent": {
        setProjectPreviews(projectCtx.projects);
        break;
      }
      case "mine": {
        setProjectPreviews(allProjects);
        console.log(projectPreviews);
        break;
      }
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <section className="w-full">
            <div className="flex flex-col-reverse md:flex-row">
              <main className="basis-3/4">
                <ProjectPreview projects={projectCtx.projects} />
              </main>
              <aside className="basis-1/4">
                <NewProject />
                <Link to={"search"}>
                  <div className="w-full bg-medGray border-t-[1px] border-mintGreen">
                    <div className="p-1">
                      <span className="p-2 text-mintGreen">
                        Search Projects
                      </span>
                    </div>
                  </div>
                </Link>
                <Link to={"my-projects"}>
                  <div
                    className="w-full bg-medGray border-t-[1px] border-mintGreen cursor-pointer"
                    onClick={() => setMyProjects()}
                  >
                    <div className="p-1">
                      <span className="p-2 text-mintGreen">My Projects</span>
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
