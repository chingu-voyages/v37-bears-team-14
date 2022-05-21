import React, { useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Comment, Project, User } from "../../shared/Interfaces";
import ProjectContext from "../../store/project-context";
interface Props {
  comment: Comment;
  project: Project;
  user: User;
  setEditField: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditForm: React.FC<Props> = ({
  comment,
  project,
  user,
  setEditField,
}) => {
  const projectCtx = useContext(ProjectContext);
  return (
    <Formik
      initialValues={{
        id: comment.id,
        commentText: comment.commentText,
        project: project.id,
        user: user!.id,
        parentId: comment.id,
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
          projectCtx.refreshComments(project);
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
            className="editField"
          />
          {errors.commentText && touched.commentText && errors.commentText}
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
  );
};

export default EditForm;
