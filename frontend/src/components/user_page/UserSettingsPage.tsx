import React, { FunctionComponent, useState } from "react";
import LoadingSpinner from "../Spinners/LoadingSpinner";
import UserSettingsLayout from "./UserSettingsLayout";
//import UpdateUserForm from "./UpdateUserForm";

const UserSettingsPage: FunctionComponent = () => {
  const [loading] = useState(false);

  return (
    <>
      <div className="w-full bg-medGray">
        {!loading ? <UserSettingsLayout /> : <LoadingSpinner />}
      </div>
    </>
  );
};

export default UserSettingsPage;
