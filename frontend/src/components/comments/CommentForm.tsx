import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import moment from "moment";
import EditLink from "../controls/EditLink";
import DeleteLink from "../controls/DeleteLink";
import CommentLink from "../controls/CommentLink";
import { Comment, Project } from "../../shared/Interfaces";
import { useSession } from "../../hooks/session";

interface Props {
  comment: Comment;
  project: Project;
  refreshComments: () => void;
}
const CommentForm: React.FC<Props> = ({
  comment,
  project,
  refreshComments,
}) => {
  const [replyField, setReplyField] = useState(false);
  const [editField, setEditField] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const { isLoggedIn, user } = useSession();
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

      refreshComments();
    });
  };
  return (
    <>
      <div
        className="p-2 rounded-lg border-2 border-medGray mt-1 mb-2 flex"
        style={{ marginLeft: marginleft }}
      >
        <div>
          <img
            src={comment.user.avatarUrl}
            className="rounded-full border-gray-100 shadow-sm w-12 h-12 inline cursor-pointer border-transparent border-4"
            alt=""
          />
        </div>
        <div className="grow ml-2">
          <div className="flex items-baseline">
            <div className="font-bold float-left">
              {comment.user.displayName}
            </div>
            <div className="ml-2 text-xs">
              {moment(comment.postedDate).fromNow()}
            </div>
          </div>
          {editField ? (
            <Formik
              initialValues={{
                _id: comment._id,
                commentText: comment.commentText,
                project: project.id,
                user: user!.id,
                parentId: comment._id,
                depth: comment.depth + 1,
              }}
              validationSchema={Yup.object().shape({
                commentText: Yup.string().max(1000, "Too Long!"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                //edit comment
                comment.commentText = values.commentText;
                values.user = user!.id;
                values.project = project!.id;
                fetch(`/api/v1/projects/${project.id}/comment/edit`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(values),
                }).then(() => {
                  values.commentText = "";
                  setEditField(false);
                  setSubmitting(false);
                  refreshComments();
                });
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                dirty,

                /* and other goodies */
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Field
                    as="textarea"
                    name="commentText"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.commentText}
                    rows="1"
                    placeholder="Add a comment"
                    className="appearance-none border-b-2 border-medGray bg-XLightGray w-full pt-2 pb-1 px-3 text-gray-700 leading-tight resize-none focus:outline-none focus:shadow-outline"
                  />
                  {errors.commentText &&
                    touched.commentText &&
                    errors.commentText}
                  <div className="flex">
                    <button
                      type="submit"
                      className="orange-badge-btn mr-1 disabled:opacity-50"
                      disabled={isSubmitting || !dirty}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setEditField(false)}
                      className="red-badge-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <>
              <div className="mb-2">{comment.commentText}</div>
              {deleteMessage && (
                <>
                  <div className="mb-2">
                    <span className="p-1 shrink bg-lightGray text-medGray font-bold rounded">
                      Are you sure you want to delete this comment?
                    </span>
                    <br />
                    <span className="text-xs">
                      *Deleting a comment will delete all replys to the deleted
                      comment
                    </span>
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

          {replyField && isLoggedIn ? (
            <Formik
              initialValues={{
                commentText: "",
                project: project.id,
                user: user!.id,
                parentId: comment._id,
                depth: comment.depth + 1,
              }}
              validationSchema={Yup.object().shape({
                commentText: Yup.string().max(1000, "Too Long!"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                values.user = user!.id;
                values.project = project!.id;
                fetch(`/api/v1/projects/${project.id}/comment`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(values),
                }).then(() => {
                  values.commentText = "";
                  setReplyField(false);
                  setSubmitting(false);
                  refreshComments();
                });
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                dirty,

                /* and other goodies */
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Field
                    as="textarea"
                    name="commentText"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.commentText}
                    rows="1"
                    placeholder="Add a comment"
                    className="appearance-none border-b-2 border-medGray bg-XLightGray w-full pt-2 pb-1 px-3 text-gray-700 leading-tight resize-none focus:outline-none focus:shadow-outline"
                  />
                  {errors.commentText &&
                    touched.commentText &&
                    errors.commentText}
                  <div className="flex">
                    <button
                      type="submit"
                      className="orange-badge-btn mr-1 disabled:opacity-50"
                      disabled={isSubmitting || !dirty}
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => setReplyField(false)}
                      className="red-badge-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            !editField &&
            !deleteMessage && (
              <div className="flex">
                <CommentLink onClick={() => setReplyField(true)} text="Reply" />
                <EditLink onClick={() => setEditField(true)} />
                <DeleteLink onClick={() => setDeleteMessage(true)} />
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default CommentForm;
