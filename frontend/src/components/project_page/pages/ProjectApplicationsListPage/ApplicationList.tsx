import { FC, useEffect, useState } from "react";
import LoadingSpinner from "../../../Spinners/LoadingSpinner";
import moment from "moment";
import { Link } from "react-router-dom";
import useMember from "../../hooks/useMember";
import { Application } from "../../../../shared/Interfaces";

interface ApplicationListProps {
  projectId: string;
}

interface Blurb {
  summary: string | null;
  hasMore: boolean;
}

const getBlurb = (content: string | null, maxLength?: number): Blurb => {
  if (!content) return { summary: null, hasMore: false };

  maxLength = maxLength || 50;

  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    if (/[a-z]/i.test(lines[i])) {
      return {
        summary: lines[i].replace(/^[#*_~\s]*/, "").slice(0, maxLength),
        hasMore: i < lines.length - 1,
      };
    }
  }

  return {
    summary: content.slice(0, maxLength).replace("\n", " "),
    hasMore: true,
  };
};

const ApplicationList: FC<ApplicationListProps> = ({ projectId }) => {
  const { isMember } = useMember(projectId);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getApplications = async () => {
      if (!isMember) return;

      const resp = await fetch("/api/v1/applications?project=" + projectId);
      if (resp.status === 200 || resp.status === 304) {
        setApplications(await resp.json());
      } else {
        console.error("failed to fetch applications", resp.status, resp);
      }
      setLoading(false);
    };

    getApplications().catch(console.error);
  }, [isMember, projectId]);

  if (loading) {
    return (
      <div className="mx-3 md:mx-8 my-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <table className="border-collapse w-full">
      <tbody className="">
        {applications.map((application) => {
          const { summary, hasMore } = getBlurb(application.content);
          return (
            <tr className="" key={application.id}>
              <td className="py-3 border-t border-b border-slate-300 _w-full">
                <div className="">
                  <Link className="hover:underline" to={application.id}>
                    {application.user.username} ({application.requestedRole})
                  </Link>
                </div>
                <div className="text-xs text-slate-500 font-semibold">
                  Applied {moment(application.createdAt).fromNow()}
                </div>
                {summary && (
                  <div className="text-sm text-slate-600">
                    {summary}
                    {hasMore && "..."}
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ApplicationList;
