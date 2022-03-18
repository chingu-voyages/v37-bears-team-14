import React, { FC, useEffect } from "react";
import { useSession } from "../../hooks/session";

const MyProjects: FC = () => {
  const { loading, isLoggedIn, user } = useSession();
  console.log(user);
  useEffect(() => {
    fetch(`api/v1/members?user=${user?.id}`).then(async (response) => {
      if (response.status === 200) {
      }
    });
  }, []);
  return <div>MyProjects</div>;
};

export default MyProjects;
