import { FunctionComponent } from "react";
import { User } from "../../../shared/Interfaces";

export interface UserAvatarProps {
  user: User;
}

const UserAvatar: FunctionComponent<UserAvatarProps> = ({ user }) => {
  return (
    // <div className="mr-2 ml-2">
    //   <img className="w-10" src={user.avatarUrl} alt={user.username} />
    // </div>
    <img
      className="relative z-30 inline object-cover w-12 h-12 border-2 border-lightGrey rounded-full"
      src={user.avatarUrl}
      alt={user.username}
    />
  );
};

export default UserAvatar;
