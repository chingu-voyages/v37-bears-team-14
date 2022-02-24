import { useEffect, useState } from "react";
import { Member } from "../../shared/Interfaces";

const useMember = (projectId: string) => {
  const [isMember, setIsMember] = useState(false);
  const [member, setMember] = useState<null | Member>(null);

  useEffect(() => {
    const getMember = async () => {
      const resp = await fetch(
        "/api/v1/projects/" + projectId + "/members/@me"
      );
      if (resp.status === 200 || resp.status === 304) {
        setMember(await resp.json());
        setIsMember(true);
      } else if (resp.status === 404) {
        setMember(null);
        setIsMember(false);
      } else {
        console.error("Failed to fetch current member", resp);
      }
    };

    getMember().catch(console.error);
  }, [projectId]);

  return { isMember, member };
};

export default useMember;
