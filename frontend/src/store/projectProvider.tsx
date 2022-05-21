import { useReducer } from "react";
import { Project, CommentData, Comment } from "../shared/Interfaces";
import ProjectContext from "./project-context";

enum ProjectActionKind {
  StoreProjects = "STORE_PROJECTS",
  AddProject = "ADD_PROJECT",
  RefreshComments = "REFRESH_COMMENTS",
  Comments = "COMMENTS",
}

const defaultProjectState = {
  projects: [],
  project: {},
  comments: [],
};

const projectReducer = (state: any, action: any) => {
  switch (action.type) {
    case ProjectActionKind.StoreProjects:
      return {
        projects: action.projects,
        project: state.project,
        comments: state.comments,
      };
    case ProjectActionKind.AddProject:
      return {
        projects: [action.project, ...state.projects],
        project: action.project,
        comments: state.comments,
      };
    case ProjectActionKind.RefreshComments:
      return {
        projects: state.projects,
        project: state.project,
        comments: action.r,
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

  const refreshCommentsHandler = (project: Project) => {
    const newComments = async () => {
      const response = await fetch(`/api/v1/projects/${project.id}/comments`);
      if (response.status === 200) {
        const data: CommentData = await response.json();
        const commentsArray: Comment[] = [];
        let comment: Comment;

        for (comment of Object.values(data.comments)) {
          commentsArray.push(comment);
        }

        return commentsArray.sort(function (a, b) {
          return (
            new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
          );
        });
      }
    };
    newComments().then((r) => {
      dispatchProjectAction({
        type: "REFRESH_COMMENTS",
        r,
      });
    });
  };

  const projectContext = {
    storeProjects: storeProjectsHandler,
    addProject: addProject,
    refreshComments: refreshCommentsHandler,
    projects: projectState?.projects,
    project: projectState?.project,
    comments: projectState?.comments,
  };

  return (
    <ProjectContext.Provider value={projectContext}>
      {props.children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;
