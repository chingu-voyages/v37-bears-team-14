import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Comment, Project, User } from "../../shared/Interfaces";
interface Props {
  comment: Comment;
  project: Project;
  user: User;
  refreshComments: () => void;
  setReplyField: React.Dispatch<React.SetStateAction<boolean>>;
}
const ReplyForm: React.FC<Props> = ({
  comment,
  project,
  user,
  refreshComments,
  setReplyField,
}) => {
  return (
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
          {errors.commentText && touched.commentText && errors.commentText}
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
  );
};

export default ReplyForm;
