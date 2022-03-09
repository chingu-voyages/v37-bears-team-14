import { FC, useState } from "react";
import { Application } from "../../shared/Interfaces";
import { useEffect } from "react";
import ApplicationPreview from "./ApplicationPreview";
import LoadingSpinner from "../Spinners/LoadingSpinner";

interface ApplicationListProps {
  userId: string;
}

const ApplicationListPage: FC<ApplicationListProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const getApplications = async () => {
      const resp = await fetch("/api/v1/applications?user=" + userId);
      if (resp.status === 200 || resp.status === 304) {
        setApplications(await resp.json());
      } else {
        console.error("failed to fetch applications!", resp.status, resp);
      }
      setLoading(false);
    };

    getApplications().catch(console.error);
  }, [userId]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
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
