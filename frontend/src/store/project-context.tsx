// ProjectContext is not currently being used, but is kept here for future reference incase it is useful.

import React from "react";

const ProjectContext = React.createContext({
  storeProjects: (projects: any) => {},
  addProject: (project: any) => {},
  projects: [],
  project: {},
});

export default ProjectContext;
