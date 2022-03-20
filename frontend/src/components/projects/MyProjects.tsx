import React, { FC, useEffect, useState } from "react";
import { useSession } from "../../hooks/session";
import { Project } from "../../shared/Interfaces";
import ProjectPreview from "./ProjectPreview";

type role = "owner" | "designer" | "developer";
const MyProjects: FC = () => {
  const { loading, isLoggedIn, user } = useSession();
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const [currentProjects, setCurrentProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch(`/api/v1/members?user=${user?.id}`).then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();

        setAllProjects(data);
        setCurrentProjects(data);
      }
    });
  }, []);
  const filterProjects = (projects: Project[], role: role) => {
    setCurrentProjects(allProjects);
    let filteredProjects: Project[] = [];
    if (user)
      projects.map((p) => {
        p.members.map((m) => {
          if (m.user.id === user.id && m.roleName === role) {
            filteredProjects.push(p);
          }
        });
      });
    console.log(filteredProjects);
    setCurrentProjects(filteredProjects);
    return filteredProjects;
  };
  return (
    <>
      <div className="grid grid-cols-3">
        <div
          className="bg-mintGreen border-t-[1px] border-b-[1px] border-black p-1 text-center shadow-md cursor-pointer"
          onClick={() => {
            if (allProjects) filterProjects(allProjects, "owner");
          }}
        >
          Owner
        </div>
        <div
          className="bg-mintGreen border-[1px] border-black p-1 text-center shadow-md cursor-pointer"
          onClick={() => {
            if (allProjects) filterProjects(allProjects, "developer");
          }}
        >
          Developer
        </div>
        <div
          className="bg-mintGreen border-t-[1px] border-b-[1px] border-black p-1 text-center shadow-md cursor-pointer"
          onClick={() => {
            if (allProjects) filterProjects(allProjects, "designer");
          }}
        >
          Designer
        </div>
      </div>
      <div
        className="bg-teal-200 border-b-[1px] border-black p-1 text-center shadow-md cursor-pointer"
        onClick={() => {
          if (allProjects) setCurrentProjects(allProjects);
        }}
      >
        All Roles
      </div>
      {allProjects ? (
        <ProjectPreview projects={currentProjects}></ProjectPreview>
      ) : (
        <div>No Projects</div>
      )}
    </>
  );
};

export default MyProjects;
