import { FC, useEffect, useState } from "react";
import LoadingSpinner from "../../../Spinners/LoadingSpinner";
import moment from "moment";
import { Link, useSearchParams } from "react-router-dom";
import useMember from "../../hooks/useMember";
import { Application } from "../../../../shared/Interfaces";
import getBlurb from "./getBlurb";

interface ApplicationListProps {
  projectId: string;
}

const ApplicationList: FC<ApplicationListProps> = ({ projectId }) => {
  const { isMember } = useMember(projectId);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get("tab");

  useEffect(() => {
    if (!tab) {
      setSearchParams({ tab: "pending" });
    }
  }, [tab, setSearchParams]);

  useEffect(() => {
    const getApplications = async () => {
      if (!isMember || !tab) return;

      const resp = await fetch(
        "/api/v1/applications?project=" + projectId + "&status=" + tab
      );
      if (resp.status === 200 || resp.status === 304) {
        setApplications(await resp.json());
      } else {
        console.error("failed to fetch applications", resp.status, resp);
      }
      setLoading(false);
    };

    getApplications().catch(console.error);
  }, [isMember, projectId, tab]);

  if (loading) {
    return (
      <div className="mx-3 md:mx-8 my-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex mb-3">
        <div
          className={
            "font-semibold my-1 mr-1 cursor-pointer px-6 py-1 rounded hover:bg-slate-200 " +
            (tab === "pending"
              ? " text-slate-900 bg-slate-100 "
              : " text-slate-500")
          }
          onClick={() => setSearchParams({ tab: "pending" })}
        >
          Pending
        </div>
        <div
          className={
            "font-semibold my-1 mr-1 cursor-pointer px-6 py-1 rounded hover:bg-slate-200 " +
            (tab === "accepted"
              ? " text-slate-900 bg-slate-100 "
              : " text-slate-500")
          }
          onClick={() => setSearchParams({ tab: "accepted" })}
        >
          Accepted
        </div>
        <div
          className={
            "font-semibold my-1 mr-1 cursor-pointer px-6 py-1 rounded hover:bg-slate-200 " +
            (tab === "closed"
              ? " text-slate-900 bg-slate-100 "
              : " text-slate-500")
          }
          onClick={() => setSearchParams({ tab: "closed" })}
        >
          Closed
        </div>
      </div>
      <table className="border-collapse w-full mb-8">
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
    </>
  );
};

export default ApplicationList;
