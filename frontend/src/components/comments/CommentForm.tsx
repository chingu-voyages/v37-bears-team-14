import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import moment from "moment";
import EditLink from "../controls/EditLink";
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
  const { isLoggedIn, user } = useSession();
  let marginleft = (comment.depth - 1) * 5 + "%";
  return (
    <>
      <div
        className="p-2 rounded-lg border-2 border-slate-500 mt-2 mb-2 flex"
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
          <div className="mb-2">{comment.commentText}</div>
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
                    className="appearance-none border-b-2 border-darkGray bg-XLightGray w-full py-2 px-3 text-gray-700 leading-tight resize-none focus:outline-none focus:shadow-outline"
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
            <div className="flex">
              <button
                onClick={() => setReplyField(true)}
                className="orange-badge-btn disabled:opacity-50"
              >
                reply
              </button>
              <EditLink onClick={() => setReplyField(false)} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommentForm;
