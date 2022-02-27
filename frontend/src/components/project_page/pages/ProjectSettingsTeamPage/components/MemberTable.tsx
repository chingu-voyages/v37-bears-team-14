import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import { useEffect } from "react";
import { Member, User } from "../../../../../shared/Interfaces";
import LoadingSpinner from "../../../../Spinners/LoadingSpinner";
import AddUserModal from "./AddUserModal";
import MemberTableRow from "./MemberTableRow";

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
    <>
      {showAddUserModal && (
        <AddUserModal
          onSelectUser={onSelectUser}
          onClose={() => setShowAddUserModal && setShowAddUserModal(false)}
        />
      )}
      <table className="">
        <tbody>
          {members.map((member) => (
            <MemberTableRow
              key={member.id}
              member={member}
              onRoleUpdate={async (member, roleName) => {
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
                } else {
                  console.error("Failed to update member", resp);
                }
              }}
              onRemoveUser={(userId) => removeUser(userId)}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default MemberTable;
