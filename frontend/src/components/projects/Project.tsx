import React, { FunctionComponent, useState, useEffect } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  techs: string[];
}

const Project: FunctionComponent = () => {
  useEffect(() => {
    fetch("api/v1/projects").then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
      }
    });
  });
  return <div>Project</div>;
};

export default Project;
