import React, { useState, FunctionComponent, useEffect } from "react";

import { Formik } from "formik";
import { ProjectResult } from "../../shared/Interfaces";
import ProjectPreviewSearch from "./ProjectPreviewSearch";
import { useSearchParams } from "react-router-dom";

const ProjectSearch: FunctionComponent = () => {
  const [searchResults, setSearchResults] = useState<ProjectResult[] | []>([]);
  const [params] = useSearchParams();
  const initialQuery = params.get("query") || "";

  useEffect(() => {
    if (!initialQuery) {
      return;
    }

    fetch(`/api/v1/project_search?search=${initialQuery}`).then(
      async (response) => {
        if (response.status === 200) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          console.error(
            "failed to execute search",
            response.status,
            await response.json()
          );
        }
      }
    );
  }, [initialQuery]);

  return (
    <>
      <Formik
        initialValues={{ search: initialQuery }}
        onSubmit={(values, { setSubmitting }) => {
          if (values.search)
            fetch(`/api/v1/project_search?search=${values.search}`).then(
              async (response) => {
                if (response.status === 200) {
                  const data = await response.json();

                  setSearchResults(data);
                  setSubmitting(false);
                } else {
                  console.error(
                    "failed to exicute search",
                    response.status,
                    await response.json()
                  );
                }
              }
            );
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
            <div className="flex items-center justify-center max-w-3xl mx-auto mt-12">
              <input
                type="search"
                name="search"
                className="px-4 py-2 w-full"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.search}
                placeholder="Search Project By Name"
              />
              {errors.search && touched.search && errors.search}
              <button
                className="flex items-center justify-center px-4 py-2 border-l bg-darkGray"
                type="submit"
                disabled={isSubmitting}
                id="button-addon2"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="#ffffff"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                </svg>
              </button>
            </div>
          </form>
        )}
      </Formik>
      <ProjectPreviewSearch projects={searchResults}></ProjectPreviewSearch>
    </>
  );
};

export default ProjectSearch;
