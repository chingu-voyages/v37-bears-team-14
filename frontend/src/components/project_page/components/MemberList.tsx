import { FunctionComponent, useState } from "react";
import { useEffect } from "react";
import { Member } from "../../../shared/Interfaces";
import LoadingSpinner from "../../Spinners/LoadingSpinner";
import UserAvatar from "./UserAvatar";

export interface MemberListProps {
  projectId: string;
}

const MemberList: FunctionComponent<MemberListProps> = ({ projectId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getMembers = async () => {
      setLoading(true);
      const resp = await fetch("/api/v1/projects/" + projectId + "/members");
      setLoading(false);

      if (resp.status === 200 || resp.status === 304) {
        const members = await resp.json();
        setMembers(members);
      } else {
        console.error("Failed to get members");
      }
    };

    getMembers().catch((err) => console.error(err));
  }, [projectId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex -space-x-4">
      {members.map((member) => (
        <UserAvatar key={member.id} user={member.user} />
      ))}
    </div>
  );
};

export default MemberList;
