import React, { FunctionComponent, useState, useEffect } from "react";
import LoadingSpinner from "../Spinners/LoadingSpinner";
import { useSession } from "../../hooks/session";
import NewProjectForm from "./NewProjectForm";
import { Transition } from "@headlessui/react";

const NewProject: FunctionComponent = () => {
  const { user } = useSession();
  const [techs, setTechs] = useState<any[]>([]);
  const [chosenTechs, setChosenTechs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [projectForm, setProjectForm] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch("/api/v1/techs").then(async (response) => {
      if (response.status === 200) {
        if (isMounted) {
          const data = await response.json();

          setTechs(data);
          setLoading(false);
        }
      } else {
        console.error(
          "failed to load techs",
          response.status,
          await response.json()
        );
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const chooseTech = (chosenTech: object) => {
    const updatedTechs = techs.filter((tech) => tech !== chosenTech);
    setTechs(updatedTechs);
    setChosenTechs([...chosenTechs, chosenTech]);
  };

  const removeTech = (chosenTech: object) => {
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
      <>
        <div className="fixed top-0 left-0 h-screen w-screen backdrop-blur-sm"></div>
        <div className="fixed z-10 inset-0 overflow-y-auto max-w-3xl mx-auto">
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
  }

  return (
    <>
      <Transition
        show={projectForm}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {content}
      </Transition>
      <div className="w-full bg-medGray">
        <div
          className="p-1 cursor-pointer"
          onClick={() => setProjectForm(!projectForm)}
        >
          <span className="p-2 text-mintGreen">Create Project</span>
        </div>
      </div>
    </>
  );
};

export default NewProject;
