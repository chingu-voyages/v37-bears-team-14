import { Member } from "../../../../../shared/Interfaces";
import { FunctionComponent } from "react";
import RoleSelector from "../../../../controls/RoleSelector";

import roleNames from "../roleNames.json";
import TrashIcon from "../../../../icons/TrashIcon";

export interface MemberTableRowProps {
  member: Member;
  onRoleUpdate: (member: Member, roleName: string) => Promise<void>;
  onRemoveUser: (userId: string) => Promise<void>;
}

const MemberTableRow: FunctionComponent<MemberTableRowProps> = ({
  member,
  onRoleUpdate,
  onRemoveUser,
}) => {
  return (
    <tr className="my-3 block">
      <td className="">
        <span className="mr-2">{member.user.username}</span>{" "}
        <span className="mr-2">
          <RoleSelector
            value={member.roleName}
            options={roleNames}
            onChange={async (roleName) => {
              if (onRoleUpdate) {
                await onRoleUpdate(member, roleName);
              }
            }}
          />
        </span>
        <span
          className="cursor-pointer hover:text-slate-800 text-slate-500"
          onClick={() => {
            if (onRemoveUser) {
              onRemoveUser(member.user.id);
            }
          }}
        >
          <TrashIcon className="h-5 inline" />
        </span>
      </td>
    </tr>
  );
};

export default MemberTableRow;
