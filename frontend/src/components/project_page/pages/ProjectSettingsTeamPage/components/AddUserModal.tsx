import {
  EventHandler,
  FunctionComponent,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import { User } from "../../../../../shared/Interfaces";
import ActionButton from "../../../../controls/ActionButton";
import XIcon from "../../../../icons/XIcon";
import RoleSelector from "../../../../controls/RoleSelector";
import roleNames from "../roleNames.json";

export interface AddUserModalProps {
  onClose?: EventHandler<MouseEvent>;
  onSelectUser?: (user: User, role: string) => Promise<void>;
}

const AddUserModal: FunctionComponent<AddUserModalProps> = ({
  onClose,
  onSelectUser,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<null | User>(null);
  const [role, setRole] = useState("developer");

  useEffect(() => {
    const searchUsers = async () => {
      const resp = await fetch("/api/v1/search/" + query);
      if (resp.status === 200) {
        setUsers([await resp.json()]);
      } else {
        setUsers([]);
        console.error("failed", resp);
      }
    };

    if (!query || query.length < 2) {
      setUsers([]);
    } else {
      searchUsers().catch(console.error);
    }
  }, [query]);

  return (
    <>
      <div
        onClick={onClose}
        className="fixed z-10 top-0 left-0 h-screen w-screen backdrop-blur-sm"
      ></div>
      <div className="fixed z-10 inset-0 overflow-y-auto max-w-3xl mx-auto">
        <div className="mx-2 my-4 bg-white rounded-lg relative">
          <div className="p-4">
            <div className="relative">
              <div
                className="absolute right-0 cursor-pointer"
                onClick={onClose}
              >
                <XIcon />
              </div>
            </div>

            <div className="mb-2">Add Team Member</div>

            {selectedUser ? (
              <div className="px-2 py-1 bg-slate-100 border-[1px] border-slate-400 rounded">
                <span className="mr-2">{selectedUser.username}</span>
                <RoleSelector
                  onChange={async (role) => setRole(role)}
                  value={role}
                  options={roleNames}
                />
                <span
                  className="cursor-pointer p-1"
                  onClick={() => setSelectedUser(null)}
                >
                  <XIcon className="h-4 inline" />
                </span>
              </div>
            ) : (
              <input
                className="w-full border-[1px] border-slate-400 rounded px-2 py-1"
                type="search"
                onChange={(e) => setQuery(e.target.value)}
                value={query}
              />
            )}

            <div className="z-10 relative">
              {users.length > 0 && (
                <div className="absolute bg-white w-full border-[1px] border-slate-400 rounded my-1">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user);
                        setQuery("");
                      }}
                      className="hover:bg-slate-100 rounded cursor-pointer"
                    >
                      <div className="mx-2 py-1">{user.username}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="my-1">
              <ActionButton
                onClick={() => {
                  if (selectedUser && onSelectUser) {
                    onSelectUser(selectedUser, role);
                  }
                }}
                disabled={!selectedUser}
                additionalClassName={"pt-[0.6em] h-8"}
              >
                {selectedUser
                  ? "Add " + selectedUser.username + " to Team"
                  : "Select a User"}
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUserModal;
