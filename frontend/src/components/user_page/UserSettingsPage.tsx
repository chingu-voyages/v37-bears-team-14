import React, { FunctionComponent, useState, useEffect } from "react";
import LoadingSpinner from "../Spinners/LoadingSpinner";
import UserSettingsLayout from "./UserSettingsLayout";
//import UpdateUserForm from "./UpdateUserForm";

const UserSettingsPage: FunctionComponent = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //let isMounted = true;
    setLoading(false);

    return () => {
      //isMounted = false;
    };
  }, []);

  return (
    <>
      <div className="w-full bg-medGray">
        {!loading ? <UserSettingsLayout /> : <LoadingSpinner />}
      </div>
    </>
  );
};

export default UserSettingsPage;
