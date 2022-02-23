import React, { useEffect, useState, FunctionComponent } from "react";
import NewProject from "./NewProject";
import ProjectPreview from "./ProjectPreview";
import ProjectSearch from "./ProjectSearch";
import isEqual from "react-fast-compare";
import { Project } from "../../shared/Interfaces";
import LoadingSpinner from "../Spinners/LoadingSpinner";

const Projects: FunctionComponent = () => {
  const [projects, setProjects] = useState<Project[] | []>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch("api/v1/projects").then(async (response) => {
      if (response.status === 200) {
        setLoading(false);
        const data = await response.json();
        if (!isEqual(projects, data)) setProjects(data);

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
            {/* <div className="block md:hidden">
              <NewProject />
              <ProjectSearch />
            </div> */}
            <div className="grid md:grid-cols-12">
              <main className="md:col-span-9 p-1">
                <ProjectPreview projects={projects} />
              </main>
              <aside className="hidden md:block md:col-span-3 md:pt-0">
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
