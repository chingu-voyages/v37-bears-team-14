import React, { FunctionComponent, useState } from "react";
import { Tech } from "../../../shared/Interfaces";

interface Props {
  changeTech: (tech: Tech) => void;
  tech: Tech;
}

const TechComponent: FunctionComponent<Props> = ({ tech, changeTech }) => {
  const [selected, setSelected] = useState(false);

  return (
    <button className="w-full">
      <div
        className="bg-gray-100 px-8 py-6 flex items-center border-b border-gray-300"
        onClick={(e) => {
          changeTech(tech);
          if (!selected) setSelected(true);
          else setSelected(false);
        }}
      >
        <div className="flex ml-4">
          <img
            src={tech.imageUrl}
            alt="Tech"
            className="w-10 h-10 object-cover rounded object-top"
          />
          <div className="flex flex-col pl-4">
            <h2 className="font-medium text-2xl">{tech.name}</h2>
          </div>
        </div>
      </div>
    </button>
  );
};

export default TechComponent;
