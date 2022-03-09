// ProjectContext is not currently being used, but is kept here for future reference incase it is useful.
import { useReducer } from "react";

import ProjectContext from "./project-context";
// import { Project } from "../shared/Interfaces";

// const initialProjects: Project[] = [];

enum ProjectActionKind {
  StoreProjects = "STORE_PROJECTS",
  AddProject = "ADD_PROJECT",
}

// interface ProjectState {
//   projects: Project[] | [];
//   project: Project | {};
// }

// type ProjectAction =
//   | {
//       type: ProjectActionKind.StoreProjects;
//       projects: Project[] | [];
//       project: Project | object;
//     }
//   | {
//       type: ProjectActionKind.AddProject;
//       project: Project | object;
//       projects: Project[] | [];
//     };

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

export const ProjectProvider = (props: any) => {
  const [projectState, dispatchProjectAction] = useReducer(
    projectReducer,
    defaultProjectState
  );

  const storeProjectsHandler = (projects: any) => {
    dispatchProjectAction({
      type: "STORE_PROJECTS",
      projects,
    });
  };

  const addProject = (project: any) => {
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
