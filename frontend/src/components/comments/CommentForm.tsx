import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Comment, Project } from "../../shared/Interfaces";
import { useSession } from "../../hooks/session";
interface Props {
  comment: Comment;
  project: Project;
}
const CommentForm: React.FC<Props> = ({ comment, project }) => {
  const [replyField, setReplyField] = useState(false);
  const { isLoggedIn, user } = useSession();
  console.log(comment);
  return (
    <>
      <div className="p-2 rounded-lg border-2 border-slate-500 mt-2 mb-2 flex">
        <div>
          <img
            src={comment.user.avatarUrl}
            className="rounded-full border-gray-100 shadow-sm w-12 h-12 inline cursor-pointer border-transparent border-4"
            alt=""
          />
        </div>
        <div className="grow ml-2">
          <div className="font-bold">{comment.user.displayName}</div>
          <div className="mb-2">{comment.commentText}</div>
          {replyField ? (
            <Formik
              initialValues={{
                commentText: "",
                project: project.id,
                user: user!.id,
                parentId: comment.id,
                depth: comment.depth + 1,
              }}
              validationSchema={Yup.object().shape({
                commentText: Yup.string().max(1000, "Too Long!"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                values.user = user!.id;
                values.project = project!.id;
                console.log(values);
                fetch(`/api/v1/projects/${project.id}/comment`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(values),
                });

                setSubmitting(false);
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
                    className="appearance-none border-b-2 border-darkGray bg-XLightGray w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {errors.commentText &&
                    touched.commentText &&
                    errors.commentText}
                  <div className="flex">
                    <button
                      onClick={() => setReplyField(false)}
                      className="small-red-btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="small-orange-btn"
                      disabled={isSubmitting}
                    >
                      Reply
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <button
              onClick={() => setReplyField(true)}
              //"bg-amber-500 text-white active:bg-amber-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              className="small-orange-btn"
            >
              reply
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CommentForm;
