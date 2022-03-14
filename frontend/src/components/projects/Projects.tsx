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
import { useSession } from "../../hooks/session";
import isEqual from "react-fast-compare";

import LoadingSpinner from "../Spinners/LoadingSpinner";
import { userInfo } from "os";

const Projects: FunctionComponent = () => {
  const { isLoggedIn, user } = useSession();
  const [loading, setLoading] = useState(false);

  const projectCtx = useContext<any>(ProjectContext);
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
    if (user) {
      console.log(user);
      fetch("/api/v1/projects/getStarred", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user.id }),
      });
    }
  }, [projectCtx]);

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
              </aside>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Projects;
