import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ProjectPageContext } from "../../layouts/ProjectPageLayout";
import useMember from "../../hooks/useMember";
import ApplicationDisplay from "./components/ApplicationDisplay";
import ApplicationService from "../../../../services/ApplicationService";
import { useState } from "react";
import { useEffect } from "react";
import { Application } from "../../../../shared/Interfaces";
import LoadingSpinner from "../../../Spinners/LoadingSpinner";
import ManagingApplicationsInfo from "./components/ManagingApplicationsInfo";
import ActionButtonsGroup from "./components/ActionButtonsGroup";

const ProjectApplicationPage = () => {
  const { project } = useOutletContext<ProjectPageContext>();
  const { applicationId } = useParams();
  const { loading: loadingMembership, isMember } = useMember(project.id);
  const navigate = useNavigate();

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [application, setApplication] = useState<Application | null>(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    const getApplication = async () => {
      const resp = await fetch("/api/v1/applications/" + applicationId);
      if (resp.status === 200 || resp.status === 304) {
        setApplication(await resp.json());
      } else {
        console.error("failed to load application", resp.status, resp);
      }
      setLoadingInitial(false);
    };

    getApplication().catch(console.error);
  }, [applicationId]);

  useEffect(() => {
    if (!loadingMembership && !isMember) {
      navigate("..");
    }
    if (!applicationId) {
      navigate("..");
    }
  }, [loadingMembership, isMember, applicationId, navigate]);

  const acceptApplication = async () => {
    if (applicationId) {
      try {
        setLoadingUpdate(true);
        const application = await ApplicationService.acceptApplicationById(
          applicationId
        );
        setApplication(application);
        setLoadingUpdate(false);
      } catch (err) {
        console.error("Failed to accept application", err);
      }
    }
  };

  const updateApplicationStatus = async (status: string) => {
    if (applicationId) {
      try {
        setLoadingUpdate(true);
        const application = await ApplicationService.updateApplicationStatus(
          applicationId,
          status
        );
        setApplication(application);
        setLoadingUpdate(false);
      } catch (err) {
        console.error("Failed to update application status", err);
      }
    }
  };

  if (loadingInitial || !application) {
    return (
      <div className="flex flex-col-reverse md:flex-row">
        <div className="mx-3 my-4 md:mx-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <main className="basis-3/4">
        {applicationId && <ApplicationDisplay application={application} />}
      </main>
      <aside className="basis-1/4">
        <div className="mx-3 md:mr-8 my-4 mb-8">
          <ActionButtonsGroup
            disabled={loadingUpdate}
            onAcceptApplication={acceptApplication}
            onUpdateApplicationStatus={updateApplicationStatus}
          />
          <div className="my-2">
            <ManagingApplicationsInfo />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ProjectApplicationPage;
