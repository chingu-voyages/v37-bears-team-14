import React, { FC, useEffect, useState } from "react";
import ActionButton from "../../../../controls/ActionButton";
import { useSession } from "../../../../../hooks/session";
import { useParams } from "react-router-dom";
import { Project, Member, User } from "../../../../../shared/Interfaces";
interface Props {
  project: Project;
}
const StarButton: FC<Props> = ({ project }) => {
  const { loading, isLoggedIn, user } = useSession();
  const [starButton, setStarButton] = useState(false);
  const [unstarButton, setUnstarButton] = useState(false);
  const [starrers, setStarrers] = useState<string[]>([]);
  const params = useParams();

  useEffect(() => {
    fetch(`/api/v1/projects/${project.id}`).then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        console.log(data.starrers);
        setStarrers(data.starrers);
        console.log(user);
        if (data.members) {
          data.members.map((m: Member) => {
            // console.log(m);
            if (
              m.roleName === "owner" &&
              user &&
              m.user.id !== user.id &&
              !data.starrers.includes(user.id)
            ) {
              // console.log({ owner: m.user.id, user: user.id });

              setStarButton(true);
            }
            if (user && data.starrers.includes(user.id)) {
              setUnstarButton(true);
            }
          });
        }
      }
    });
  }, []);
  const starProject = () => {
    fetch(`/api/v1/projects/${project.id}/star`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, project: project.id }),
    });
    console.log(user);
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
      {user && (
        <button
          onClick={() => {
            if (starButton) starProject();
            if (unstarButton) unstarProject();
          }}
          className="flex bg-white hover:bg-gray-100 text-gray-800 font-semibold mb-1 py-2 px-4 border border-gray-400 rounded shadow"
        >
          <span className="inline mr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </span>
          <span className="inline mr-2">
            {starButton && "Star"}
            {unstarButton && "Unstar"}
          </span>
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-darkGray bg-lightGray rounded-full">
            {starrers.filter((e) => e).length}
          </span>
        </button>
      )}
    </>
  );
};

export default StarButton;
