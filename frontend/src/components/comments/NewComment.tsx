import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Project } from "../../shared/Interfaces";
import { useSession } from "../../hooks/session";
import * as Yup from "yup";

interface Props {
  project: Project;
  refreshComments: (project: Project) => void;
}
const NewComment: React.FC<Props> = ({ project, refreshComments }) => {
  const { isLoggedIn, user } = useSession();
  const [focused, setFocused] = useState(false);
  return (
    <>
      {isLoggedIn && (
        <Formik
          initialValues={{
            commentText: "",
            project: project.id,
            user: user!.id,
          }}
          validationSchema={Yup.object().shape({
            commentText: Yup.string()
              .min(1, "Can't submit a blank comment")
              .max(1000, "Comment is too long"),
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
              setSubmitting(false);
              setFocused(false);
              refreshComments(project);
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
          }) => (
            <Form onSubmit={handleSubmit}>
              <Field
                as="textarea"
                name="commentText"
                onChange={handleChange}
                value={values.commentText}
                rows="1"
                placeholder="Add a comment"
                className="appearance-none border-b-2 border-medGray bg-XLightGray w-full py-2 px-3 text-gray-700 leading-tight resize-none focus:outline-none focus:shadow-outline focus:border-blue-500"
                onFocus={() => setFocused(true)}
              />
              <div className="text-xs leading-tight">
                {errors.commentText &&
                  touched.commentText &&
                  errors.commentText}
              </div>
              {focused && (
                <div className="flex justify-end">
                  <button
                    className="trans-btn mb-0"
                    onClick={() => setFocused(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="main-btn disabled:opacity-50 mr-0 mb-0"
                    disabled={isSubmitting || !dirty}
                  >
                    Submit
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default NewComment;
