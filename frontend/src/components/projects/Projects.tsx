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
import LoadingSpinner from "../Spinners/LoadingSpinner";
import { useSession } from "../../hooks/session";
import { Transition } from "@headlessui/react";

const Projects: FunctionComponent = () => {
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useSession();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Transition
        show={!loading}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <section className="w-full">
            <div className="flex flex-col-reverse md:flex-row">
              <main className="basis-3/4">
                <ProjectPreview projects={projectCtx.projects} />
              </main>
              <aside className="basis-1/4">
                {isLoggedIn && <NewProject />}
                <Link to={"search"}>
                  <div
                    className={`w-full bg-medGray ${
                      isLoggedIn && "border-t-[1px] border-mintGreen"
                    }`}
                  >
                    <div className="p-1">
                      <span className="p-2 text-mintGreen">
                        Search Projects
                      </span>
                    </div>
                  </div>
                </Link>
                {isLoggedIn && (
                  <Link to={"my-projects"}>
                    <div className="w-full bg-medGray border-t-[1px] border-mintGreen cursor-pointer">
                      <div className="p-1">
                        <span className="p-2 text-mintGreen">My Projects</span>
                      </div>
                    </div>
                  </Link>
                )}
              </aside>
            </div>
          </section>
        )}
      </Transition>
    </>
  );
};

export default Projects;
