import React from "react";
import { Formik, Form, Field } from "formik";
import { Project } from "../../shared/Interfaces";
import { useSession } from "../../hooks/session";
import * as Yup from "yup";

interface Props {
  project: Project;
}
const NewComment: React.FC<Props> = ({ project }) => {
  const { isLoggedIn, user } = useSession();
  return (
    <>
      <Formik
        initialValues={{ commentText: "", project: project.id, user: user!.id }}
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
            {errors.commentText && touched.commentText && errors.commentText}
            <button type="submit" className="main-btn" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default NewComment;
