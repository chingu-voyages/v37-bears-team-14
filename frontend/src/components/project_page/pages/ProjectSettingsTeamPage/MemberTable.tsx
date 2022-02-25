import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import { useEffect } from "react";
import { Member, User } from "../../../../shared/Interfaces";
import LoadingSpinner from "../../../Spinners/LoadingSpinner";
import TrashIcon from "../../../icons/TrashIcon";
import AddUserModal from "./AddUserModal";
import RoleSelector from "../../../controls/RoleSelector";
import roleNames from "./roleNames.json";

export interface MemberListProps {
  projectId: string;
  showAddUserModal?: boolean;
  setShowAddUserModal?: Dispatch<SetStateAction<boolean>>;
  addUserModalRef?: HTMLElement;
}

const MemberTable: FunctionComponent<MemberListProps> = ({
  projectId,
  showAddUserModal,
  setShowAddUserModal,
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const getMembers = async (projectId: string) => {
    const resp = await fetch("/api/v1/projects/" + projectId + "/members");

    if (resp.status === 200 || resp.status === 304) {
      const members = await resp.json();
      setMembers(members);
    } else {
      console.error("Failed to get members");
    }
  };

  useEffect(() => {
    setLoading(true);
    getMembers(projectId).catch((err) => console.error(err));
    setLoading(false);
  }, [projectId]);

  const onSelectUser = async (user: User, roleName: string) => {
    const resp = await fetch("/api/v1/projects/" + projectId + "/members", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        user: user.id,
        roleName,
      }),
    });

    if (resp.status === 200) {
      if (setShowAddUserModal) {
        setShowAddUserModal(false);
      }
      await getMembers(projectId);
    } else {
      console.error("failed to add", resp);
    }
  };

  const removeUser = async (user: string) => {
    const resp = await fetch("/api/v1/projects/" + projectId + "/members", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user }),
    });

    if (resp.status === 200) {
      await getMembers(projectId);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex">
      {showAddUserModal && (
        <AddUserModal
          onSelectUser={onSelectUser}
          onClose={() => setShowAddUserModal && setShowAddUserModal(false)}
        />
      )}
      <table className="">
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="my-3 block">
              <td className="">
                <span className="mr-2">{member.user.username}</span>{" "}
                <span className="mr-2">
                  <RoleSelector
                    value={member.roleName}
                    options={roleNames}
                    onChange={async (roleName) => {
                      const resp = await fetch(
                        "/api/v1/projects/" + projectId + "/members",
                        {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({
                            user: member.user.id,
                            roleName,
                          }),
                        }
                      );

                      if (resp.status === 200) {
                        const member = await resp.json();
                        setMembers(
                          members.map((m) => {
                            if (m.id === member.id) {
                              return member;
                            } else {
                              return m;
                            }
                          })
                        );
                      }
                    }}
                  />
                </span>
                {/* <span className="text-xs bg-emerald-600 text-white rounded pl-2 pr-1 cursor-pointer">
                  {member.roleName} <ChevronDownIcon className="h-3 inline" />
                </span> */}
                <span
                  className="cursor-pointer hover:text-slate-800 text-slate-500"
                  onClick={(e) => {
                    removeUser(member.user.id);
                  }}
                >
                  <TrashIcon className="h-5 inline" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
