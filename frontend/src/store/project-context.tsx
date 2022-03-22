import { Project } from "../shared/Interfaces";
import React from "react";

const ProjectContext = React.createContext({
  storeProjects: (projects: Project[]) => {},
  addProject: (project: Project) => {},
  projects: [],
  project: {},
});

export default ProjectContext;
