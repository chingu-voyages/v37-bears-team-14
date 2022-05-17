import { useEffect, ReactElement, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import { ProjectPageContext } from "../../layouts/ProjectPageLayout";
import ProjectShowcase from "./components/ProjectShowcase";
import CommentForm from "../../../comments/CommentForm";
import { Comment } from "../../../../shared/Interfaces";
import NewComment from "../../../comments/NewComment";
import ApplyButtonContainer from "../../components/ApplyFlow/ApplyButtonContainer";
import StarButton from "./components/StarButton";
import ProjectContext from "../../../../store/project-context";

const ProjectLandingPage = () => {
  //const [comments, setComments] = useState<any>([]);
  const { project, setProject } = useOutletContext<ProjectPageContext>();
  const projectCtx = useContext(ProjectContext);
  useEffect(() => {
    projectCtx.refreshComments(project);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayComments = (allComments: Comment[]) => {
    let comments: ReactElement[] = [];

    for (let comment of Object.values(allComments)) {
      comments.push(
        <CommentForm comment={comment} key={comment.id} project={project} />
      );

      if (comment.children && Object.keys(comment.children).length > 0) {
        let replies = displayComments(comment.children);
        comments = comments.concat(replies);
      }
    }

    return comments;
  };

  let commentsToDisplay = displayComments(projectCtx.comments);

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row">
        <main className="basis-3/4">
          <ProjectShowcase project={project} setProject={setProject} />
        </main>
        <aside className="basis-1/4">
          <div className="mx-3 my-4 md:mr-8 md:my-8">
            <StarButton project={project}></StarButton>
            <ApplyButtonContainer projectId={project.id} />
          </div>
        </aside>
      </div>
      <NewComment
        project={project}
        refreshComments={() => projectCtx.refreshComments(project)}
      />
      <div className="pb-1">{commentsToDisplay}</div>
    </>
  );
};

export default ProjectLandingPage;
