import React from "react";
import { Formik } from "formik";

function ProjectSearch() {
  return (
    <div>
      <h1>Anywhere in your app!</h1>
      <Formik
        initialValues={{ search: "" }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
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
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.search}
            />
            {errors.search && touched.search && errors.search}

            <button type="submit" disabled={isSubmitting}>
              Search
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default ProjectSearch;
