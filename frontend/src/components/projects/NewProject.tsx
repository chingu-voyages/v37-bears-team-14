import React, { FunctionComponent } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const NewProjectSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
  description: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
});

const NewProject: FunctionComponent = () => {
  return (
    <>
      <div className="container mx-auto px-4">
        <div className="w-full">
          <Formik
            initialValues={{
              name: "",
              description: "",
            }}
            validationSchema={NewProjectSchema}
            onSubmit={(values) => {
              async function postProject(values: object) {
                const response = await fetch("api/v1/projects", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(values),
                });
                const data = await response.json();
              }
              postProject(values);
              // same shape as initial values
              console.log(values);
            }}
          >
            {({ errors, touched }) => (
              <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
                <h2 className="text-xl text-center font-bold">
                  Create Project
                </h2>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Name
                  </label>
                  <Field
                    name="name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                {errors.name && touched.name ? <div>{errors.name}</div> : null}
                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Description
                  </label>
                  <Field
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="description"
                    as="textarea"
                  />
                </div>
                {errors.description && touched.description ? (
                  <div>{errors.description}</div>
                ) : null}

                <div className="flex items-center justify-between">
                  <button type="button" className="orange-btn">
                    Add Technology
                  </button>

                  <div className="hidden bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4">
                    <div className="px-4 py-3">
                      <span className="block text-sm">Bonnie Green</span>
                      <span className="block text-sm font-medium text-gray-900 truncate">
                        name@flowbite.com
                      </span>
                    </div>
                    <ul className="py-1" aria-labelledby="dropdown">
                      <li>
                        <a
                          href="#"
                          className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
                        >
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
                        >
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
                        >
                          Earnings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
                        >
                          Sign out
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button type="submit" className="main-btn">
                    Submit
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default NewProject;
