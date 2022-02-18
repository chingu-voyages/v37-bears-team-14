import React, { FunctionComponent, useState, useEffect } from "react";
import LoadingSpinner from "../Spinners/LoadingSpinner";

import NewProjectForm from "./NewProjectForm";

const NewProject: FunctionComponent = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [techs, setTechs] = useState<any[]>([]);
  const [chosenTechs, setChosenTechs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      <div className="md:container mx-auto px-4">
        <div className="w-full max-w-3xl mx-auto">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <NewProjectForm
              chosenTechs={chosenTechs}
              setChosenTechs={setChosenTechs}
              removeTech={removeTech}
              techs={techs}
              setTechs={setTechs}
              chooseTech={chooseTech}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default NewProject;
