import React, { FunctionComponent, useState, useEffect } from "react";
import { Menu } from "@headlessui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const NewProjectSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
  description: Yup.string().min(2, "Too Short!").max(50, "Too Long!"),
});

const NewProject: FunctionComponent = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [techs, setTechs] = useState<any[]>([]);
  const [chosenTechs, setChosenTechs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/v1/techs").then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();

        setTechs(data);
      } else {
        console.error(
          "failed to load techs",
          response.status,
          await response.json()
        );
      }
    });
  }, []);

  const chooseTech = (e: any, chosenTech: object) => {
    const updatedTechs = techs.filter((tech) => tech !== chosenTech);
    setTechs(updatedTechs);
    setChosenTechs([...chosenTechs, chosenTech]);
  };

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
              // same shape as initial values
              console.log(values);
              // const data = await response.json();
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
                <div className="flex justify-start">
                  {chosenTechs.map((tech) => (
                    <div className="relative m-1">
                      <div className="absolute top-0 right-0 bg-slate-300 border-white cursor-pointer text-white rounded-full hover:bg-blue-800 ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="#000000"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <img
                        className="h-12 mx-auto flex justify-center"
                        src={tech.imageUrl}
                      />
                      <div className="p-1 m-1 text-xs text-slate-700 bg-slate-300 rounded-md flex justify-center font-bold">
                        {tech.name}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <Menu>
                    <Menu.Button className="orange-btn">
                      Add Technologies
                    </Menu.Button>
                    <Menu.Items className="bg-white max-w-lg text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4 max-h-[300px] overflow-y-scroll">
                      {techs
                        .sort((a, b) => (a.name > b.name ? 1 : -1))
                        .map((tech, index) => (
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
                                    className={`block p-2 ${
                                      active && "bg-blue-500"
                                    }`}
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
        </div>
      </div>
    </>
  );
};

export default NewProject;
