import { Project } from "../shared/Interfaces";
import React from "react";

const ProjectContext = React.createContext({
  storeProjects: (projects: Project[]) => {},
  addProject: (project: Project) => {},
  refreshComments: (project: Project) => {},
  projects: [],
  project: {},
  comments: [],
});

export default ProjectContext;
