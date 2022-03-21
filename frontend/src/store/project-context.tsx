// ProjectContext is not currently being used, but is kept here for future reference incase it is useful.
import { Project } from "../shared/Interfaces";
import React from "react";

const ProjectContext = React.createContext({
  storeProjects: (projects: Project[]) => {},
  addProject: (project: Project) => {},
  projects: [],
  project: {},
});

export default ProjectContext;
