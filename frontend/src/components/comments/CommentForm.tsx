import React, { useState, useContext } from "react";
import moment from "moment";
import EditLink from "../controls/EditLink";
import DeleteLink from "../controls/DeleteLink";
import CommentLink from "../controls/CommentLink";
import LikeLink from "../controls/LikeLink";
import DislikeLink from "../controls/DislikeLink";
import { Comment, Project } from "../../shared/Interfaces";
import { useSession } from "../../hooks/session";
import { Link } from "react-router-dom";
import ProjectContext from "../../store/project-context";
import ReplyForm from "./ReplyForm";
import EditForm from "./EditForm";

interface Props {
  comment: Comment;
  project: Project;
}

type LikeType = "like" | "dislike";
type RemoveType = "removeLike" | "removeDislike";
const CommentForm: React.FC<Props> = ({ comment, project }) => {
  const [replyField, setReplyField] = useState(false);
  const [editField, setEditField] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const { isLoggedIn, user } = useSession();
  const [commentLikes, setCommentLikes] = useState<string[]>(comment.likes);
  const [commentDislikes, setCommentDislikes] = useState<string[]>(
    comment.dislikes
  );
  const projectCtx = useContext(ProjectContext);

  let marginleft = (comment.depth - 1) * 5 + "%";

  const deleteComment = (comment: Comment) => {
    fetch(`/api/v1/projects/${project.id}/comment/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    }).then(() => {
      setDeleteMessage(false);

      projectCtx.refreshComments(project);
    });
  };

  const likeDislikeComment = (currentComment: Comment, likeType: LikeType) => {
    fetch(`/api/v1/projects/${project.id}/comment/${likeType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: currentComment,
        user: user,
        project: project,
      }),
    });
    likeType === "like"
      ? setCommentLikes((likes) => [...likes, user!.id])
      : setCommentDislikes((dislikes) => [...dislikes, user!.id]);
    projectCtx.refreshComments(project);
  };

  const removeLikeDislike = (comment: Comment, removeType: RemoveType) => {
    fetch(`/api/v1/projects/${project.id}/comment/${removeType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: comment,
        user: user,
      }),
    });
    removeType === "removeLike"
      ? setCommentLikes((likes) =>
          likes.filter((userId) => userId !== user!.id)
        )
      : setCommentDislikes((dislikes) =>
          dislikes.filter((userId) => userId !== user!.id)
        );
    projectCtx.refreshComments(project);
  };
  return (
    <>
      <div className="commentAvatarWrapper" style={{ marginLeft: marginleft }}>
        <div>
          <Link to={`/user/${comment.user?.username}`}>
            <img
              src={comment.user.avatarUrl}
              className="commentAvatar"
              alt=""
            />
          </Link>
        </div>

        <div className="grow ml-2">
          <div className="flex items-baseline">
            <div className="font-bold float-left">
              <Link to={`/user/${comment.user?.username}`}>
                {comment.user.displayName}
              </Link>
            </div>
            <div className="ml-2 text-xs">
              {moment(comment.postedDate).fromNow()}
            </div>
          </div>
          {editField && user ? (
            <EditForm
              comment={comment}
              project={project}
              user={user}
              setEditField={setEditField}
            />
          ) : (
            <>
              <div className="mb-2">
                {comment.deleted ? "*Deleted*" : comment.commentText}
              </div>
              {deleteMessage && (
                <>
                  <div className="mb-2">
                    <span className="commentDeleteMessage">
                      Are you sure you want to delete this comment?
                    </span>
                    <br />
                  </div>
                  <div className="flex">
                    <button
                      type="submit"
                      className="orange-badge-btn mr-1 disabled:opacity-50"
                      onClick={() => deleteComment(comment)}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteMessage(false)}
                      className="red-badge-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {replyField && isLoggedIn && user ? (
            <ReplyForm
              comment={comment}
              project={project}
              user={user}
              setReplyField={setReplyField}
            />
          ) : (
            !editField &&
            !deleteMessage &&
            isLoggedIn &&
            !comment.deleted && (
              <div className="flex">
                <LikeLink
                  onClick={() => {
                    if (commentLikes.includes(user!.id)) {
                      removeLikeDislike(comment, "removeLike");
                    } else {
                      commentDislikes.includes(user!.id) &&
                        removeLikeDislike(comment, "removeDislike");

                      likeDislikeComment(comment, "like");
                    }
                  }}
                  filled={commentLikes.includes(user!.id)}
                  text={commentLikes.length.toString()}
                  classes={"mr-2"}
                />
                <DislikeLink
                  onClick={() => {
                    if (commentDislikes.includes(user!.id)) {
                      removeLikeDislike(comment, "removeDislike");
                    } else {
                      commentLikes.includes(user!.id) &&
                        removeLikeDislike(comment, "removeLike");

                      likeDislikeComment(comment, "dislike");
                    }
                  }}
                  filled={commentDislikes.includes(user!.id)}
                  text={commentDislikes.length.toString()}
                  classes={"mr-2"}
                />
                <CommentLink onClick={() => setReplyField(true)} text="Reply" />
                {comment.user.id === user!.id && (
                  <>
                    <EditLink onClick={() => setEditField(true)} />
                    <DeleteLink onClick={() => setDeleteMessage(true)} />
                  </>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default CommentForm;
