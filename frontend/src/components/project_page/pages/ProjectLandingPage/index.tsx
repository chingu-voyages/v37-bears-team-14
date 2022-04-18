import { useEffect, useState, ReactElement } from "react";
import { useOutletContext } from "react-router-dom";
import { ProjectPageContext } from "../../layouts/ProjectPageLayout";
import ProjectShowcase from "./components/ProjectShowcase";
import CommentForm from "../../../comments/CommentForm";
import { Comment } from "../../../../shared/Interfaces";
import NewComment from "../../../comments/NewComment";
import ApplyButtonContainer from "../../components/ApplyFlow/ApplyButtonContainer";
import StarButton from "./components/StarButton";

interface CommentData {
  count: number;
  comments: Comment[];
}
const ProjectLandingPage = () => {
  const [comments, setComments] = useState<any>([]);
  const [commentCount, setCommentCount] = useState(0);
  const { project, setProject } = useOutletContext<ProjectPageContext>();

  const getData = () => {
    fetch(`/api/v1/projects/${project.id}/comments`).then(async (response) => {
      if (response.status === 200) {
        const data: CommentData = await response.json();
        const commentsArray: Comment[] = [];
        let comment: Comment;

        for (comment of Object.values(data.comments)) {
          commentsArray.push(comment);
        }
        setComments(
          commentsArray.sort(function (a, b) {
            return (
              new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
            );
          })
        );
        setCommentCount(data.count);
      }
    });
  };
  useEffect(() => {
    getData();
  }, []);

  // const refreshComments = (newComment: any) => {
  //   if (newComment.depth === 1) {
  //     setComments([newComment, ...comments]);
  //   } else {
  //     console.log(comments);
  //     console.log(newComment);
  //   }
  // };

  const displayComments = (allComments: Comment[]) => {
    let comments: ReactElement[] = [];
    //console.log(allComments);

    for (let comment of Object.values(allComments)) {
      comments.push(
        <CommentForm
          comment={comment}
          key={comment._id}
          project={project}
          refreshComments={getData}
        />
      );

      if (comment.children && Object.keys(comment.children).length > 0) {
        let replies = displayComments(comment.children);
        comments = comments.concat(replies);
      }
    }

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
      <NewComment project={project} refreshComments={getData} />
      <div className="pb-1">{commentsToDisplay}</div>
    </>
  );
};

export default ProjectLandingPage;
