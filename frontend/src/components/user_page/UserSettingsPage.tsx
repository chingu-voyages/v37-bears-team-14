import React, { FunctionComponent, useState, useEffect } from "react";
import LoadingSpinner from "../Spinners/LoadingSpinner";
import UserSettingsLayout from "./UserSettingsLayout";
//import UpdateUserForm from "./UpdateUserForm";

const UserSettingsPage: FunctionComponent = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch("/api/v1/users").then(async (response) => {
      if (response.status === 200) {
        if (isMounted) {
          const data = await response.json();

          setUser(data);
          setLoading(false);
        }
      } else {
        console.error(
          "failed to load user",
          response.status,
          await response.json()
        );
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div className="w-full bg-medGray">
        {!loading ? (
          <UserSettingsLayout userProps={user} />
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </>
  );
};

export default UserSettingsPage;
