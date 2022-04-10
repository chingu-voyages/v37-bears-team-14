import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ProjectPageContext } from "../../layouts/ProjectPageLayout";
import ProjectShowcase from "./components/ProjectShowcase";
import CommentForm from "../../../comments/CommentForm";
import { Comment } from "../../../../shared/Interfaces";
import NewComment from "../../../comments/NewComment";
import ApplyButtonContainer from "../../components/ApplyFlow/ApplyButtonContainer";
import StarButton from "./components/StarButton";

const ProjectLandingPage = () => {
  const [comments, setComments] = useState<any>([]);
  const [commentCount, setCommentCount] = useState(0);
  const { project, setProject } = useOutletContext<ProjectPageContext>();

  useEffect(() => {
    fetch(`/api/v1/projects/${project.id}/comments`).then(async (response) => {
      if (response.status === 200) {
        const data: any = await response.json();
        const commentsArray: Comment[] = [];
        let comment: Comment;
        //@ts-ignore
        for (comment of Object.values(data.comments)) {
          commentsArray.push(comment);
        }
        setComments(commentsArray);
        setCommentCount(data.count);
      }
    });
  }, []);

  const displayComments = (allComments: any) => {
    let comments: any = [];

    //@ts-ignore
    for (let comment of Object.values(allComments)) {
      comments.push(
        //@ts-ignore
        <CommentForm comment={comment} key={comment.id} project={project} />
      );
      //@ts-ignore
      if (comment.children && Object.keys(comment.children).length > 0) {
        //@ts-ignore
        let replies = displayComments(comment.children);
        comments = comments.concat(replies);
      }
    }
    console.log(comments);
    return comments;
  };

  let commentsToDisplay = displayComments(comments);

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
      <NewComment project={project} />
      <div className="mb-2">
        {commentsToDisplay}
        {/* {comments.comments.map((c: any) => (
          <CommentForm comment={c} project={project} />
        ))} */}
      </div>
    </>
  );
};

export default ProjectLandingPage;
