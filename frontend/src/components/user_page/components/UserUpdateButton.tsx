import React, { FunctionComponent, useState, useEffect } from "react";
import LoadingSpinner from "../../Spinners/LoadingSpinner";
import { User } from "../../../shared/Interfaces";
import "lodash";
import UpdateUserForm from "./UpdateUserForm";

interface Props {
  userProps?: User;
}

const UserSettingsLayout: FunctionComponent<Props> = ({ userProps }) => {
  // const [isLoading, setIsLoading] = useState(true);
  const [techs, setTechs] = useState<any[]>([]);
  const [chosenTechs, setChosenTechs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userForm, setuserForm] = useState(false);
  const [techUpdated, setTechUpdated] = useState(false);

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

  const chooseTech = (e: any, chosenTech: any) => {
    const updatedTechs = techs.filter((tech) => tech.id !== chosenTech.id);
    setChosenTechs([...chosenTechs, chosenTech]);
    setTechs(updatedTechs);
  };
  const initializeTechs = (techArray: any) => {
    setChosenTechs(techArray);
    let updatedTechs = [];
    for (let currentTech of techs) {
      let found = false;
      for (let tech of techArray) {
        if (tech.id === currentTech.id) {
          found = true;
        }
      }
      if (!found) updatedTechs.push(currentTech);
    }
    setTechs(updatedTechs);
  };

  const removeTech = (e: any, chosenTech: object) => {
    const updatedChosenTechs = chosenTechs.filter(
      (tech) => tech !== chosenTech
    );
    setChosenTechs(updatedChosenTechs);
    setTechs([...techs, chosenTech]);
  };

  let content;
  if (userForm) {
    content = loading ? (
      <LoadingSpinner />
    ) : (
      <>
        <div className="fixed top-0 left-0 h-screen w-screen backdrop-blur-sm"></div>
        <div className="fixed z-10 inset-0 overflow-y-auto max-w-3xl mx-auto">
          {/* fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 */}

          <UpdateUserForm
            chosenTechs={chosenTechs}
            setChosenTechs={setChosenTechs}
            removeTech={removeTech}
            techs={techs}
            setTechs={setTechs}
            chooseTech={chooseTech}
            loading={loading}
            setLoading={setLoading}
            userForm={userForm}
            setuserForm={setuserForm}
            techUpdated={techUpdated}
            setTechUpdated={setTechUpdated}
            initializeTechs={initializeTechs}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {content}
      <div>
        <button
          className="bg-indigo-500 text-white py-2 text-sm px-3 rounded focus:outline-none"
          onClick={() => setuserForm(!userForm)}
        >
          Edit Profile
        </button>
      </div>
    </>
  );
};

export default UserSettingsLayout;
