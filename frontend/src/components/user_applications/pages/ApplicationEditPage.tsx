import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../Spinners/LoadingSpinner";
import { Application } from "../../../shared/Interfaces";
import ApplicationStatus from "../../project_page/pages/ProjectApplicationPage/components/ApplicationStatus";
import moment from "moment";
import Readme from "../../formatting/Readme";
import RoleSelector from "../../controls/RoleSelector";
import ApplicationService from "../../../services/ApplicationService";
import Details from "../../info/Details";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import InformationCircleIcon from "../../icons/InformationCircleIcon";
import ActionButton from "../../controls/ActionButton";
import Modal from "../../controls/Modal";
import ApplicationUpdateForm from "../components/ApplicationUpdateForm";
import EditLink from "../../controls/EditLink";

const Layout = (props: any) => {
  return (
    <div className="bg-white flex flex-col-reverse md:flex-row">
      <main className="basis-3/4 mb-8">
        <div className="mx-3 my-4 md:mx-8 md:mt-8">{props.main}</div>
      </main>
      <aside className="basis-1/4">
        <div className="mx-3 md:mr-8 my-4 mb-8">{props.aside}</div>
      </aside>
    </div>
  );
};

const ApplicationEditPage = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<Application | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const getApplication = async () => {
      const resp = await fetch("/api/v1/applications/" + applicationId);
      if (resp.status === 403) {
        navigate("/applications");
      } else if (resp.status === 200 || resp.status === 304) {
        setApplication(await resp.json());
        setLoading(false);
      } else {
        console.error("Failed to load application", resp.status, resp);
      }
    };

    getApplication().catch(console.error);
  }, [applicationId, navigate]);

  return (
    <Layout
      main={
        <>
          {loading || !application ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="my-3">
                <div className="mb-3 text-slate-500 hover:text-slate-900">
                  <Link to={"/applications"} className="flex">
                    <ArrowLeftIcon className="h-3 inline-block mt-1 mr-1" />
                    <div className="text-sm mt-[0.03em]">All Applications</div>
                  </Link>
                </div>

                <div className="text-2xl">
                  <span className="text-gray-600">Application to </span>
                  <Link
                    to={"/projects/" + application.project.id}
                    className="hover:underline"
                  >
                    {application.project.name}
                  </Link>
                </div>
                <div className="mb-1">
                  <ApplicationStatus status={application.status} />
                </div>
                <div
                  className="text-xs"
                  title={moment(application.createdAt).format()}
                >
                  Applied {moment(application.createdAt).fromNow()} • Updated{" "}
                  {moment(application.updatedAt).fromNow()}
                </div>
              </div>

              <div className="mt-2 font-semibold text-sm my-1">
                Requested Role
              </div>
              <div className="text-xs font-semibold">
                <RoleSelector
                  value={application.requestedRole}
                  options={application.project.settingOpenRoles}
                  onChange={async (requestedRole) => {
                    const updated = await ApplicationService.updateApplication(
                      application.id,
                      { requestedRole }
                    );
                    setApplication(updated);
                  }}
                />
              </div>

              <div className="mt-2 font-semibold text-sm my-1">
                Message <EditLink onClick={() => setModalOpen(true)} />
              </div>
              <div className="border-[1px] border-slate-300 rounded p-3">
                {application.content ? (
                  <Readme>{application.content}</Readme>
                ) : (
                  <div className="text-slate-400">No message</div>
                )}
              </div>
              {modalOpen && application && (
                <Modal>
                  <ApplicationUpdateForm
                    initialContent={application.content || ""}
                    updateApplication={async (params) => {
                      const updated =
                        await ApplicationService.updateApplication(
                          application.id,
                          params
                        );
                      setApplication(updated);
                      setModalOpen(false);
                    }}
                    onCancel={() => setModalOpen(false)}
                  />
                </Modal>
              )}
            </>
          )}
        </>
      }
      aside={
        <div className="my-8">
          <Details title="Application Process">
            <div className="text-sm text-gray-600">
              You can update the requested role and application message.
            </div>
          </Details>
        </div>
      }
    />
  );
};

export default ApplicationEditPage;
