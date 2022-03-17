import { FunctionComponent } from "react";
import { User } from "../../../shared/Interfaces";

interface Props {
  userProps?: User;
}

const UserHeader: FunctionComponent<Props> = ({ userProps }) => {
  return (
    <div>
      <div className="flex items-center">
        <img
          src={userProps ? userProps.avatarUrl : ""}
          className="w-15 h-15 block rounded  "
          alt="Avatar Url"
        />
        <div className="text-indigo-600 text-3xl font-bold ml-3">
          {userProps ? userProps.username : ""}
        </div>
      </div>
      <h1 className="text-gray-400 font-medium text-lg mt-8 pr-4">
        {userProps ? userProps.displayName : ""}
      </h1>
    </div>
  );
};
export default UserHeader;
