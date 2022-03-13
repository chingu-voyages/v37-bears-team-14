import { FunctionComponent } from "react";
import { Tech } from "../../shared/Interfaces";

export interface TechProps {
  tech: Tech;
}

const UserPageTech: FunctionComponent<TechProps> = ({ tech }) => {
  const { name, imageUrl, description } = tech;
  return (
    <>
      <img className="h-14 justify-start " alt={name} src={imageUrl} />
      <div className="p-0 m-1 text-xs text-slate-600 bg-slate-300 rounded-md justify-start font-bold">
        {name}
      </div>
      <div className="p-0 m-10 text-xs text-slate-600 bg-slate-300 rounded-md  justify-start font-bold">
        {description}
      </div>
    </>
  );
};

export default UserPageTech;
