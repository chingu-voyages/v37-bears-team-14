import { FC } from "react";

interface ApplicationStatusProps {
  status: string;
}
const ApplicationStatus: FC<ApplicationStatusProps> = ({ status }) => {
  return (
    <div className="text-sm bg-slate-400 inline-block px-2 rounded text-white">
      {status}
    </div>
  );
};

export default ApplicationStatus;
