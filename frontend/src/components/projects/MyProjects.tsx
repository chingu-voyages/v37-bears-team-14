import React, { FC, useEffect, useState } from "react";
import { useSession } from "../../hooks/session";
import { Project } from "../../shared/Interfaces";
import ProjectPreview from "./ProjectPreview";

const MyProjects: FC = () => {
  const { loading, isLoggedIn, user } = useSession();
  const [allProjects, setAllProjects] = useState<Project[]>();
  const [ownerProjects, setOwnerProjects] = useState<Project[]>();
  const [designerProjects, setDesignerProjects] = useState<Project[]>();
  const [developerProjects, setDeveloperProjects] = useState<Project[]>();

  useEffect(() => {
    fetch(`/api/v1/members?user=${user?.id}`).then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();

        setAllProjects(data);
      }
    });
  }, []);
  const filterByOwner = (projects: Project[]) => {
    if (user)
      projects.map((p) => {
        p.members.map((m) => {
          if (m.user.id === user.id && m.roleName === "owner") {
            console.log(m);
          }
        });
      });
  };
  return (
    <>
      <div className="grid grid-cols-3">
        <div
          className="bg-mintGreen border-[1px] border-black p-1 text-center shadow-md cursor-pointer"
          onClick={() => {
            if (allProjects) filterByOwner(allProjects);
          }}
        >
          Onwer
        </div>
        <div className="bg-mintGreen border-[1px] border-black p-1 text-center shadow-md cursor-pointer">
          Developer
        </div>
        <div className="bg-mintGreen border-[1px] border-black p-1 text-center shadow-md cursor-pointer">
          Designer
        </div>
      </div>
      {allProjects ? (
        <ProjectPreview projects={allProjects}></ProjectPreview>
      ) : (
        <div>No Projects</div>
      )}
    </>
  );
};

export default MyProjects;
