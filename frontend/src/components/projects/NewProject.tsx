import React, { FunctionComponent, useState, useEffect } from "react";
import LoadingSpinner from "../Spinners/LoadingSpinner";

import NewProjectForm from "./NewProjectForm";

const NewProject: FunctionComponent = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [techs, setTechs] = useState<any[]>([]);
  const [chosenTechs, setChosenTechs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [projectForm, setProjectForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/v1/techs").then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();

        setTechs(data);
        setLoading(false);
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

  const removeTech = (e: any, chosenTech: object) => {
    const updatedChosenTechs = chosenTechs.filter(
      (tech) => tech !== chosenTech
    );
    setChosenTechs(updatedChosenTechs);
    setTechs([...techs, chosenTech]);
  };

  let content;
  if (projectForm) {
    content = loading ? (
      <LoadingSpinner />
    ) : (
      //w-full max-w-3xl
      //fixed inset-x-0 mx-auto max-w-3xl
      <>
        <div className="fixed top-0 left-0 h-screen w-screen backdrop-blur-sm"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 width-3xl">
          <NewProjectForm
            chosenTechs={chosenTechs}
            setChosenTechs={setChosenTechs}
            removeTech={removeTech}
            techs={techs}
            setTechs={setTechs}
            chooseTech={chooseTech}
            loading={loading}
            setLoading={setLoading}
            projectForm={projectForm}
            setProjectForm={setProjectForm}
          />
        </div>
      </>
    );
  } else {
    content = (
      <div className="w-full bg-medGray">
        {/* flex justify-end */}
        {/* <button
          className="main-btn m-1"
          onClick={() => setProjectForm(!projectForm)}
        >
          Create Project
        </button> */}
        <div
          className="bg-main-gradient p-1 cursor-pointer"
          onClick={() => setProjectForm(!projectForm)}
        >
          <span className="p-2 text-mintGreen">Create Project</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <div className="md:container mx-auto px-4"></div> */}
      {content}
    </>
  );
};

export default NewProject;
