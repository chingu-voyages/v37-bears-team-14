import React, { FC, useEffect, useState } from "react";
import { useSession } from "../../hooks/session";
import { Project } from "../../shared/Interfaces";
import ProjectPreview from "./ProjectPreview";

type role = "owner" | "designer" | "developer" | "all";
const MyProjects: FC = () => {
  const { isLoggedIn, user } = useSession();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [activeButton, setActiveButton] = useState<role>("all");

  const [currentProjects, setCurrentProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (isLoggedIn)
      fetch(`/api/v1/members?user=${user?.id}`).then(async (response) => {
        if (response.status === 200) {
          const data = await response.json();

          setAllProjects(data);
          setCurrentProjects(data);
        }
      });
  }, [isLoggedIn, user?.id]);
  const filterProjects = (projects: Project[], role: role) => {
    setCurrentProjects(allProjects);
    let filteredProjects: Project[] = [];
    if (user)
      projects.forEach((p) => {
        p.members.forEach((m) => {
          if (m.user.id === user.id && m.roleName === role) {
            filteredProjects.push(p);
          }
        });
      });

    setCurrentProjects(filteredProjects);
    setActiveButton(role);
    return filteredProjects;
  };
  return (
    <>
      <div className="grid grid-cols-3">
        <div
          className={`border-t-[1px] border-b-[1px] border-black p-3 sm:p-1 text-center shadow-md cursor-pointer ${
            activeButton === "owner"
              ? "shadow-inner bg-cyan-200"
              : "bg-mintGreen"
          }`}
          onClick={() => {
            if (allProjects) filterProjects(allProjects, "owner");
          }}
        >
          Owner
        </div>
        <div
          className={`border-[1px] border-black p-3 sm:p-1 text-center shadow-md cursor-pointer ${
            activeButton === "developer"
              ? "shadow-inner bg-cyan-200"
              : "bg-mintGreen"
          }`}
          onClick={() => {
            if (allProjects) filterProjects(allProjects, "developer");
          }}
        >
          Developer
        </div>
        <div
          className={`border-t-[1px] border-b-[1px] border-black p-3 sm:p-1 text-center shadow-md cursor-pointer ${
            activeButton === "designer"
              ? "shadow-inner bg-cyan-200"
              : "bg-mintGreen"
          }`}
          onClick={() => {
            if (allProjects) filterProjects(allProjects, "designer");
          }}
        >
          Designer
        </div>
      </div>
      <div
        className={`border-b-[1px] border-black p-3 sm:p-1 text-center shadow-md cursor-pointer ${
          activeButton === "all" ? "shadow-inner bg-cyan-200" : "bg-teal-200"
        }`}
        onClick={() => {
          if (allProjects) setCurrentProjects(allProjects);
          setActiveButton("all");
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
