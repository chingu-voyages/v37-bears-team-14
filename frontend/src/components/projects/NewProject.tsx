import React, { FunctionComponent, useState, useEffect } from "react";
import LoadingSpinner from "../Spinners/LoadingSpinner";
import { Project } from "../../shared/Interfaces";
import NewProjectForm from "./NewProjectForm";

// interface Props {
//   addProject: (project: Project) => void;
// }
const NewProject: FunctionComponent = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [techs, setTechs] = useState<any[]>([]);
  const [chosenTechs, setChosenTechs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [projectForm, setProjectForm] = useState(false);

  // const addNewProject = (project: Project) => {
  //   addProject(project);
  // };
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
      <>
        <div className="fixed top-0 left-0 h-screen w-screen backdrop-blur-sm"></div>
        <div className="fixed z-10 inset-0 overflow-y-auto max-w-3xl mx-auto">
          {/* fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 */}
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
      {content}
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
