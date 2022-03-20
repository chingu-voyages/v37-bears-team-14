import React, { FC, useEffect, useState } from "react";
import { useSession } from "../../../../../hooks/session";
import { Project } from "../../../../../shared/Interfaces";
import StarIcon from "../../../../icons/StarIcon";

interface Props {
  project: Project;
}
const StarButton: FC<Props> = ({ project }) => {
  const { loading, isLoggedIn, user } = useSession();
  const [starButton, setStarButton] = useState(false);
  const [unstarButton, setUnstarButton] = useState(false);
  const [starrers, setStarrers] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/v1/projects/${project.id}`).then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        setStarrers(data.starrers);

        if (isLoggedIn && user && !data.starrers.includes(user.id)) {
          setStarButton(true);
        } else if (user && data.starrers.includes(user.id)) {
          setUnstarButton(true);
        }
      }
    });
  }, [isLoggedIn, project.id, user]);

  const starProject = () => {
    fetch(`/api/v1/projects/${project.id}/star`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, project: project.id }),
    });

    setStarButton(false);
    setUnstarButton(true);
    if (user) setStarrers([...starrers, user.id]);
  };
  const unstarProject = () => {
    fetch(`/api/v1/projects/${project.id}/unstar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, project: project.id }),
    });
    setStarButton(true);
    setUnstarButton(false);
    if (user) setStarrers(starrers.filter((e) => e !== user.id));
  };
  return (
    <>
      {!loading && isLoggedIn && (
        <button
          onClick={() => {
            if (starButton) starProject();
            if (unstarButton) unstarProject();
          }}
          className="transition-all duration-1000 flex bg-gradient-to-br from-cyan-200 via-purple-300 to-cyan-100 bg-size-200 bg-pos-0 hover:bg-pos-100 text-gray-800 font-semibold mb-1 py-2 px-4 border border-gray-400 rounded shadow-md"
        >
          <span className="inline mr-1">
            <StarIcon></StarIcon>
          </span>
          <span className="inline mr-2">
            {starButton && "Star"}
            {unstarButton && "Unstar"}
          </span>
          <span className="flex content-center justify-center px-2 py-1 text-xs font-bold text-darkGray bg-white rounded-full shadow-inner">
            {starrers.filter((e) => e).length}
          </span>
        </button>
      )}
    </>
  );
};

export default StarButton;
