import React from "react";
import ActionButton from "../../../../controls/ActionButton";
import { useSession } from "../../../../../hooks/session";
import { useParams } from "react-router-dom";
const { loading, isLoggedIn, user } = useSession();
const params = useParams();
const starProject = () => {
  fetch(`/api/v1/projects/${params.projectId}/star`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: user, project: params.projectId }),
  });
  console.log(user);
};

export default function StarButton() {
  return <ActionButton onClick={() => starProject()}>Star</ActionButton>;
}
