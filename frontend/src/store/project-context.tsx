// ProjectContext is not currently being used, but is kept here for future reference incase it is useful.

import React from "react";

const ProjectContext = React.createContext({
  updateProjects: (projects: any) => {},
  updateSearchResults: (searchResults: any) => {},
  projects: [],
  searchResults: [],
});

export default ProjectContext;
