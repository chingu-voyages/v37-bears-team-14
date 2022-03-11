import { FC, useState } from "react";
import { Application } from "../../shared/Interfaces";
import { useEffect } from "react";
import ApplicationPreview from "./ApplicationPreview";
import LoadingSpinner from "../Spinners/LoadingSpinner";
import QueryTabs from "../controls/QueryTabs";

interface ApplicationListProps {
  userId: string;
}

const ApplicationListPage: FC<ApplicationListProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const getApplications = async () => {
      const resp = await fetch(
        "/api/v1/applications?user=" + userId + "&status=" + status
      );
      if (resp.status === 200 || resp.status === 304) {
        setApplications(await resp.json());
      } else {
        console.error("failed to fetch applications!", resp.status, resp);
      }
      setLoading(false);
    };

    getApplications().catch(console.error);
  }, [userId, status]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <QueryTabs
        tabs={[
          {
            value: "pending",
            title: "Pending",
          },
          {
            value: "accepted",
            title: "Accepted",
          },
          {
            value: "rejected",
            title: "Rejected",
          },
        ]}
        onTabSelect={(t) => setStatus(t.value)}
      />
      {applications
        .sort(
          (a: Application, b: Application) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .map((application) => (
          <ApplicationPreview key={application.id} application={application} />
        ))}
    </>
  );
};

export default ApplicationListPage;
