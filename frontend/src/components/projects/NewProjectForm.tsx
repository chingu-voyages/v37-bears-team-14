import React, { FunctionComponent, useState, useEffect } from "react";
import { Menu } from "@headlessui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const NewProjectSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
  description: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
});

interface Tech {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

interface Props {
  chosenTechs: Tech[];
  removeTech: (e: any, chosenTech: object) => void;
  techs: Tech[];
  chooseTech: (e: any, chosenTech: object) => void;
}

interface FormValues {
  name: string;
  description: string;
  techs: string[];
}

const NewProjectForm: React.FC<Props> = ({
  chosenTechs,
  removeTech,
  techs,
  chooseTech,
}) => {
  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        techs: [],
      }}
      validationSchema={NewProjectSchema}
      onSubmit={(values: FormValues) => {
        // same shape as initial values
        // const data = await response.json();
        values.techs = chosenTechs.map((t) => t.id);
        async function postProject(values: object): Promise<void> {
          fetch("api/v1/projects", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });
        }
        postProject(values);
        console.log(values);
      }}
    >
      {({ errors, touched }) => (
        <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
          <h2 className="text-xl text-center font-bold">Create Project</h2>
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
          <div className="flex justify-start">
            {chosenTechs.map((tech: any, index: number) => (
              <div className="relative m-1" key={index}>
                {/* bg-slate-300 border-white text-white rounded-full hover:bg-blue-800*/}
                <div
                  className="absolute top-0 right-0 cursor-pointer bg-slate-300 border-white rounded-full"
                  onClick={(e) => removeTech(e, tech)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="#64748b"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <img
                  className="h-12 mx-auto flex justify-center"
                  src={tech.imageUrl}
                />
                <div className="p-1 m-1 text-xs text-slate-600 bg-slate-300 rounded-md flex justify-center font-bold">
                  {tech.name}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2">
            <Menu>
              <Menu.Button className="orange-btn">Add Technologies</Menu.Button>
              <Menu.Items
                static
                className="bg-white max-w-lg text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4 max-h-[300px] overflow-y-scroll"
              >
                {techs
                  .sort((a: any, b: any) => (a.name > b.name ? 1 : -1))
                  .map((tech: any, index: number) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <>
                          <div
                            onClick={(e) => chooseTech(e, tech)}
                            className="flex justify-between items-center h-12 p-2 cursor-pointer hover:bg-neutral-300 align-baseline"
                          >
                            <img
                              className=" h-10"
                              src={tech?.imageUrl}
                              alt={tech.name}
                            />

                            <a
                              className={`block p-2 ${active && "bg-blue-500"}`}
                              href="/account-settings"
                            >
                              {tech.name}
                            </a>
                          </div>
                        </>
                      )}
                    </Menu.Item>
                  ))}
              </Menu.Items>
            </Menu>
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="main-btn">
              Create Project
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewProjectForm;
