import Details from "../../../../info/Details";
import ApplicationStatus from "./ApplicationStatus";
import { Link } from "react-router-dom";

const ManagingApplicationsInfo = () => (
  <Details title="Managing Applications">
    <h1 className="mb-1 font-semibold text-sm">Actions</h1>
    <div className="mb-3 text-sm text-slate-700">
      <span className="italic">Accept</span> adds the user as a member to the
      project team under the requested role.
    </div>
    <div className="mb-3 text-sm text-slate-700">
      <span className="italic">Close</span> rejects the applicant and marks the
      application <ApplicationStatus status="closed" />. If the applicant is
      already a part of the team and needs to be removed, go to{" "}
      <Link to={"../settings/team"} className="underline text-emerald-600">
        Settings {">"} Team
      </Link>{" "}
      to remove the team member.
    </div>
    <div className="mb-3 text-sm text-slate-700">
      <span className="italic">Re-open</span> marks the application{" "}
      <ApplicationStatus status="pending" /> again.
    </div>
    <h1 className="mb-1 font-semibold text-sm">Statuses</h1>
    <div className="mb-3 text-sm text-slate-700">
      <ul>
        <li className="my-2">
          <ApplicationStatus status="pending" />{" "}
          <div>
            The application is awaiting review after a user first submits an
            application.
          </div>
        </li>
        <li className="my-2">
          <ApplicationStatus status="accepted" />{" "}
          <div>The application has been accepted.</div>
        </li>
        <li className="my-2">
          <ApplicationStatus status="closed" />{" "}
          <div>
            The applicant has been rejected and the application is closed.
          </div>
        </li>
      </ul>
    </div>
  </Details>
);

export default ManagingApplicationsInfo;
