import { useOutletContext } from "react-router-dom";
import { ProjectPageContext } from "../../layouts/ProjectPageLayout";
import MemberTable from "./components/MemberTable";
import ActionButton from "../../../controls/ActionButton";
import { useState } from "react";

const ProjectSettingsTeamPage = () => {
  const { project } = useOutletContext<ProjectPageContext>();
  const [showAddUser, setShowAddUser] = useState(false);

  return (
    <div className="w-full">
      <div className="m-3 md:mr-8 md:my-6">
        <div className="absolute right-3 md:right-8 cursor-pointer">
          <ActionButton onClick={() => setShowAddUser(true)}>
            Add Member
          </ActionButton>
        </div>
        <div className="text-2xl font-bold">Team</div>
        <div className="my-2 md:my-4">
          <MemberTable
            projectId={project.id}
            showAddUserModal={showAddUser}
            setShowAddUserModal={setShowAddUser}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingsTeamPage;
