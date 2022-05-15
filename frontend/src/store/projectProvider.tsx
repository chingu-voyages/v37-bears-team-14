import { useReducer } from "react";
import { Project } from "../shared/Interfaces";
import ProjectContext from "./project-context";

enum ProjectActionKind {
  StoreProjects = "STORE_PROJECTS",
  AddProject = "ADD_PROJECT",
}

const defaultProjectState = {
  projects: [],
  project: {},
};

const projectReducer = (state: any, action: any) => {
  switch (action.type) {
    case ProjectActionKind.StoreProjects:
      return {
        projects: action.projects,
        project: state.project,
      };
    case ProjectActionKind.AddProject:
      return {
        projects: [action.project, ...state.projects],
        project: action.project,
      };
  }
};

const ProjectProvider = (props: any) => {
  const [projectState, dispatchProjectAction] = useReducer(
    projectReducer,
    defaultProjectState
  );

  const storeProjectsHandler = (projects: Project[]) => {
    dispatchProjectAction({
      type: "STORE_PROJECTS",
      projects,
    });
  };

  const addProject = (project: Project) => {
    dispatchProjectAction({
      type: "ADD_PROJECT",
      project,
    });
  };

  const projectContext = {
    storeProjects: storeProjectsHandler,
    addProject: addProject,
    projects: projectState?.projects,
    project: projectState?.project,
  };

  return (
    <ProjectContext.Provider value={projectContext}>
      {props.children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
