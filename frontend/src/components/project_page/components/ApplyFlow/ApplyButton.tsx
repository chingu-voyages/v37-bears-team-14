import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import ApplicationService from "../../../../services/ApplicationService";
import { Application, Project } from "../../../../shared/Interfaces";
import ActionButton from "../../../controls/ActionButton";
import Modal from "../../../controls/Modal";
import LoadingSpinner from "../../../Spinners/LoadingSpinner";
import ApplyForm from "./ApplyForm";
import { CreateApplicationParams } from "../../../../shared/ApplicationInterfaces";

interface ApplyButtonProps {
  projectId: string;
  userId: string;
  setApplication: Dispatch<SetStateAction<Application | null>>;
}

const ApplyButton: FC<ApplyButtonProps> = ({
  projectId,
  userId,
  setApplication,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [project, setProject] = useState<null | Project>(null);

  useEffect(() => {
    const getProject = async () => {
      const resp = await fetch("/api/v1/projects/" + projectId);
      if (resp.status === 200 || resp.status === 304) {
        setProject(await resp.json());
      } else {
        console.error("Failed to get project", projectId, resp.status, resp);
      }
    };

    getProject().catch(console.error);
  }, [projectId]);

  const submitApplication = async (
    values: CreateApplicationParams
  ): Promise<void> => {
    const application = await ApplicationService.submitApplication(
      projectId,
      userId,
      values
    );
    setModalOpen(false);
    setApplication(application);
  };

  return (
    <>
      <ActionButton onClick={() => setModalOpen(true)}>Apply</ActionButton>
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <div className="font-xl font-semibold">Apply</div>
          {project ? (
            <ApplyForm
              project={project}
              submitApplication={submitApplication}
              onCancel={() => setModalOpen(false)}
            />
          ) : (
            <LoadingSpinner />
          )}
        </Modal>
      )}
    </>
  );
};

export default ApplyButton;
