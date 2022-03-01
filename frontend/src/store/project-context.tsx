import React from "react";

const ProjectContext = React.createContext({
  updateProjects: (projects: any) => {},
  updateSearchResults: (searchResults: any) => {},
  projects: [],
  searchResults: [],
});

export default ProjectContext;
