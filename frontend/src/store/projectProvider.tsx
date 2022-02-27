import { useReducer } from "react";
import ProjectContext from "./project-context";

const defaultProjectState = {
  projects: [],
  searchResults: [],
};
const projectReducer = (state: any, action: any) => {
  if (action.type === "STORE_PROJECTS") {
    return {
      projects: action.projects,
      searchResults: state.searchResults,
    };
  }
  if (action.type === "STORE_SEARCH_RESULTS") {
    return {
      projects: state.projects,
      searchResults: action.searchResults,
    };
  }
};

const ProjectProvider = (props: any) => {
  const [projectState, dispatchProjectAction] = useReducer(
    projectReducer,
    defaultProjectState
  );
  const updateProjects = (projects: any) => {
    dispatchProjectAction({
      type: "STORE_PROJECTS",
      projects,
    });
  };

  const updateSearchResults = (searchResults: any) => {
    dispatchProjectAction({
      type: "STORE_SEARCH_RESULTS",
      searchResults,
    });
  };
  const projectContext = {
    updateProjects: updateProjects,
    updateSearchResults: updateSearchResults,
    //@ts-ignore
    projects: projectState.projects,
    //@ts-ignore
    searchResults: projectState.searchResults,
  };
  return (
    <ProjectContext.Provider value={projectContext}>
      {props.children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
