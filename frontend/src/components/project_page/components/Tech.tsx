import { FunctionComponent } from "react";
import { Tech } from "../../../shared/Interfaces";

export interface TechProps {
  tech: Tech;
}

const TechComponent: FunctionComponent<TechProps> = ({ tech }) => {
  const { name, imageUrl } = tech;
  return (
    <>
      <img
        className="h-9 mx-auto flex justify-center"
        alt={name}
        src={imageUrl}
      />
      <div className="p-1 m-1 text-xs text-slate-600 bg-slate-300 rounded-md flex justify-center font-bold">
        {name}
      </div>
    </>
  );
};

export default TechComponent;
