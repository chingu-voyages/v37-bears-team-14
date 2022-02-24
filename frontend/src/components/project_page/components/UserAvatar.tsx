import { FunctionComponent } from "react";
import { User } from "../../../shared/Interfaces";

export interface UserAvatarProps {
  user: User;
}

const UserAvatar: FunctionComponent<UserAvatarProps> = ({ user }) => {
  return (
    <div className="mr-1">
      <img className="w-10" src={user.avatarUrl} alt={user.username} />
    </div>
  );
};

export default UserAvatar;
