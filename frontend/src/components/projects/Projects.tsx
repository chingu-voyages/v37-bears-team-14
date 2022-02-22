import React, { useEffect, useState, FunctionComponent } from "react";
import NewProject from "./NewProject";
import ProjectPreview from "./ProjectPreview";
import isEqual from "react-fast-compare";
import { Project } from "../../shared/Interfaces";

const Projects: FunctionComponent = () => {
  const [projects, setProjects] = useState<Project[] | []>([]);
  useEffect(() => {
    fetch("api/v1/projects").then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        if (!isEqual(projects, data)) setProjects(data);

        return response;
      }
    });
  }, [projects]);

  return (
    <>
      <NewProject />
      <ProjectPreview projects={projects} />
    </>
  );
};

export default Projects;
